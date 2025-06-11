import http from '../../http';
import { CaseData, CaseQueryParams, CaseApiResponse, CasesApiResponse } from './types';

// API端点常量
const ENDPOINTS = {
  GET_CASES: '/api/cases/list',
  GET_CASE_DETAIL: '/api/cases',
} as const;

/**
 * 获取案例列表
 */
export const getCases = async ({
  city = 'all',
  keyword = '',
  page = 1,
  pageSize = 10
}: CaseQueryParams): Promise<CasesApiResponse> => {
  try {
    const params: any = { page, pageSize };
    
    if (city !== 'all') {
      params.city = city;
    }
    
    if (keyword) {
      params.keyword = keyword;
    }

    const response = await http.get(ENDPOINTS.GET_CASES, params);
    
    return {
      success: response.success || true,
      data: response.data || [],
      hasMore: response.hasMore || false
    };
  } catch (error: any) {
    console.error('获取案例列表失败:', error);
    return {
      success: false,
      error: error.message || '获取案例列表失败',
      data: [],
      hasMore: false
    };
  }
};

/**
 * 根据ID获取案例详情
 */
export const getCaseDetail = async (id: number): Promise<CaseApiResponse<CaseData>> => {
  try {
    if (!id || id <= 0) {
      throw new Error('无效的案例ID');
    }
    
    const response = await http.get(`${ENDPOINTS.GET_CASE_DETAIL}/${id}`);
    
    return {
      success: true,
      data: response
    };
  } catch (error: any) {
    console.error('获取案例详情失败:', error);
    return {
      success: false,
      error: error.message || '获取案例详情失败'
    };
  }
};