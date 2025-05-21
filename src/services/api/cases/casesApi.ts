// services/api/cases/casesApi.ts
import http from '../../http';
import { CaseData, CaseQueryParams, CaseApiResponse, CasesApiResponse } from './types';
import { mockCases, PAGE_SIZE, CASES_TYPES } from './data';

// API端点
const ENDPOINTS = {
  GET_CASES: '/cases',
  GET_CASE_DETAIL: '/cases/:id',
};

/**
 * 获取案例列表
 */
export const getCases = async ({
  type,
  keyword,
  page,
  pageSize
}: CaseQueryParams): Promise<CasesApiResponse> => {
  try {
    // 替换为实际API调用当后端准备好时
    // const data = await http.get(ENDPOINTS.GET_CASES, { type, keyword, page, pageSize });
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 过滤模拟数据
    let filteredData = mockCases.filter(item => {
      if (type !== 'all' && item.type !== type) return false;
      if (keyword && !item.title.includes(keyword) && !item.description.includes(keyword)) return false;
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
    // 替换为实际API调用当后端准备好时
    // const url = ENDPOINTS.GET_CASE_DETAIL.replace(':id', id.toString());
    // const data = await http.get(url);
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 800));
    
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
 * 错误处理工具 - 重命名为handleCasesError
 */
export const handleCasesError = (err: any): string => {
  console.error(err);
  return err instanceof Error ? err.message : '发生未知错误';
};

// 直接导出常量
export { mockCases, PAGE_SIZE, CASES_TYPES };

// 导出类型
export * from './types';
export * from './data';