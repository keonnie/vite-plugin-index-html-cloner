import { MockFile, MockDir } from '../__mocks__'

const { __mockAccess, __mockCopyFile, __mockMkdir, __mockReaddir } =
  await import('../__mocks__/node/fs/promises')
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
    __mockReaddir.mockResolvedValue([
      new MockFile('index.html'),
      new MockDir('users'),
      new MockDir('tools'),
    ])

    __mockAccess.mockImplementation((path) => {
      if (!path.includes('tools')) return Promise.resolve()
      return Promise.reject()
    })
  })

  afterEach(() => {
    __mockAccess.mockReset()
    __mockCopyFile.mockReset()
    __mockReaddir.mockReset()
  })

  test('provide version', () => {
    let callbacks = indexHTMLCloner()
    expect(callbacks.version).toBeDefined()
  })

  test('copy index.html to subdirectory', async () => {
    __mockMkdir.mockResolvedValue()
    __mockCopyFile.mockResolvedValue()

    let cfg = { ...defaultConfig, command: 'build' }
    let callbacks = indexHTMLCloner()
    callbacks.configResolved(cfg)
    await callbacks.closeBundle()

    expect(__mockCopyFile).toHaveBeenCalledWith(
      expect.stringContaining('dist/index.html'),
      expect.stringContaining('dist/users/index.html'),
    )

    expect(__mockCopyFile).not.toHaveBeenCalledWith(
      expect.stringContaining('dist/index.html'),
      expect.stringContaining('dist/tools/index.html'),
    )
  })

  test('do nothing if not build', async () => {
    let cfg = { ...defaultConfig, command: 'other' }
    let callbacks = indexHTMLCloner()
    callbacks.configResolved(cfg)
    await callbacks.closeBundle()

    expect(__mockReaddir).not.toHaveBeenCalled()
  })

  test('do not attempt create dir if already exist', async () => {
    __mockReaddir.mockResolvedValue([
      new MockFile('index.html'),
      new MockDir('users'),
      new MockDir('exist'),
    ])

    __mockAccess.mockImplementation((path) => {
      if (path.includes('view.html')) return Promise.resolve()
      if (path.includes('exist')) return Promise.resolve()
      return Promise.reject()
    })

    let cfg = { ...defaultConfig, command: 'build' }
    let callbacks = indexHTMLCloner()
    callbacks.configResolved(cfg)
    await callbacks.closeBundle()

    expect(__mockMkdir).toHaveBeenCalledTimes(1)
  })
})
