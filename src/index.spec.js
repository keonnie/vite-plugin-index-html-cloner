import { MockFile, MockDir } from '../__mocks__'

const { mock_access, mock_copyFile, mock_mkdir, mock_readdir } = await import(
  '../__mocks__/node/fs/promises'
)
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
    mock_readdir.mockResolvedValue([
      new MockFile('index.html'),
      new MockDir('users'),
      new MockDir('tools'),
    ])

    mock_access.mockImplementation((path) => {
      if (!path.includes('tools')) return Promise.resolve()
      return Promise.reject()
    })
  })

  afterEach(() => {
    mock_access.mockReset()
    mock_copyFile.mockReset()
    mock_readdir.mockReset()
  })

  test('provide version', () => {
    let callbacks = indexHTMLCloner()
    expect(callbacks.version).toBeDefined()
  })

  test('copy index.html to subdirectory', async () => {
    mock_mkdir.mockResolvedValue()
    mock_copyFile.mockResolvedValue()

    let cfg = { ...defaultConfig, command: 'build' }
    let callbacks = indexHTMLCloner()
    callbacks.configResolved(cfg)
    await callbacks.closeBundle()

    expect(mock_copyFile).toHaveBeenCalledWith(
      expect.stringContaining('dist/index.html'),
      expect.stringContaining('dist/users/index.html'),
    )

    expect(mock_copyFile).not.toHaveBeenCalledWith(
      expect.stringContaining('dist/index.html'),
      expect.stringContaining('dist/tools/index.html'),
    )
  })

  test('do nothing if not build', async () => {
    let cfg = { ...defaultConfig, command: 'other' }
    let callbacks = indexHTMLCloner()
    callbacks.configResolved(cfg)
    await callbacks.closeBundle()

    expect(mock_readdir).not.toHaveBeenCalled()
  })

  test('do not attempt create dir if already exist', async () => {
    mock_readdir.mockResolvedValue([
      new MockFile('index.html'),
      new MockDir('users'),
      new MockDir('exist'),
    ])

    mock_access.mockImplementation((path) => {
      if (path.includes('view.html')) return Promise.resolve()
      if (path.includes('exist')) return Promise.resolve()
      return Promise.reject()
    })

    let cfg = { ...defaultConfig, command: 'build' }
    let callbacks = indexHTMLCloner()
    callbacks.configResolved(cfg)
    await callbacks.closeBundle()

    expect(mock_mkdir).toHaveBeenCalledTimes(1)
  })
})
