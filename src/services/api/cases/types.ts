// 案例数据接口
export interface CaseData {
  id: number;
  title: string;
  city: string;
  description: string;
  date: string;
  images: string[];
  videos?: string[];
  content: string;
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
}

// 分页信息
export interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// 城市类型
export interface CityType {
  title: string;
  value: string;
}