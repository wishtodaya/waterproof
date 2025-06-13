export interface WaterproofCoating {
  id: number;
  title: string;
  type: string;
  specifications: string;
  description: string;
  content: string;
  images: string[];
}

export interface CoatingQueryParams {
  page: number;
  pageSize: number;
}