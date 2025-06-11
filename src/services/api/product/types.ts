export interface WaterproofCoating {
  id: number;
  title: string;             // 产品名称
  type: string;              // 产品规格
  specifications: string;    // 全国统一零售价
  description: string;       // 产品简介
  content: string;           // 适用范围
  images: string[];          // 产品图片列表
}

// 分页查询参数
export interface CoatingQueryParams {
  page: number;
  pageSize: number;
}

// API响应基础接口
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// 产品列表API响应
export interface CoatingListResponse extends ApiResponse<WaterproofCoating[]> {
  hasMore?: boolean;
}

// 产品详情API响应
export interface CoatingDetailResponse extends ApiResponse<WaterproofCoating> {}