/**
 * Mock a file
 */
export default class MockFile {
  /**
   * Constructor
   * @param {String} name
   */
  constructor(name) {
    this.name = name
  }

  /**
   * Check if directory
   * @returns {Boolean} isDir
   */
  isDirectory() {
    return false
  }
}
