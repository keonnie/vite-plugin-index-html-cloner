import { resolve } from 'node:path'
import YAML from 'yaml'
import {
  access,
  constants,
  mkdir,
  readdir,
  readFile,
  writeFile,
} from 'node:fs/promises'

const packagejson = await readFile(resolve('package.json'), 'utf8')
const pjson = JSON.parse(packagejson.toString())

const name = 'vite-plugin-index-html-cloner'
const version = pjson.version
const MAIN_FILE = 'index.html'

let vite_config = null

/**
 * Vi Plugin Hook when config
 * is resolved and store in local
 * for use in the flow
 * @param {Config} resolvedConfig
 */
function configResolved(resolvedConfig) {
  vite_config = resolvedConfig
}

/**
 * Check if the directory provided
 * is considered a view (where the
 * index.html should be copied in)
 * @param {String} root
 * @param {String} dir
 * @param {String} pattern
 * @returns {Promise<Bolean>}
 */
async function hasView(root, dir, pattern) {
  let path = resolve(root, dir, pattern)
  return pathExist(path)
}

/**
 * Check if file or dir exist
 * @param {String} path
 * @returns {Promise<Boolean>}
 */
async function pathExist(path) {
  return access(path, constants.R_OK)
    .then(() => true)
    .catch(() => false)
}

/**
 * Parse all the template literals variable
 * in a string to their equivalent provided
 * @param {String} str
 * @param {{*}} obj
 * @returns {String}
 */
function parseLiterals(str, obj) {
  let parts = str.split(/\{\{(?!\d)[\wæøåÆØÅ]*\}\}/)
  let args = str.match(/[^{{}}]+(?=}})/g)
  let parameters = args.map((argument) => obj[argument] ?? '')
  return String.raw({ raw: parts }, ...parameters)
}

async function rewriteFile(rootPath, outPath, indexContent, dirName = '') {
  const newPathFile = `${outPath}/${MAIN_FILE}`

  const seoConfigFilePath = resolve(rootPath, dirName, '.seo.yml')

  let seo = {}

  if (await pathExist(seoConfigFilePath)) {
    const yaml = await readFile(seoConfigFilePath)
    seo = YAML.parse(yaml.toString())
  }

  const parsed = parseLiterals(indexContent, seo)
  await writeFile(newPathFile, parsed, { encoding: 'utf-8' })
}

/**
 * Hook at the end of the flow
 * Create a directory for all sub directories
 * containing the specify file the config
 * and copy the main index.html file in those
 * sub directories.
 */
async function closeBundle() {
  if (vite_config.command !== 'build') return

  let mainIndexPath = resolve(vite_config.build.outDir, MAIN_FILE)
  // List all the view files
  let dirs = (await readdir(vite_config.root, { withFileTypes: true })).filter(
    (dirent) => dirent.isDirectory(),
  )

  const indexContent = (await readFile(mainIndexPath)).toString()

  for (let dir of dirs) {
    let isView = await hasView(
      vite_config.root,
      dir.name,
      vite_config.build.detectViewPattern,
    )

    if (!isView) continue

    let outPath = resolve(vite_config.build.outDir, dir.name)
    let dirExist = await pathExist(outPath)
    if (!dirExist) await mkdir(outPath)

    await rewriteFile(vite_config.root, outPath, indexContent, dir.name)
  }

  // Update main view if SEO file
  await rewriteFile(vite_config.root, vite_config.build.outDir, indexContent)
}

/**
 * Clone index.html file into sub folder
 * @returns {{
 *   name: String,
 *   version: String,
 *   configResolved: Function,
 *   closeBundle: Function,
 * }}
 */
export default function indexHTMLCloner() {
  return {
    name,
    version,
    configResolved,
    closeBundle,
  }
}
