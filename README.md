# CUBE（Blogサイト）

[![Deploy](https://img.shields.io/badge/Deploy-Vercel-blue)](https://nextjs-microcms-blog-vert.vercel.app/)  
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## 概要

このプロジェクトは、以下の書籍を利用し、一部分を改修・開発し **さらにブログとしての追加機能を実装し** より利用者に使いやすくすることを目的として開発されました。  
[作って学ぶ Next.js/React Webサイト構築](https://ebisu.com/next-react-website/)  
未経験からプログラミングスキルを身につけるため、**React、Next.js、** を活用しています。

### 主な機能

- **新規ブログ作成機能**: ナビゲーションバーに表示されている「Create-Blog」ボタンを押すと、新規ブログ作成画面に遷移し、必須項目入力後、「送信」ボタンを押すとブログが作成され、トップ画面に戻ります。
- **ブログ編集機能**: 各ブログページ内にある「Edit」ボタンを押すと、現在の入力内容が項目に入った状態でブログ編集画面に遷移し、編集後、「更新」ボタンを押すとブログが更新され、トップ画面に戻ります。
- **ブログ削除機能**: 各ブログページ内にある「Delete」ボタンを押すと、アラートが表示され、「はい」を押すと該当のブログが削除され、トップ画面に戻ります。「いいえ」を押すと元のブログ画面に戻ります。

---

## デモ

![デモGIFやスクリーンショット]()  
[デプロイ先はこちら](https://nextjs-microcms-blog-vert.vercel.app/)

---

## 使用技術

- **フロントエンド**: React, Next.js, TypeScript
- **開発環境の準備**: Node.js, git
- **ヘッドレスCMS**: microCMS
- **デザイン**: CSS Modules, styled-jsx, TailwindCSS
- **その他**: Vercel（デプロイ）, Cusor（エディター）

---

## セットアップ方法

1. リポジトリをクローンします:
   ```bash
   git clone https://github.com/Kazuho1222/blog.git
   ```
