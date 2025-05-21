// services/api/index/indexApi.ts
import http from '../../http';
import { IndexData, ApiResponse } from './types';
import { indexData } from './data';

// API端点
const ENDPOINTS = {
  GET_INDEX_DATA: '/index',
};

/**
 * 获取首页所有数据
 */
export const getIndexData = async (): Promise<ApiResponse<IndexData>> => {
  try {
    // 替换为实际API调用当后端准备好时
    // const data = await http.get<IndexData>(ENDPOINTS.GET_INDEX_DATA);
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 返回模拟数据
    return {
      success: true,
      data: indexData
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '获取首页数据失败'
    };
  }
};

/**
 * 首页模块错误处理工具
 */
export const handleIndexError = (err: any): string => {
  console.error('Index API Error:', err);
  return err instanceof Error ? err.message : '获取首页数据时发生未知错误';
};

// 导出类型和数据
export * from './types';
export * from './data';