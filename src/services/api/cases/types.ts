// services/api/cases/types.ts

// 案例数据接口
export interface CaseData {
  id: number;
  title: string;
  city: string; // 城市，替代原来的type
  description: string;
  date: string; // 施工时间
  images: string[];
  videos?: string[]; // 视频列表（可选）
  content: string;
}

// 案例查询参数
export interface CaseQueryParams {
  city: string; // 城市筛选，替代原来的type
  keyword: string;
  page: number;
  pageSize: number;
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