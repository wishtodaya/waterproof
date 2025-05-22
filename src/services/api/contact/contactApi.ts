import { ServiceType, ContactData, BookingFormData, ApiResponse } from './types';
import { serviceTypes, contactData } from './data';

export const getServiceTypes = async (): Promise<ApiResponse<ServiceType[]>> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      success: true,
      data: serviceTypes
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
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      success: true,
      data: contactData
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
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      data: {
        bookingId: `ZX${Date.now().toString().slice(-6)}`
      }
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '提交预约失败'
    };
  }
};

export const handleContactError = (err: any): string => {
  console.error(err);
  return err instanceof Error ? err.message : '发生未知错误';
};

export * from './types';
export * from './data';