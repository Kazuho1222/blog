import { describe, expect, it } from 'vitest'
import { UploadResponseSchema } from '@/src/lib/schemas/upload'

describe('UploadResponseSchema', () => {
  it('urlがある場合はOK', () => {
    const result = UploadResponseSchema.parse({
      url: 'https://example.com/image.png',
    })

    expect(result.url).toBe('https://example.com/image.png')
  })

  it('idがある場合もOK', () => {
    const result = UploadResponseSchema.parse({
      id: 'abc123',
    })

    expect(result.id).toBe('abc123')
  })

  it('どちらもない場合はNG', () => {
    expect(() => UploadResponseSchema.parse({})).toThrow(
      "Either 'url' or 'id' must be provided",
    )
  })

  it('型が違うとエラー', () => {
    expect(() =>
      UploadResponseSchema.parse({
        url: 123,
      }),
    ).toThrow()
  })
})
