export interface CityOption {
  title: string;
  value: string;
}

export interface CaseData {
  id: number;
  title: string;
  city: string;
  description: string;
  date: string;
  images: string[];
  videos?: string[];
  content: string;
  coverImage?: string;
}

export interface CaseQueryParams {
  city?: string;
  keyword?: string;
  page?: number;
  pageSize?: number;
}