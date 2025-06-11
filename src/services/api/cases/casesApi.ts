import { CaseData, CaseQueryParams, CaseApiResponse, CasesApiResponse } from './types';
import { mockCases, PAGE_SIZE, CITY_TYPES } from './data';

// API端点常量
const ENDPOINTS = {
  GET_CASES: '/cases',
  GET_CASE_DETAIL: '/cases/:id',
} as const;

// API延迟配置
const API_DELAYS = {
  LIST: 800,
  DETAIL: 500,
} as const;

/**
 * 模拟API延迟
 */
const simulateDelay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * 获取案例列表
 */
export const getCases = async ({
  city = 'all',
  keyword = '',
  page = 1,
  pageSize = PAGE_SIZE
}: CaseQueryParams): Promise<CasesApiResponse> => {
  try {
    // 模拟API调用延迟
    await simulateDelay(API_DELAYS.LIST);
    
    // 过滤数据
    let filteredData = mockCases.filter(item => {
      // 城市筛选
      if (city !== 'all' && item.city !== city) return false;
      
      // 关键词搜索
      if (keyword) {
        const searchText = keyword.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(searchText);
        const matchDescription = item.description.toLowerCase().includes(searchText);
        const matchCity = item.city.toLowerCase().includes(searchText);
        
        if (!matchTitle && !matchDescription && !matchCity) return false;
      }
      
      return true;
    });
    
    // 计算分页
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
    // 参数验证
    if (!id || id <= 0) {
      throw new Error('无效的案例ID');
    }
    
    // 模拟API调用延迟
    await simulateDelay(API_DELAYS.DETAIL);
    
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
    console.error('获取案例详情失败:', error);
    return {
      success: false,
      error: error.message || '获取案例详情失败'
    };
  }
};

/**
 * 统一错误处理工具
 */
export const handleCasesError = (err: any): string => {
  console.error('案例API错误:', err);
  
  if (err instanceof Error) {
    return err.message;
  }
  
  if (typeof err === 'string') {
    return err;
  }
  
  return '发生未知错误，请稍后重试';
};

// 导出常量
export { mockCases, PAGE_SIZE, CITY_TYPES };

// 导出类型
export * from './types';
export * from './data';