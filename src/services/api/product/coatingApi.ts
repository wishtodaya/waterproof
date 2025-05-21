// 防水涂料产品API服务

import { 
  WaterproofCoating, 
  CoatingQueryParams, 
  ApiResponse, 
  CoatingListResponse, 
  CoatingDetailResponse 
} from './types';
import { mockCoatings, PAGE_SIZE } from './data';

/**
 * 获取防水涂料产品列表
 * @param params 查询参数
 * @returns 产品列表响应
 */
export const getCoatingList = async ({
  page,
  pageSize = PAGE_SIZE
}: CoatingQueryParams): Promise<CoatingListResponse> => {
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // 分页处理
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = mockCoatings.slice(startIndex, endIndex);
    
    // 判断是否还有更多数据
    const hasMore = endIndex < mockCoatings.length;
    
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
 * @param id 产品ID
 * @returns 产品详情响应
 */
export const getCoatingDetail = async (id: number): Promise<CoatingDetailResponse> => {
  try {
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

// 导出常量
export { PAGE_SIZE } from './data';

// 导出类型
export * from './types';