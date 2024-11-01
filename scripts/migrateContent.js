const { createClient } = require('microcms-js-sdk')
const dotenv = require('dotenv')

dotenv.config({ path: '.env.local' })

if (!process.env.MICROCMS_SERVICE_DOMAIN || !process.env.MICROCMS_API_KEY) {
  throw new Error('MICROCMS_SERVICE_DOMAINとMICROCMS_API_KEYは必須です。')
}

const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_API_KEY,
})

async function migrateContentToNewField() {
  try {
    // 旧リッチエディタのデータ取得
    const posts = await client.get({ endpoint: 'blogs' })

    for (const post of posts.contents) {
      const contentHTML = post.content // 旧リッチエディタのフィールド

      // WRITE APIで新フィールドにデータを書き込み
      await client.update({
        endpoint: 'blogs',
        contentId: post.id,
        content: { _content: contentHTML }, // 新フィールドにHTMLを格納
      })

      console.log(`Post ${post.id} has been migrated to _content field.`)
    }
  } catch (error) {
    console.error('Error migrating content:', error)
  }
}

migrateContentToNewField()
  .then(() => {
    console.log('Migration completed.')
  })
  .catch((error) => {
    console.error('Migration failed:', error)
  })
