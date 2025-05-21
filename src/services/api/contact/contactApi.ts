// services/api/contact/contactApi.ts
import http from '../../http';
import { ServiceType, ContactData, BookingFormData, ApiResponse } from './types';
import { serviceTypes, contactData } from './data';

// API端点
const ENDPOINTS = {
  GET_SERVICE_TYPES: '/contact/service-types',
  GET_CONTACT_INFO: '/contact/info',
  SUBMIT_BOOKING: '/contact/booking'
};

/**
 * 获取服务类型列表
 */
export const getServiceTypes = async (): Promise<ApiResponse<ServiceType[]>> => {
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
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

/**
 * 获取联系信息
 */
export const getContactData = async (): Promise<ApiResponse<ContactData>> => {
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
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

/**
 * 提交预约信息
 */
export const submitBooking = async (data: BookingFormData): Promise<ApiResponse<{ bookingId: string }>> => {
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // 模拟成功响应
    return {
      success: true,
      data: {
        bookingId: `BK${Date.now().toString().slice(-6)}`
      }
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '提交预约失败'
    };
  }
};

/**
 * 错误处理工具 - 重命名为handleContactError
 */
export const handleContactError = (err: any): string => {
  console.error(err);
  return err instanceof Error ? err.message : '发生未知错误';
};

// 导出类型和数据
export * from './types';
export * from './data';