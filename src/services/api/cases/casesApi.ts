// services/api/cases/casesApi.ts
import { CaseData, CaseQueryParams, CaseApiResponse, CasesApiResponse } from './types';
import { mockCases, PAGE_SIZE, CITY_TYPES } from './data';

// API端点
const ENDPOINTS = {
  GET_CASES: '/cases',
  GET_CASE_DETAIL: '/cases/:id',
};

/**
 * 获取案例列表
 */
export const getCases = async ({
  city,
  keyword,
  page,
  pageSize
}: CaseQueryParams): Promise<CasesApiResponse> => {
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 过滤模拟数据
    let filteredData = mockCases.filter(item => {
      if (city !== 'all' && item.city !== city) return false;
      if (keyword && !item.title.includes(keyword) && !item.description.includes(keyword) && !item.city.includes(keyword)) return false;
      return true;
    });
    
    // 分页
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = filteredData.slice(startIndex, endIndex);
    
    // 判断是否还有更多数据
    const hasMore = endIndex < filteredData.length;
    
    return {
      success: true,
      data: paginatedData,
      hasMore
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '获取案例列表失败',
      data: []
    };
  }
};

/**
 * 根据ID获取案例详情
 */
export const getCaseDetail = async (id: number): Promise<CaseApiResponse<CaseData>> => {
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 查找案例
    const caseItem = mockCases.find(item => item.id === id);
    
    if (caseItem) {
      return {
        success: true,
        data: caseItem
      };
    } else {
      throw new Error('案例不存在');
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '获取案例详情失败'
    };
  }
};

/**
 * 错误处理工具
 */
export const handleCasesError = (err: any): string => {
  console.error(err);
  return err instanceof Error ? err.message : '发生未知错误';
};

// 直接导出常量
export { mockCases, PAGE_SIZE, CITY_TYPES };

// 导出类型
export * from './types';
export * from './data';