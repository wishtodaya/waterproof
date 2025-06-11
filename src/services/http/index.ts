import { request } from './request';
import type { HttpRequestOptions } from './types';
import { addRequestInterceptor, addResponseInterceptor, addErrorInterceptor } from './interceptor';
import { clearAllCache, clearCacheData } from './cache';

/**
 * HTTP客户端
 */
const http = {
  /**
   * 发送GET请求
   */
  get: <T = any>(url: string, data?: any, options?: Partial<HttpRequestOptions>) => 
    request<T>({ url, method: 'GET', data, ...options }),
  
  /**
   * 发送POST请求
   */  
  post: <T = any>(url: string, data?: any, options?: Partial<HttpRequestOptions>) => 
    request<T>({ url, method: 'POST', data, ...options }),
  
  /**
   * 发送PUT请求
   */
  put: <T = any>(url: string, data?: any, options?: Partial<HttpRequestOptions>) => 
    request<T>({ url, method: 'PUT', data, ...options }),
  
  /**
   * 发送DELETE请求
   */
  delete: <T = any>(url: string, data?: any, options?: Partial<HttpRequestOptions>) => 
    request<T>({ url, method: 'DELETE', data, ...options }),
  
  /**
   * 原始请求方法
   */
  request,
  
  /**
   * 清除指定缓存
   */
  clearCache: clearCacheData,
  
  /**
   * 清除所有缓存
   */
  clearAllCache,
  
  /**
   * 添加请求拦截器
   */
  addRequestInterceptor,
  
  /**
   * 添加响应拦截器
   */
  addResponseInterceptor,
  
  /**
   * 添加错误拦截器
   */
  addErrorInterceptor
};

export default http;

// 导出类型
export * from './types';
export { DEFAULT_CONFIG } from './config';