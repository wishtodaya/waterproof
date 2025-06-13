import http from 'src/utils/http';
import { WaterproofCoating, CoatingQueryParams } from './types';

const ENDPOINTS = {
  GET_PRODUCTS: '/api/products/list',
  GET_PRODUCT_DETAIL: '/api/products',
};

export const coatingApi = {
  /**
   * 获取产品列表
   */
  async getCoatingList(params: CoatingQueryParams) {
    const { page = 1, pageSize = 10 } = params;
    
    const response = await http.get<{
      data: WaterproofCoating[];
      total: number;
      currentPage: number;
      totalPages: number;
      size: number;
      hasMore: boolean;
    }>(ENDPOINTS.GET_PRODUCTS, { page, pageSize });
    
    // 转换为统一的分页格式
    return {
      records: response.data || [],
      total: response.total || 0,
      size: response.size || pageSize,
      current: response.currentPage || page
    };
  },

  /**
   * 获取产品详情
   */
  async getCoatingDetail(id: number) {
    if (!id || id <= 0) {
      throw new Error('无效的产品ID');
    }
    return http.get<WaterproofCoating>(`${ENDPOINTS.GET_PRODUCT_DETAIL}/${id}`);
  }
};