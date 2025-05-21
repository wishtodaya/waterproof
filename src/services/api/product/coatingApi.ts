// indexApi.ts - 防水涂料产品API

import http from '../../http';
import { WaterproofCoating, CoatingQueryParams, CoatingApiResponse, CoatingsApiResponse } from './types';
import { mockCoatings, PAGE_SIZE } from './data';

// API端点
const ENDPOINTS = {
  GET_COATINGS: '/coatings',
  GET_COATING_DETAIL: '/coatings/:id',
};

/**
 * 获取防水涂料产品列表
 */
export const getCoatingList = async ({
  type,
  keyword,
  page,
  pageSize = PAGE_SIZE
}: CoatingQueryParams): Promise<CoatingsApiResponse> => {
  try {
    // 实际API调用代码，待后端准备好后替换
    // return await http.get(ENDPOINTS.GET_COATINGS, { type, keyword, page, pageSize });
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // 过滤模拟数据
    let filteredData = mockCoatings.filter(item => {
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
      error: error.message || '获取产品列表失败',
      data: []
    };
  }
};

/**
 * 获取防水涂料产品详情
 */
export const getCoatingDetail = async (id: number): Promise<CoatingApiResponse<WaterproofCoating>> => {
  try {
    // 实际API调用代码，待后端准备好后替换
    // const url = ENDPOINTS.GET_COATING_DETAIL.replace(':id', id.toString());
    // return await http.get(url);
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 查找产品
    const product = mockCoatings.find(item => item.id === id);
    
    if (product) {
      return {
        success: true,
        data: product
      };
    } else {
      throw new Error('产品不存在');
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '获取产品详情失败'
    };
  }
};

/**
 * 错误处理工具
 */
export const handleCoatingError = (err: any): string => {
  console.error(err);
  return err instanceof Error ? err.message : '发生未知错误';
};

// 导出常量
export { PAGE_SIZE } from './data';
export { COATING_TYPES } from './data';

// 导出类型
export * from './types';