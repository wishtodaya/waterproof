// 服务类型接口
export interface ServiceType {
  text: string;
  value: string;
}

// 联系信息数据接口
export interface ContactData {
  description: string;
  phone: string;
  wechat: string;
  businessHours: string;
  address: string;
}

// 预约表单数据接口
export interface BookingFormData {
  name: string;
  phone: string;
  area: string;
  serviceType: string;
  serviceTypeName: string;
  region: string[];
  address: string;
  remark: string;
}

// API响应包装器
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}