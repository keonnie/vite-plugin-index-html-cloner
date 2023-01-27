import { resolve } from 'node:path'
import {
  access,
  constants,
  mkdir,
  readdir,
  readFile,
  copyFile,
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

    await copyFile(mainIndexPath, `${outPath}/${MAIN_FILE}`)
  }
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
