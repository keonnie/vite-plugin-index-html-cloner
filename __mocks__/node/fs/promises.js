import { jest } from '@jest/globals'
import { default as origin } from 'node:fs/promises'

export const __mockAccess = jest.fn()
export const __mockCopyFile = jest.fn()
export const __mockMkdir = jest.fn()
export const __mockReaddir = jest.fn()

jest.unstable_mockModule('node:fs/promises', () => ({
  ...origin,
  access: __mockAccess,
  copyFile: __mockCopyFile,
  mkdir: __mockMkdir,
  readdir: __mockReaddir,
}))

export const Promises = await import('node:fs/promises')
