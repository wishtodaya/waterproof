// services/api/cases/types.ts

// 案例数据接口
export interface CaseData {
    id: number;
    title: string;
    type: string;
    description: string;
    area: string;
    duration: string;
    date: string;
    images: string[];
    content: string;
  }
  
  // 案例查询参数
  export interface CaseQueryParams {
    type: string;
    keyword: string;
    page: number;
    pageSize: number;
  }
  
  // 案例API响应基础接口 - 重命名为更具体的名称
  export interface CaseApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
  }
  
  // 案例列表API响应
  export interface CasesApiResponse extends CaseApiResponse<CaseData[]> {
    hasMore?: boolean; // 是否还有更多数据
  }