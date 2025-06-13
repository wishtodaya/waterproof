import http from '../../http';
import { ServiceType, ContactData, BookingFormData, ApiResponse } from './types';

const ENDPOINTS = {
  GET_SERVICES: '/api/contact/services',
  GET_CONTACT_INFO: '/api/contact/info',
  SUBMIT_BOOKING: '/api/contact/booking',
} as const;

export const getServiceTypes = async (): Promise<ApiResponse<ServiceType[]>> => {
  try {
    const response = await http.get<ServiceType[]>(ENDPOINTS.GET_SERVICES);
    
    return {
      success: true,
      data: response || []
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '获取服务类型失败'
    };
  }
};

export const getContactData = async (): Promise<ApiResponse<ContactData>> => {
  try {
    const response = await http.get<ContactData>(ENDPOINTS.GET_CONTACT_INFO);
    
    return {
      success: true,
      data: response
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '获取联系信息失败'
    };
  }
};

export const submitBooking = async (data: BookingFormData): Promise<ApiResponse<{ bookingId: string }>> => {
  try {
    if (!data.name || !data.phone || !data.serviceType) {
      return {
        success: false,
        error: '请填写必填字段'
      };
    }

    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(data.phone)) {
      return {
        success: false,
        error: '请输入有效的手机号码'
      };
    }

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
    
    const response = await http.post<{ bookingId: string }>(ENDPOINTS.SUBMIT_BOOKING, submitData);
    
    return {
      success: true,
      data: response
    };
  } catch (error: any) {
    console.error('Booking submission error:', error);
    
    if (error.response?.status === 400) {
      return {
        success: false,
        error: '提交数据格式错误，请检查输入'
      };
    } else if (error.response?.status === 500) {
      return {
        success: false,
        error: '服务器错误，请稍后重试'
      };
    }
    
    return {
      success: false,
      error: error.message || '提交预约失败'
    };
  }
};

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
  
  if (!data.regionCode || data.regionCode.length === 0) {
    errors.regionCode = '请选择地区编码';
  }
  
  if (!data.address?.trim()) {
    errors.address = '请输入详细地址';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};