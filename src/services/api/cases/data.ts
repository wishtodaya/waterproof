// services/api/cases/data.ts

import { CaseData } from './types';

// 案例类型常量
export const CASES_TYPES = [
  { title: '全部', value: 'all' },
  { title: '地下防水', value: '地下防水' },
  { title: '外墙防水', value: '外墙防水' },
  { title: '屋面防水', value: '屋面防水' },
];

// 分页大小常量
export const PAGE_SIZE = 10;

// 模拟数据
export const mockCases: CaseData[] = [
  {
    id: 1,
    title: '某小区地下车库防水工程',
    type: '地下防水',
    description: '为某小区地下车库进行全面防水处理，解决了长期渗水问题。',
    area: '2000平方米',
    duration: '30天',
    date: '2024-08-15',
    images: [
      'https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg',
      'https://storage.360buyimg.com/jdc-article/NutUItaro2.jpg'
    ],
    content: '该小区地下车库建于2010年，由于防水层老化，导致雨季经常出现渗水现象，影响车辆停放和居民出行。我们采用了双层防水解决方案，使用高弹性防水涂料结合防水卷材，完全解决了渗漏问题。同时，我们也优化了排水系统，提高了排水效率。本项目覆盖面积达2000平方米，工期30天，业主反馈非常满意。'
  },
  {
    id: 2,
    title: '高层建筑外墙防水项目',
    type: '外墙防水',
    description: '为某高层建筑外墙进行防水处理，有效解决了雨天渗水问题。',
    area: '3500平方米',
    duration: '45天',
    date: '2024-07-20',
    images: [
      'https://storage.360buyimg.com/jdc-article/welcomenutui.jpg',
      'https://storage.360buyimg.com/jdc-article/welcomenutui.jpg'
    ],
    content: '该高层建筑外墙在强降雨天气条件下，多处出现渗漏，影响室内使用及建筑寿命。我们对整个外墙进行了全面检测，找出所有渗漏点，采用纳米防水材料进行修复和防护。工程历时45天，面积达3500平方米，目前已度过多次暴雨考验，防水效果良好。'
  },
  {
    id: 3,
    title: '别墅屋顶防水工程',
    type: '屋面防水',
    description: '为某高档别墅区进行屋顶防水施工，确保防水效果长达15年以上。',
    area: '300平方米',
    duration: '15天',
    date: '2024-09-05',
    images: [
      'https://storage.360buyimg.com/jdc-article/NutUItaro2.jpg',
      'https://storage.360buyimg.com/jdc-article/welcomenutui.jpg'
    ],
    content: '别墅区共有5栋独栋别墅，均为坡屋顶设计，原有防水层使用期已超过10年，多处出现老化和破损。我们采用了进口防水材料，对屋顶进行全面翻新，并优化了屋顶排水系统。本工程工期15天，覆盖总面积300平方米，防水质保15年，彻底解决了屋顶漏水的困扰。'
  },
  {
    id: 4,
    title: '商场卫生间防水整体解决方案',
    type: '地下防水',
    description: '为大型商场提供卫生间防水整体解决方案，从根源解决漏水问题。',
    area: '500平方米',
    duration: '20天',
    date: '2024-06-10',
    images: [
      'https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg',
      'https://storage.360buyimg.com/jdc-article/NutUItaro2.jpg'
    ],
    content: '该商场卫生间长期存在渗漏问题，影响了下层商铺的正常经营。我们采用了防水整体解决方案，包括拆除原有地砖和墙砖，铺设高品质防水材料，重新安装管道和洁具，确保防水效果。整个工程历时20天，所有卫生间恢复使用后再无渗漏现象发生。'
  },
  {
    id: 5,
    title: '学校操场看台防水工程',
    type: '外墙防水',
    description: '为学校操场看台进行防水处理，确保学生活动安全。',
    area: '1200平方米',
    duration: '25天',
    date: '2024-05-18',
    images: [
      'https://storage.360buyimg.com/jdc-article/welcomenutui.jpg',
      'https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg'
    ],
    content: '学校操场看台下方空间被用作器材室，原有防水措施老化导致雨水渗漏，影响器材存放。我们对看台表面进行了全面防水处理，采用耐磨防水材料，确保防水效果的同时增加了防滑功能，提高学生活动安全性。工程面积1200平方米，历时25天完成，目前已经过多次雨季考验，效果良好。'
  },
  {
    id: 6,
    title: '医院地下室防水工程',
    type: '地下防水',
    description: '为医院地下室提供专业防水解决方案，保障医疗设备安全运行。',
    area: '1800平方米',
    duration: '35天',
    date: '2024-04-30',
    images: [
      'https://storage.360buyimg.com/jdc-article/NutUItaro2.jpg',
      'https://storage.360buyimg.com/jdc-article/welcomenutui.jpg'
    ],
    content: '医院地下室存放了大量重要医疗设备和药品，对防水要求极高。我们采用了最先进的防水技术和材料，对整个地下室进行了全面防水处理。工程覆盖面积1800平方米，历时35天，采用了三层防护措施，确保即使在极端天气条件下也不会出现渗漏现象。'
  }
];