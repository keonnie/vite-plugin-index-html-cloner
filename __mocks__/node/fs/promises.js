import { jest } from '@jest/globals'
import { default as origin } from 'node:fs/promises'

export const mock_access = jest.fn()
export const mock_copyFile = jest.fn()
export const mock_mkdir = jest.fn()
export const mock_readdir = jest.fn()

jest.unstable_mockModule('node:fs/promises', () => ({
  ...origin,
  access: mock_access,
  copyFile: mock_copyFile,
  mkdir: mock_mkdir,
  readdir: mock_readdir,
}))

export const Promises = await import('node:fs/promises')
