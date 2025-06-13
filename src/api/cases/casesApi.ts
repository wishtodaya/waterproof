import http from 'src/utils/http';
import { CaseData, CaseQueryParams, CityOption } from './types';

// API端点常量
const ENDPOINTS = {
  GET_CASES: '/api/cases/list',
  GET_CASE_DETAIL: '/api/cases',
  GET_CITIES: '/api/cases/cities',
} as const;

export const casesApi = {
  /**
   * 获取案例列表
   */
  async getCases(params: CaseQueryParams) {
    const { city = 'all', keyword = '', page = 1, pageSize = 10 } = params;
    
    const queryParams: any = { page, pageSize };
    if (city !== 'all') queryParams.city = city;
    if (keyword) queryParams.keyword = keyword;
    
    const response = await http.get<{
      total: number;
      data: CaseData[];
      currentPage: number;
      totalPages: number;
    }>(ENDPOINTS.GET_CASES, queryParams);
    
    // 转换为统一的分页格式
    return {
      records: response.data || [],
      total: response.total || 0,
      size: pageSize,
      current: response.currentPage || page
    };
  },

  /**
   * 获取案例详情
   */
  async getCaseDetail(id: number) {
    if (!id || id <= 0) {
      throw new Error('无效的案例ID');
    }
    return http.get<CaseData>(`${ENDPOINTS.GET_CASE_DETAIL}/${id}`);
  },

  /**
   * 获取城市列表
   */
  async getCities() {
    return http.get<CityOption[]>(ENDPOINTS.GET_CITIES);
  }
};