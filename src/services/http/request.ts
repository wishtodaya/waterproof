import Taro from '@tarojs/taro';
import type { RequestOptions, ResponseData } from './types';
import { DEFAULT_CONFIG, BUSINESS_CODE } from './config';
import { applyRequestInterceptors, applyResponseInterceptors, applyErrorInterceptors } from './interceptor';
import { handleRequestError, handleBusinessError } from './errorHandler';
import { generateCacheKey, getCacheData, setCacheData, isCacheValid } from './cache';

// 请求计数器
let loadingCount = 0;

/**
 * 显示加载提示
 */
function showLoading(text: string): void {
  loadingCount++;
  
  if (loadingCount === 1) {
    Taro.showLoading({ title: text });
  }
}

/**
 * 隐藏加载提示
 */
function hideLoading(): void {
  loadingCount--;
  
  if (loadingCount === 0) {
    Taro.hideLoading();
  }
}

/**
 * 延迟函数
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 统一请求函数
 */
export async function request<T = any>(options: RequestOptions): Promise<T> {
  // 合并配置
  const config = { ...DEFAULT_CONFIG, ...options };
  const { url, method = 'GET', data, baseURL, showLoading: shouldShowLoading, loadingText, useCache, cacheTime, retry, retryDelay } = config;
  
  // 完整URL
  const fullUrl = url.startsWith('http') ? url : `${baseURL}${url.startsWith('/') ? url : `/${url}`}`;
  
  // 检查缓存
  if (useCache && method === 'GET') {
    const cacheKey = generateCacheKey(fullUrl, data);
    const cached = getCacheData<T>(cacheKey);
    
    if (cached && isCacheValid(cached, cacheTime || DEFAULT_CONFIG.cacheTime || 0)) {
      return cached.data;
    }
  }
  
  // 请求前处理
  let requestConfig = await applyRequestInterceptors({ ...config, url: fullUrl });
  
  // 重试计数
  let retryCount = retry || 0;
  
  // 显示加载提示
  if (shouldShowLoading) {
    showLoading(loadingText || '加载中');
  }
  
  try {
    // 发送请求
    const executeRequest = async (): Promise<T> => {
      try {
        const response = await Taro.request({
          url: fullUrl,
          data: requestConfig.data,
          method: requestConfig.method as any,
          header: requestConfig.headers,
          timeout: requestConfig.timeout
        });
        
        // HTTP状态检查
        if (response.statusCode !== 200) {
          throw { statusCode: response.statusCode };
        }
        
        // 业务状态检查
        const responseData = response.data as ResponseData<T>;
        
        if (responseData.code !== BUSINESS_CODE.SUCCESS) {
          throw handleBusinessError(responseData);
        }
        
        // 响应拦截处理
        const processedResponse = await applyResponseInterceptors(responseData, requestConfig);
        
        // 设置缓存
        if (useCache && method === 'GET') {
          const cacheKey = generateCacheKey(fullUrl, data);
          setCacheData(cacheKey, processedResponse.data);
        }
        
        return processedResponse.data;
      } catch (error) {
        // 请求失败但还有重试次数
        if (retryCount > 0) {
          retryCount--;
          // 延迟后重试
          await delay(retryDelay || DEFAULT_CONFIG.retryDelay || 1000);
          return executeRequest();
        }
        
        // 重试次数用完，向上抛出错误
        throw error;
      }
    };
    
    return await executeRequest();
  } catch (error) {
    // 错误处理
    const processedError = await applyErrorInterceptors(error, requestConfig);
    throw handleRequestError(processedError, requestConfig);
  } finally {
    // 隐藏加载提示
    if (shouldShowLoading) {
      hideLoading();
    }
  }
}