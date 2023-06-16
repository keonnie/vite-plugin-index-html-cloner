import { jest } from '@jest/globals'
import { default as origin } from 'node:fs/promises'

export const __mockAccess = jest.fn()
export const __mockCopyFile = jest.fn()
export const __mockMkdir = jest.fn()
export const __mockReaddir = jest.fn()

export const __mockReadFile = jest.fn()
export const __mockWriteFile = jest.fn()

jest.unstable_mockModule('node:fs/promises', () => ({
  ...origin,
  access: __mockAccess,
  copyFile: __mockCopyFile,
  mkdir: __mockMkdir,
  readdir: __mockReaddir,
  readFile: __mockReadFile,
  writeFile: __mockWriteFile,
}))

export const Promises = await import('node:fs/promises')
