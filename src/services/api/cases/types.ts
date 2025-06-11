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

// 案例查询参数
export interface CaseQueryParams {
  city?: string;
  keyword?: string;
  page?: number;
  pageSize?: number;
}

// 案例API响应基础接口
export interface CaseApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// 案例列表API响应
export interface CasesApiResponse extends CaseApiResponse<CaseData[]> {
  hasMore?: boolean;
  total?: number;
  currentPage?: number;
  totalPages?: number;
}