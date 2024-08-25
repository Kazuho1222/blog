export interface MetaType {
  pageTitle: string;
  pageDesc: string;
  pageImg?: string;
  pageImgW?: number;
  pageImgH?: number;
}

export interface PostType {
  title: string;
  slug: string;
  eyecatch: {
    url: string;
    width: number;
    height: number;
    blurDataURL?: string;
  };
}
