export interface ServiceType {
  text: string;
  value: string;
  description: string; 
}

export interface ContactData {
  description: string;  // 公司简介
  phone: string[];     // 电话号码数组
  wechat: string;      // 微信号
  address: string;     // 公司地址
}

export interface BookingFormData {
  name: string;           // 客户姓名
  phone: string;          // 联系电话
  serviceType: string;    // 服务类型值
  serviceTypeName: string; // 服务类型名称
  region: string[];       // 地区数组
  address: string;        // 详细地址
  remark: string;         // 备注
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}