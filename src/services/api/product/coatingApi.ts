import http from '../../http';
import { 
  WaterproofCoating, 
  CoatingQueryParams, 
  CoatingListResponse, 
  CoatingDetailResponse 
} from './types';

const ENDPOINTS = {
  GET_PRODUCTS: '/api/products/list',
  GET_PRODUCT_DETAIL: '/api/products',
};

/**
 * 获取防水涂料产品列表
 */
export const getCoatingList = async ({
  page = 1,
  pageSize = 10
}: CoatingQueryParams): Promise<CoatingListResponse> => {
  try {
    const response = await http.get(ENDPOINTS.GET_PRODUCTS, { page, pageSize });
    
    return {
      success: response.success || true,
      data: response.data || [],
      hasMore: response.hasMore || false
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '获取产品列表失败',
      data: []
    };
  }
};

/**
 * 获取防水涂料产品详情
 */
export const getCoatingDetail = async (id: number): Promise<CoatingDetailResponse> => {
  try {
    const response = await http.get(`${ENDPOINTS.GET_PRODUCT_DETAIL}/${id}`);
    
    return {
      success: true,
      data: response
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '获取产品详情失败'
    };
  }
};
