import { ServiceType, ContactData } from './types';

// 服务类型数据
export const serviceTypes: ServiceType[] = [
  { text: '漏水检测', value: 'detection' },
  { text: '渗漏维修', value: 'repair' },
  { text: '防水施工', value: 'construction' }
];

// 联系信息数据
export const contactData: ContactData = {
  description: '我们是一家专业从事防水工程的公司，拥有十年行业经验和专业技术团队。我们服务于各类住宅和商业建筑，提供高质量的防水解决方案。所有工程均提供质保，确保防水效果持久可靠。',
  phone: '400-123-4567',
  wechat: 'waterproof123',
  businessHours: '周一至周六 9:00-18:00',
  address: '上海市浦东新区张江高科技园区科苑路88号'
};