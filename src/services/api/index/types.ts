// services/api/index/types.ts

// 服务项接口
export interface Service {
    id: number | string;
    title: string;
    description: string;
}

// 基础案例数据接口
export interface CaseData {
    id: number;
    title: string;
    city: string;
    description: string;
    date: string;
    images: string[];
    videos?: string[];
    content: string;
}

// 精选案例接口 - 继承CaseData并添加封面图
export interface Showcase extends CaseData {
    coverImage: string; // 精选案例的封面图
}

// 联系信息接口 - 修改为支持多个电话号码
export interface ContactInfo {
    phone: string[]; // 改为数组支持多个号码
    phoneLabels?: string[]; // 可选的电话标签
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