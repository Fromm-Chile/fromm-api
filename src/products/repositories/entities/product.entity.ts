export class ProductEntity {
    id: number;
    slug: string;
    srcImg: string[];
    alt: string;
    category: string;
    subcategory: string;
    name: string;
    subtitle: string;
    desc: string;
    specifications: {
      key: string;
      value: string;
    }[];
    information: string;
    downloads: {
      name: string;
      link: string;
    }[];
    videos: string[];
  }