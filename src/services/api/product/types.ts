// types.ts - 防水涂料产品类型定义

// 防水涂料产品类型
export interface WaterproofCoating {
    id: number;
    title: string;
    type: string;
    description: string;
    specifications: string;
    dryTime: string;
    date: string;
    images: string[];
    content: string;
  }
  
  // 查询参数
  export interface CoatingQueryParams {
    type: string;
    keyword: string;
    page: number;
    pageSize: number;
  }
  
  // API响应基础接口
  export interface CoatingApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
  }
  
  // 产品列表API响应
  export interface CoatingsApiResponse extends CoatingApiResponse<WaterproofCoating[]> {
    hasMore?: boolean; // 是否还有更多数据
  }