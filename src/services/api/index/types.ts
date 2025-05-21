// services/index/api/types.ts

// 服务项接口 - 删除features属性
export interface Service {
    id: number | string;
    title: string;
    description: string;
}
  
// 精选案例接口
export interface Showcase {
    id: string;
    imageUrl: string;
    title: string;
    description: string;
    content: string;
}
  
// 联系信息接口
export interface ContactInfo {
    phone: string;
    wechat: string;
}
  
// Banner接口
export interface Banner {
    id: string;
    imageUrl: string;
    title?: string;
    subtitle?: string;
}
  
// 首页数据接口
export interface IndexData {
    services: Service[];
    showcases: Showcase[];
    contactInfo: ContactInfo;
    banners: Banner[];
}
  
// API响应包装器
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}