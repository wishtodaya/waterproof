// 请求方法类型
export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

// 请求配置
export interface HttpRequestConfig {
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

// 请求参数 - 重命名避免冲突
export interface HttpRequestOptions extends HttpRequestConfig {
  // 请求地址
  url: string;
  // 请求方法
  method?: RequestMethod;
  // 请求数据
  data?: any;
}

// jeecg-boot响应数据结构
export interface ResponseData<T = any> {
  success?: boolean;  // jeecg-boot成功标识
  code?: number;      // 状态码
  message?: string;   // 消息
  result?: T;         // jeecg-boot数据字段
  data?: T;          // 通用数据字段
  timestamp?: number; // 时间戳
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

// 请求拦截器 - 使用重命名后的类型
export type RequestInterceptor = (options: HttpRequestOptions) => HttpRequestOptions | Promise<HttpRequestOptions>;

// 响应拦截器
export type ResponseInterceptor = <T>(response: ResponseData<T>, options: HttpRequestOptions) => ResponseData<T> | Promise<ResponseData<T>>;

// 错误拦截器
export type ErrorInterceptor = (error: any, options: HttpRequestOptions) => any;