import MockFile from './file'

/**
 * Mock a directory
 */
export default class MockDir extends MockFile {
  /**
   * Constructor
   * @param {String} name
   */
  constructor(name) {
    super(name)
  }

  /**
   * Check if directory
   * @returns {Boolean} isDir
   */
  isDirectory() {
    return true
  }
}
