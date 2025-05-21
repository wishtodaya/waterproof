import type { RequestConfig } from './types';

// API基础URL
export const API_BASE_URL = {
  // 开发环境
  development: 'https://dev-api.example.com/v1',
  // 生产环境
  production: 'https://api.example.com/v1'
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
  SUCCESS: 0,           // 成功
  TOKEN_EXPIRED: 10001, // token过期
  PARAM_ERROR: 10002,   // 参数错误
  SERVER_ERROR: 50000   // 服务器错误
};

// 默认请求配置
export const DEFAULT_CONFIG: RequestConfig = {
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