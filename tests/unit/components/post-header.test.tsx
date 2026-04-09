import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import PostHeader from '@/src/components/post-header'

describe('PostHeader Component', () => {
  const props = {
    title: 'テスト記事のタイトル',
    subtitle: 'テストカテゴリ',
    publish: '2026-04-08T10:00:00Z',
  }

  it('タイトルとサブタイトルが正しく表示される', () => {
    render(<PostHeader {...props} />)

    expect(screen.getByText('テスト記事のタイトル')).toBeInTheDocument()
    expect(screen.getByText('テストカテゴリ')).toBeInTheDocument()
  })

  it('日付が日本語形式で正しく変換されて表示される', () => {
    render(<PostHeader {...props} />)

    // ConvertDate コンポーネントによる変換結果を確認
    expect(screen.getByText('2026年04月08日')).toBeInTheDocument()
    // time要素のdateTime属性も確認
    expect(screen.getByText('2026年04月08日').closest('time')).toHaveAttribute(
      'dateTime',
      props.publish
    )
  })

  it('publishが空の場合、日付セクションが表示されない', () => {
    render(<PostHeader title="タイトル" subtitle="サブ" publish="" />)

    expect(screen.queryByText('2026年04月08日')).not.toBeInTheDocument()
    // 時計アイコン（FontAwesomeIcon）が含まれる要素も存在しないはず
    // ここでは単純に time タグがないことを確認
    expect(screen.queryByRole('time')).not.toBeInTheDocument()
  })
})
