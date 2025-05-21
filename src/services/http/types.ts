// 请求方法类型
export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

// 请求配置
export interface RequestConfig {
  // 基础URL
  baseURL?: string;
  // 是否显示加载提示
  showLoading?: boolean;
  // 加载提示文字
  loadingText?: string;
  // 是否显示错误提示
  showErrorToast?: boolean;
  // 请求头
  headers?: Record<string, string>;
  // 超时时间(ms)
  timeout?: number;
  // 是否使用缓存(仅GET请求)
  useCache?: boolean;
  // 缓存时间(ms)
  cacheTime?: number;
  // 重试次数
  retry?: number;
  // 重试延迟(ms)
  retryDelay?: number;
  // 是否自动携带token
  withToken?: boolean;
}

// 请求参数
export interface RequestOptions extends RequestConfig {
  // 请求地址
  url: string;
  // 请求方法
  method?: RequestMethod;
  // 请求数据
  data?: any;
}

// 响应数据结构
export interface ResponseData<T = any> {
  code: number;
  message: string;
  data: T;
}

// 缓存数据结构
export interface CacheData<T = any> {
  data: T;
  timestamp: number;
}

// 错误信息结构
export interface RequestError {
  code: number;
  message: string;
  data?: any;
}

// 请求拦截器
export type RequestInterceptor = (options: RequestOptions) => RequestOptions | Promise<RequestOptions>;

// 响应拦截器
export type ResponseInterceptor = <T>(response: ResponseData<T>, options: RequestOptions) => ResponseData<T> | Promise<ResponseData<T>>;

// 错误拦截器
export type ErrorInterceptor = (error: any, options: RequestOptions) => any;