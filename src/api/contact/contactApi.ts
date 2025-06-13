import http from 'src/utils/http';
import { ServiceType, ContactData, BookingFormData } from './types';

const ENDPOINTS = {
  GET_SERVICES: '/api/contact/services',
  GET_CONTACT_INFO: '/api/contact/info',
  SUBMIT_BOOKING: '/api/contact/booking',
} as const;

export const contactApi = {
  /**
   * 获取服务类型列表
   */
  async getServiceTypes() {
    return http.get<ServiceType[]>(ENDPOINTS.GET_SERVICES);
  },

  /**
   * 获取联系信息
   */
  async getContactInfo() {
    return http.get<ContactData>(ENDPOINTS.GET_CONTACT_INFO);
  },

  /**
   * 提交预约
   */
  async submitBooking(data: BookingFormData) {
    // 前端数据验证
    const validation = validateBookingData(data);
    if (!validation.isValid) {
      throw new Error(Object.values(validation.errors)[0]);
    }

    // 清理数据
    const submitData = {
      name: data.name.trim(),
      phone: data.phone.trim(),
      serviceType: data.serviceType,
      serviceTypeName: data.serviceTypeName,
      region: data.region,
      regionCode: data.regionCode,
      address: data.address?.trim() || '',
      remark: data.remark?.trim() || ''
    };
    
    return http.post<{ bookingId: string }>(ENDPOINTS.SUBMIT_BOOKING, submitData);
  }
};

// 工具函数
export const formatPhoneNumber = (phone: string): string => {
  if (phone.length === 11) {
    return `${phone.slice(0, 3)}-${phone.slice(3, 7)}-${phone.slice(7)}`;
  }
  return phone;
};

export const validateBookingData = (data: Partial<BookingFormData>): { 
  isValid: boolean; 
  errors: Record<string, string> 
} => {
  const errors: Record<string, string> = {};
  
  if (!data.name?.trim()) {
    errors.name = '请输入姓名';
  }
  
  if (!data.phone?.trim()) {
    errors.phone = '请输入联系电话';
  } else if (!/^1[3-9]\d{9}$/.test(data.phone)) {
    errors.phone = '请输入有效的手机号码';
  }
  
  if (!data.serviceType) {
    errors.serviceType = '请选择服务类型';
  }
  
  if (!data.region || data.region.length === 0) {
    errors.region = '请选择地区';
  }
  
  if (!data.address?.trim()) {
    errors.address = '请输入详细地址';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
