import Taro from '@tarojs/taro';
import type { RequestInterceptor, ResponseInterceptor, ErrorInterceptor, HttpRequestOptions, ResponseData } from './types';
import { BUSINESS_CODE } from './config';

// 请求拦截器数组
const requestInterceptors: RequestInterceptor[] = [];

// 响应拦截器数组
const responseInterceptors: ResponseInterceptor[] = [];

// 错误拦截器数组
const errorInterceptors: ErrorInterceptor[] = [];

/**
 * 添加请求拦截器
 */
export function addRequestInterceptor(interceptor: RequestInterceptor): void {
  requestInterceptors.push(interceptor);
}

/**
 * 添加响应拦截器
 */
export function addResponseInterceptor(interceptor: ResponseInterceptor): void {
  responseInterceptors.push(interceptor);
}

/**
 * 添加错误拦截器
 */
export function addErrorInterceptor(interceptor: ErrorInterceptor): void {
  errorInterceptors.push(interceptor);
}

/**
 * 应用请求拦截器
 */
export async function applyRequestInterceptors(options: HttpRequestOptions): Promise<HttpRequestOptions> {
  let config = { ...options };
  
  for (const interceptor of requestInterceptors) {
    config = await interceptor(config);
  }
  
  return config;
}

/**
 * 应用响应拦截器
 */
export async function applyResponseInterceptors<T>(response: ResponseData<T>, options: HttpRequestOptions): Promise<ResponseData<T>> {
  let result = { ...response };
  
  for (const interceptor of responseInterceptors) {
    result = await interceptor(result, options);
  }
  
  return result;
}

/**
 * 应用错误拦截器
 */
export async function applyErrorInterceptors(error: any, options: HttpRequestOptions): Promise<any> {
  let result = error;
  
  for (const interceptor of errorInterceptors) {
    result = await interceptor(result, options);
  }
  
  return result;
}

// 添加微信Token拦截器
addRequestInterceptor(async (options) => {
  if (options.withToken) {
    try {
      // 优先使用微信token
      let token = Taro.getStorageSync('wx_token');
      
      // 如果没有微信token，尝试使用普通token
      if (!token) {
        token = Taro.getStorageSync('token');
      }
      
      if (token) {
        options.headers = {
          ...options.headers,
          'X-Access-Token': token  // jeecg-boot使用X-Access-Token
        };
      }
    } catch (error) {
      console.error('获取Token失败', error);
    }
  }
  
  return options;
});

// 添加默认日志拦截器
if (process.env.NODE_ENV === 'development') {
  // 请求日志
  addRequestInterceptor((options) => {
    console.log(`[Request] ${options.method} ${options.url}`, options.data);
    return options;
  });
  
  // 响应日志
  addResponseInterceptor((response, options) => {
    console.log(`[Response] ${options.method} ${options.url}`, response);
    return response;
  });
  
  // 错误日志
  addErrorInterceptor((error, options) => {
    console.error(`[Error] ${options.method} ${options.url}`, error);
    return error;
  });
}

// 添加默认Token过期处理
addErrorInterceptor((error, options) => {
  if (error && (error.code === 401 || error.code === BUSINESS_CODE.TOKEN_EXPIRED)) {
    // 清除本地Token
    Taro.removeStorageSync('wx_token');
    Taro.removeStorageSync('token');
    Taro.removeStorageSync('wx_user_info');
    
    // 跳转到登录页
    Taro.reLaunch({
      url: '/pages/login/index'
    });
  }
  
  return error;
});
