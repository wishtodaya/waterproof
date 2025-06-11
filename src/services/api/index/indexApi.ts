import http from '../../http';
import { IndexData, ApiResponse, Banner, Showcase, Service, ContactInfo } from './types';

// API端点
const ENDPOINTS = {
  GET_BANNERS: '/api/banners/list',
  GET_SHOWCASES: '/api/cases/showcases',
  GET_CONTACT_INFO: '/api/contact/info',
  GET_SERVICES: '/api/contact/services',
};

/**
 * 获取首页所有数据
 */
export const getIndexData = async (): Promise<ApiResponse<IndexData>> => {
  try {
    // 并行请求所有数据
    const [bannersRes, showcasesRes, contactRes, servicesRes] = await Promise.all([
      http.get<Banner[]>(ENDPOINTS.GET_BANNERS),
      http.get<Showcase[]>(ENDPOINTS.GET_SHOWCASES),
      http.get<ContactInfo>(ENDPOINTS.GET_CONTACT_INFO),
      http.get<Service[]>(ENDPOINTS.GET_SERVICES)
    ]);

    // 组装首页数据
    const indexData: IndexData = {
      banners: bannersRes || [],
      showcases: showcasesRes || [],
      contactInfo: contactRes || { phone: [], wechat: '' },
      services: servicesRes || []
    };

    return {
      success: true,
      data: indexData
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '获取首页数据失败'
    };
  }
};