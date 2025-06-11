import http from '../../http';
import { ServiceType, ContactData, BookingFormData, ApiResponse } from './types';

const ENDPOINTS = {
  GET_SERVICES: '/api/contact/services',
  GET_CONTACT_INFO: '/api/contact/info',
  SUBMIT_BOOKING: '/api/contact/booking',
};

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
    const response = await http.post(ENDPOINTS.SUBMIT_BOOKING, data);
    
    return {
      success: true,
      data: response
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '提交预约失败'
    };
  }
};