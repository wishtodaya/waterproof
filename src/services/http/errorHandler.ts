import Taro from '@tarojs/taro';
import { HTTP_STATUS, BUSINESS_CODE } from './config';
import type { RequestError, RequestOptions } from './types';

/**
 * 处理HTTP状态错误
 */
export function handleHttpError(statusCode: number): RequestError {
  let message = '未知错误';
  
  switch (statusCode) {
    case HTTP_STATUS.BAD_REQUEST:
      message = '请求参数错误';
      break;
    case HTTP_STATUS.UNAUTHORIZED:
      message = '未授权，请登录';
      break;
    case HTTP_STATUS.FORBIDDEN:
      message = '没有权限访问';
      break;
    case HTTP_STATUS.NOT_FOUND:
      message = '请求资源不存在';
      break;
    case HTTP_STATUS.SERVER_ERROR:
      message = '服务器内部错误';
      break;
    default:
      message = `HTTP错误 (${statusCode})`;
  }
  
  return {
    code: statusCode,
    message
  };
}

/**
 * 处理业务状态错误
 */
export function handleBusinessError<T>(response: { code: number; message: string; data?: T }): RequestError {
  let message = response.message || '未知错误';
  
  switch (response.code) {
    case BUSINESS_CODE.TOKEN_EXPIRED:
      message = '登录已过期，请重新登录';
      break;
    case BUSINESS_CODE.PARAM_ERROR:
      message = '参数错误';
      break;
    case BUSINESS_CODE.SERVER_ERROR:
      message = '服务器内部错误';
      break;
  }
  
  return {
    code: response.code,
    message,
    data: response.data
  };
}

/**
 * 处理网络错误
 */
export function handleNetworkError(error: any): RequestError {
  let message = '网络异常';
  
  if (error?.errMsg) {
    if (error.errMsg.includes('timeout')) {
      message = '请求超时，请检查网络';
    } else if (error.errMsg.includes('fail')) {
      message = '网络连接失败，请检查网络设置';
    }
  }
  
  return {
    code: -1,
    message
  };
}

/**
 * 综合错误处理
 */
export function handleRequestError(error: any, options: RequestOptions): RequestError {
  // 已格式化的错误
  if (error && typeof error === 'object' && 'code' in error && 'message' in error) {
    if (options.showErrorToast) {
      Taro.showToast({
        title: error.message,
        icon: 'none',
        duration: 2000
      });
    }
    
    return error as RequestError;
  }
  
  // HTTP错误
  if (error && typeof error === 'object' && 'statusCode' in error) {
    const httpError = handleHttpError(error.statusCode);
    
    if (options.showErrorToast) {
      Taro.showToast({
        title: httpError.message,
        icon: 'none',
        duration: 2000
      });
    }
    
    return httpError;
  }
  
  // 网络错误
  if (error && typeof error === 'object' && 'errMsg' in error) {
    const networkError = handleNetworkError(error);
    
    if (options.showErrorToast) {
      Taro.showToast({
        title: networkError.message,
        icon: 'none',
        duration: 2000
      });
    }
    
    return networkError;
  }
  
  // 其他错误
  const unknownError: RequestError = {
    code: -1,
    message: typeof error === 'string' ? error : '未知错误'
  };
  
  if (options.showErrorToast) {
    Taro.showToast({
      title: unknownError.message,
      icon: 'none',
      duration: 2000
    });
  }
  
  return unknownError;
}