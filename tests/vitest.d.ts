import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers'

declare module 'vitest' {
  // Vitest 5 は Matchers<R, T>。jest-dom 7 は単一型引数の Assertion を拡張するため、ここで合わせる。
  interface Matchers<R = void, _T = unknown>
    extends TestingLibraryMatchers<unknown, R> {}
}
