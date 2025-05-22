import { ServiceType, ContactData } from './types';

export const serviceTypes: ServiceType[] = [
  { text: '漏水检测', value: 'detection' },
  { text: '防水施工', value: 'construction' },
  { text: '渗漏维修', value: 'repair' },
  { text: '材料销售', value: 'materials' }
];

export const contactData: ContactData = {
  description: '我们是一家专业从事防水工程的公司，拥有多年行业经验和专业技术团队。我们服务于各类住宅和商业建筑，提供高质量的防水解决方案。所有工程均提供质保，确保防水效果持久可靠。',
  phone: ['400-123-4567', '13800138000'],
  wechat: 'zhaixin2019',
  address: '河南自贸试验区郑州片区(郑东)金水东路49号绿地原盛国际2号楼2单元10楼272号'
};