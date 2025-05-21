// services/api/index/data.ts
import { IndexData } from './types';

// 首页模拟数据
export const indexData: IndexData = {
  // 服务数据
  services: [
    {
      id: 1,
      title: '卫生间防水',
      description: '专业卫生间防水施工，解决渗漏问题',
      features: ['耐候耐磨', '持久防护', '无缝施工']
    },
    {
      id: 2,
      title: '外墙防水',
      description: '全方位外墙防水，根治渗漏难题',
      features: ['高空作业', '全面防护', '防紫外线']
    },
    {
      id: 3,
      title: '地下室防水',
      description: '专业地下室防水工程，彻底解决渗水问题',
      features: ['防积水', '耐腐蚀', '抗压防渗']
    },
    {
      id: 4,
      title: '屋顶防水',
      description: '专业屋顶防水维修，杜绝屋顶漏水',
      features: ['免拆修复', '抗紫外线', '终身质保']
    },
    {
      id: 5,
      title: '阳台防水',
      description: '阳台防水翻新，彻底解决渗漏问题',
      features: ['美观实用', '快速施工', '长期保固']
    },
    {
      id: 6,
      title: '裂缝补漏',
      description: '墙体裂缝修复，防止渗水扩散',
      features: ['精准注浆', '彻底修复', '隐蔽施工']
    }
  ],
  
  // 精选案例数据 (Showcase)
  showcases: [
    {
      id: '1',
      imageUrl: 'https://storage.360buyimg.com/jdc-article/welcomenutui.jpg',
      title: '城市花园小区屋顶防水工程',
      description: '解决屋顶长期渗水问题，采用最新防水材料，5年质保',
      content: '城市花园小区建于2010年，屋顶长期存在渗水问题，影响居民正常生活。我们使用高分子防水卷材对屋顶进行全面防水处理，并增加了排水系统改造，彻底解决了漏水问题。该工程覆盖面积达2000平方米，工期15天，提供5年质保服务。'
    },
    {
      id: '2',
      imageUrl: 'https://storage.360buyimg.com/jdc-article/NutUItaro2.jpg',
      title: '滨江豪庭别墅防水工程',
      description: '别墅地下室、游泳池、卫生间整体防水，确保万无一失',
      content: '滨江豪庭别墅是高端住宅项目，业主要求对地下室、游泳池及卫生间进行高标准防水处理。我们采用了双层防水技术，内层使用柔性防水涂料，外层使用自粘防水卷材，并在关键部位增加了防水附加层。整个工程历时25天，防水面积达800平方米，通过了72小时蓄水测试，确保万无一失。'
    },
    {
      id: '3',
      imageUrl: 'https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg',
      title: '阳光商城外墙防水翻新',
      description: '大型商业综合体外墙防水，美观与实用并重',
      content: '阳光商城是市中心大型商业综合体，建成已有8年，外墙出现多处渗水和墙面脱落现象。我们对整个外墙进行了清洁、修复和防水处理，采用了新型纳米防水涂料，具有优异的防水性能和耐候性。工程面积达5000平方米，不仅解决了渗水问题，还恢复了建筑外观，使商城焕然一新。'
    }
  ],
  
  // 联系信息
  contactInfo: {
    phone: '400-123-4567',
    wechat: 'waterproof123'
  },
  
  // Banner数据
  banners: [
    {
      id: '1',
      imageUrl: 'https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg',
      title: '专业防水服务',
      subtitle: '10年专注防水 · 品质保障'
    },
    {
      id: '2',
      imageUrl: 'https://storage.360buyimg.com/jdc-article/NutUItaro2.jpg',
      title: '专业防水服务',
      subtitle: '10年专注防水 · 品质保障'
    },
    {
      id: '3',
      imageUrl: 'https://storage.360buyimg.com/jdc-article/welcomenutui.jpg',
      title: '专业防水服务',
      subtitle: '10年专注防水 · 品质保障'
    }
  ]
};