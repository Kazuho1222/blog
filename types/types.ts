export interface MetaType {
  pageTitle: string;
  pageDesc: string;
  pageImg: any;
  pageImgW: number | undefined;
  pageImgH: number | undefined;
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
