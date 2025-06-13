export interface ServiceType {
  text: string;
  value: string;
  description: string;
}

export interface ContactData {
  description: string;
  phone: string[];
  wechat: string;
  address: string;
}

export interface BookingFormData {
  name: string;
  phone: string;
  serviceType: string;
  serviceTypeName: string;
  region: string[];
  regionCode: string[];
  address: string;
  remark?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}