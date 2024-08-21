import Link from 'next/link';
import styles from '../../styles/post-catefories.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen } from '@fortawesome/free-regular-svg-icons';

// カテゴリーの1つの要素を表す型
type Category = {
  name: string;
  slug: string;
};

// categoriesの型を定義
interface PostCategoriesProps {
  categories: Category[];
}

export default function PostCategories({ categories }: PostCategoriesProps) {
  return (
    <div className={styles.flexContainer}>
      <h3 className={styles.heading}>
        <FontAwesomeIcon icon={faFolderOpen} />
        <span className='sr-only'>Categories</span>
      </h3>
      <ul className={styles.list}>
        {categories.map(({ name, slug }) => (
          <li key={slug}>
            <Link href={`/blog/category/${slug}`}>
              {name}
            </Link>
          </li>
        ))}
      </ul>
    </div>

  )
}

