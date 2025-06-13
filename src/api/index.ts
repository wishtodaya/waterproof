import { casesApi } from './cases/casesApi';
import { contactApi } from './contact/contactApi';
import { indexApi } from './index/indexApi';
import { coatingApi } from './product/coatingApi';

// 统一API对象
export const api = {
  cases: casesApi,
  contact: contactApi,
  index: indexApi,
  coating: coatingApi
};

// 导出所有类型
export * from './cases/types';
export * from './contact/types';
export * from './index/types';
export * from './product/types';

// 导出工具函数
export { formatPhoneNumber, validateBookingData } from './contact/contactApi';