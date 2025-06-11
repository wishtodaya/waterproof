import type { HttpRequestConfig } from './types';

// API基础URL
export const API_BASE_URL = {
  // 开发环境
  development: 'http://localhost:8080/jeecg-boot',
  // 生产环境
  production: 'https://your-api-domain.com/jeecg-boot'
};

// 环境判断
export const ENV = process.env.NODE_ENV || 'development';

// HTTP状态码
export const HTTP_STATUS = {
  SUCCESS: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
};

// 业务状态码
export const BUSINESS_CODE = {
  SUCCESS: 200,           // jeecg-boot成功状态码
  TOKEN_EXPIRED: 401,     // token过期
  PARAM_ERROR: 400,       // 参数错误
  SERVER_ERROR: 500       // 服务器错误
};

// 默认请求配置
export const DEFAULT_CONFIG: HttpRequestConfig = {
  baseURL: API_BASE_URL[ENV],
  showLoading: true,
  loadingText: '加载中',
  showErrorToast: true,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000,       // 10秒
  useCache: false,
  cacheTime: 5 * 60 * 1000,  // 5分钟
  retry: 0,
  retryDelay: 1000,
  withToken: true
};
