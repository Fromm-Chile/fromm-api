export class ProductEntity {
  id: number;
  slug: string;
  srcImg: string[]; // tabla aparte
  alt: string;
  idCategory: number; // referencia
  name: string;
  subtitle: string;
  desc: string;
  jsonDetails: JsonDetails;
}

export interface JsonDetails {
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

export class CategoryEntity {
  id: number;
  name: string;
  parentCategory?: string;
}
