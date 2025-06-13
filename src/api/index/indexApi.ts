import http from 'src/utils/http';
import { IndexData, Banner, Showcase, Service, ContactInfo } from './types';

const ENDPOINTS = {
  GET_BANNERS: '/api/banners/list',
  GET_SHOWCASES: '/api/cases/showcases',
  GET_CONTACT_INFO: '/api/contact/info',
  GET_SERVICES: '/api/contact/services',
};

export const indexApi = {
  /**
   * 获取首页所有数据
   */
  async getIndexData() {
    // 并行请求所有数据
    const [banners, showcases, contactInfo, services] = await Promise.all([
      http.get<Banner[]>(ENDPOINTS.GET_BANNERS),
      http.get<Showcase[]>(ENDPOINTS.GET_SHOWCASES),
      http.get<ContactInfo>(ENDPOINTS.GET_CONTACT_INFO),
      http.get<Service[]>(ENDPOINTS.GET_SERVICES)
    ]);

    return {
      banners: banners || [],
      showcases: showcases || [],
      contactInfo: contactInfo || { phone: [], wechat: '' },
      services: services || []
    } as IndexData;
  }
};
