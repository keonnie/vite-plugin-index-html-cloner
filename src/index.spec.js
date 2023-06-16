import { MockFile, MockDir } from '../__mocks__'

const {
  __mockAccess,
  __mockCopyFile,
  __mockMkdir,
  __mockReaddir,
  __mockReadFile,
  __mockWriteFile,
} = await import('../__mocks__/node/fs/promises')

const htmlIndex = `
<head>
  <meta description="{{description}}">
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "contactPoint": {
        "contactType": "General enquiry",
        "email": "info@keonnie.com"
      },
      "description": "{{description}}",
      "email": "info@test.com",
      "logo": "https://keonnie.com/images/logo-colored.svg",
      "name": "Keonnie",
      "url": "https://keonnie.com"
    }
  </script>
<head>
<body>
  <h1>Content of HTML pages</h1>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
<body>
`

const YAML_MAIN_SEO = `
title: More about product
description: Main Page SEO
`
const YAML_USERS_SEO = `
description: Custom SEO users page
`

/**
 * Stub read file method
 * to return specific content
 * depending on the call
 * @param {String} name
 * @returns {String}
 */
function stubReadFile(name) {
  if (name.endsWith('package.json'))
    return Buffer.from(JSON.stringify({ version: '0.0.0' }))
  if (name.endsWith('users/.seo.yml')) return Buffer.from(YAML_USERS_SEO)
  if (name.endsWith('src/.seo.yml')) return Buffer.from(YAML_MAIN_SEO)
  return Buffer.from(htmlIndex)
}

__mockReadFile.mockImplementation(stubReadFile)

const { default: indexHTMLCloner } = await import('.')

describe('Unit | Package', () => {
  const defaultConfig = Object.freeze({
    root: 'src',
    build: {
      outDir: 'dist',
      detectViewPattern: 'view.html',
    },
  })

  beforeEach(() => {
    __mockReadFile.mockImplementation(stubReadFile)
  })

  beforeEach(() => {
    __mockReaddir.mockResolvedValue([
      new MockFile('index.html'),
      new MockDir('users'),
      new MockDir('tools'),
      new MockDir('exist'),
    ])

    __mockAccess.mockImplementation((path) => {
      if (path.endsWith('/exist/.seo.yml')) return Promise.reject()
      if (!path.includes('tools')) return Promise.resolve()
      return Promise.reject()
    })
  })

  afterEach(() => {
    __mockAccess.mockReset()
    __mockCopyFile.mockReset()
    __mockMkdir.mockReset()
    __mockReaddir.mockReset()
    __mockReadFile.mockReset()
    __mockWriteFile.mockReset()
  })

  it('provide version', () => {
    let callbacks = indexHTMLCloner()
    expect(callbacks.version).toBeDefined()
  })

  it('exclude subdirectory without view', async () => {
    __mockMkdir.mockResolvedValue()

    let cfg = { ...defaultConfig, command: 'build' }
    let callbacks = indexHTMLCloner()
    callbacks.configResolved(cfg)
    await callbacks.closeBundle()

    expect(__mockWriteFile).not.toHaveBeenCalledWith(
      expect.stringContaining('dist/tools/index.html'),
      expect.any(Object),
      expect.any(Object),
    )
  })

  it('do nothing if not build', async () => {
    let cfg = { ...defaultConfig, command: 'other' }
    let callbacks = indexHTMLCloner()
    callbacks.configResolved(cfg)
    await callbacks.closeBundle()

    expect(__mockReaddir).not.toHaveBeenCalled()
  })

  it('create dir if not exist', async () => {
    __mockMkdir.mockResolvedValue()
    __mockAccess.mockImplementation((path) => {
      if (path.endsWith('users/view.html')) return Promise.resolve()
      return Promise.reject()
    })

    let cfg = { ...defaultConfig, command: 'build' }
    let callbacks = indexHTMLCloner()
    callbacks.configResolved(cfg)
    await callbacks.closeBundle()

    // Not being called as only 'users' would
    // needs to generate a index file based on
    // what is setup in this test suite.
    expect(__mockMkdir).toHaveBeenCalled()
  })

  it('do not attempt create dir if already exist', async () => {
    __mockAccess.mockImplementation((path) => {
      if (path.includes('users')) return Promise.resolve()
      return Promise.reject()
    })

    let cfg = { ...defaultConfig, command: 'build' }
    let callbacks = indexHTMLCloner()
    callbacks.configResolved(cfg)
    await callbacks.closeBundle()

    // Not being called as only 'users' would
    // needs to generate a index file based on
    // what is setup in this test suite.
    expect(__mockMkdir).not.toHaveBeenCalled()
  })

  it('update meta description and create index file', async () => {
    __mockMkdir.mockResolvedValue()

    let cfg = { ...defaultConfig, command: 'build' }
    let callbacks = indexHTMLCloner()
    callbacks.configResolved(cfg)
    await callbacks.closeBundle()

    expect(__mockWriteFile).toHaveBeenCalledWith(
      expect.stringContaining('users/index.html'),
      expect.stringContaining('<meta description="Custom SEO users page">'),
      { encoding: 'utf-8' },
    )
  })

  it('update meta description for main index file', async () => {
    __mockMkdir.mockResolvedValue()

    let cfg = { ...defaultConfig, command: 'build' }
    let callbacks = indexHTMLCloner()
    callbacks.configResolved(cfg)
    await callbacks.closeBundle()

    expect(__mockWriteFile).toHaveBeenCalledWith(
      expect.stringContaining(`${defaultConfig.build.outDir}/index.html`),
      expect.stringContaining('<meta description="Main Page SEO">'),
      { encoding: 'utf-8' },
    )

    expect(__mockWriteFile).toHaveBeenCalledWith(
      expect.stringContaining(`${defaultConfig.build.outDir}/index.html`),
      expect.stringContaining('"description": "Main Page SEO"'),
      { encoding: 'utf-8' },
    )
  })
})
