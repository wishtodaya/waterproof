export interface Service {
  text: string;
  value: string;
  description: string;
}

// 案例数据接口 
export interface CaseData {
    id: number;
    title: string;
    city: string;
    description: string;
    date: string;
    images: string[];
    videos?: string[];
    content: string;
    coverImage?: string; 
}

// 精选案例接口
export interface Showcase extends CaseData {
    coverImage: string; // 精选案例必须有封面图
}

// 联系信息接口
export interface ContactInfo {
    phone: string[];     // 电话号码数组
    wechat: string;     // 微信号
    address?: string;   // 公司地址
    description?: string; // 公司简介
}

// Banner接口
export interface Banner {
    id: string;
    imageUrl: string;   // 对应数据库 image_url
    title?: string;     // 对应数据库 title
    subtitle?: string;  // 对应数据库 subtitle
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
