import Taro from '@tarojs/taro';

// 类型定义
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  code: number;
  result: T;
  timestamp: number;
}

export interface RequestConfig {
  loading?: boolean | string;  // false 不显示，true 显示默认文字，string 自定义文字
  toast?: boolean;             // 是否显示错误提示
  auth?: boolean;              // 是否需要认证（默认true）
}

// API配置
const API_CONFIG = {
  baseURL: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:8080/jeecg-boot'
    : 'https://your-api-domain.com/jeecg-boot',
  timeout: 10000,
};

// 请求类
class Request {
  private loadingCount = 0;

  // 基础请求方法
  private async baseRequest<T = any>(
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data?: any,
    config: RequestConfig = {}
  ): Promise<T> {
    const { loading = true, toast = true, auth = true } = config;

    // 完整URL
    const fullUrl = url.startsWith('http') ? url : `${API_CONFIG.baseURL}${url}`;

    // 请求头
    const header: any = {
      'content-type': 'application/json',
    };

    // 添加token
    if (auth) {
      const token = Taro.getStorageSync('X-Access-Token');
      if (token) {
        header['X-Access-Token'] = token;
      }
    }

    // 显示loading
    if (loading) {
      this.showLoading(typeof loading === 'string' ? loading : '加载中...');
    }

    try {
      const res = await Taro.request({
        url: fullUrl,
        method,
        data,
        header,
        timeout: API_CONFIG.timeout,
      });

      // 处理响应
      const response = res.data as ApiResponse<T>;

      // HTTP状态码检查
      if (res.statusCode !== 200) {
        throw new Error(`HTTP ${res.statusCode}`);
      }

      // 业务状态检查（jeecg-boot格式）
      if (!response.success) {
        // token过期
        if (response.code === 401) {
          this.handleAuthError();
        }
        throw new Error(response.message || '请求失败');
      }

      return response.result;
    } catch (error: any) {
      // 错误提示
      if (toast) {
        const message = error.message || '网络异常';
        Taro.showToast({
          title: message,
          icon: 'none',
          duration: 2000,
        });
      }

      throw error;
    } finally {
      if (loading) {
        this.hideLoading();
      }
    }
  }

  // 处理认证错误
  private handleAuthError() {
    Taro.removeStorageSync('X-Access-Token');
    Taro.removeStorageSync('userInfo');
    
    // 获取当前页面路径
    const pages = Taro.getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const currentPath = currentPage.route;
    
    // 如果不在登录页，跳转到登录页
    if (currentPath !== 'pages/login/index') {
      Taro.redirectTo({
        url: '/pages/login/index',
      });
    }
  }

  // Loading管理
  private showLoading(title: string) {
    this.loadingCount++;
    if (this.loadingCount === 1) {
      Taro.showLoading({ title, mask: true });
    }
  }

  private hideLoading() {
    this.loadingCount--;
    if (this.loadingCount === 0) {
      Taro.hideLoading();
    }
  }

  // 公共方法
  get<T = any>(url: string, data?: any, config?: RequestConfig) {
    return this.baseRequest<T>(url, 'GET', data, config);
  }

  post<T = any>(url: string, data?: any, config?: RequestConfig) {
    return this.baseRequest<T>(url, 'POST', data, config);
  }

  put<T = any>(url: string, data?: any, config?: RequestConfig) {
    return this.baseRequest<T>(url, 'PUT', data, config);
  }

  delete<T = any>(url: string, data?: any, config?: RequestConfig) {
    return this.baseRequest<T>(url, 'DELETE', data, config);
  }

  // 创建API方法，自动处理错误
  createApi<T = any>(
    requestFn: (...args: any[]) => Promise<T>
  ) {
    return async (...args: any[]): Promise<{ success: boolean; data?: T; error?: string }> => {
      try {
        const data = await requestFn(...args);
        return { success: true, data };
      } catch (error: any) {
        return { 
          success: false, 
          error: error.message || '请求失败' 
        };
      }
    };
  }
}

// 导出实例
const http = new Request();
export default http;