// data.ts - 防水涂料产品数据

import { WaterproofCoating } from './types';

// 防水涂料类型常量
export const COATING_TYPES = [
  { title: '全部', value: 'all' },
  { title: '外墙防水涂料', value: '外墙防水涂料' },
  { title: '屋面防水涂料', value: '屋面防水涂料' },
  { title: '地下防水涂料', value: '地下防水涂料' },
  { title: '卫生间防水涂料', value: '卫生间防水涂料' },
  { title: '环保型防水涂料', value: '环保型防水涂料' },
];

// 分页大小常量
export const PAGE_SIZE = 10;

// 模拟数据
export const mockCoatings: WaterproofCoating[] = [
  {
    id: 1,
    title: '高性能外墙防水涂料',
    type: '外墙防水涂料',
    description: '适用于各类外墙的高弹性防水涂料，具有优异的耐候性和抗紫外线能力。',
    specifications: '20kg/桶',
    dryTime: '4小时',
    date: '2023-10-15',
    images: [
      'https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg',
      'https://storage.360buyimg.com/jdc-article/NutUItaro2.jpg'
    ],
    content: '该产品是一款高品质的外墙防水涂料，采用先进的丙烯酸改性技术，具有优异的防水性能和耐候性。适用于各类建筑外墙，可有效阻止雨水渗透，同时保持墙体的透气性。产品具有良好的弹性，可以适应墙体轻微的形变而不开裂。耐紫外线性能强，色彩持久不褪色。使用寿命长达10年以上。'
  },
  {
    id: 2,
    title: '环保型屋面防水涂料',
    type: '屋面防水涂料',
    description: '水性环保配方，适用于各类屋面，具有高弹性和抗紫外线能力。',
    specifications: '25kg/桶',
    dryTime: '6小时',
    date: '2023-11-20',
    images: [
      'https://storage.360buyimg.com/jdc-article/welcomenutui.jpg',
      'https://storage.360buyimg.com/jdc-article/welcomenutui.jpg'
    ],
    content: '本产品是一款环保型水性屋面防水涂料，不含有害溶剂，施工和使用过程对环境和人体无害。采用高分子聚合物乳液，形成高弹性防水膜，能够在-20℃至80℃的温度范围内保持弹性，适应屋面的热胀冷缩。耐候性强，抗紫外线，可直接暴露在阳光下使用。该产品还具有良好的反射隔热性能，可降低屋面温度，减少能源消耗。'
  },
  {
    id: 3,
    title: '地下室专用防水涂料',
    type: '地下防水涂料',
    description: '专为地下空间设计的高强度防水涂料，具有优异的抗渗透性和耐水压性能。',
    specifications: '30kg/桶',
    dryTime: '8小时',
    date: '2023-12-05',
    images: [
      'https://storage.360buyimg.com/jdc-article/NutUItaro2.jpg',
      'https://storage.360buyimg.com/jdc-article/welcomenutui.jpg'
    ],
    content: '这款地下室专用防水涂料采用特殊配方，专为地下空间防水设计。具有超强的抗渗透性和耐水压性能，可承受3米以上水头压力。产品固化后形成的防水层与基材粘结牢固，不易脱落。同时具有一定的抗穿刺能力，可以抵抗一定的机械损伤。产品还具有优异的抗化学腐蚀性能，可以抵抗弱酸弱碱的侵蚀。适用于地下车库、地下室、隧道等潮湿环境的防水工程。'
  },
  {
    id: 4,
    title: '卫生间防水涂料套装',
    type: '卫生间防水涂料',
    description: '专为卫生间设计的防水套装，含底涂和面涂，具有优异的粘结力和防霉性能。',
    specifications: '5kg+10kg/套',
    dryTime: '3小时',
    date: '2024-01-10',
    images: [
      'https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg',
      'https://storage.360buyimg.com/jdc-article/NutUItaro2.jpg'
    ],
    content: '卫生间防水涂料套装包含专用底涂和面涂，底涂能够渗透基材，增强防水层与基材的粘结力；面涂采用纳米级防水材料，形成致密的防水层，防水性能卓越。本产品特别添加了防霉抗菌成分，能够有效抑制霉菌滋生，保持卫生间环境干爽卫生。涂层柔韧性好，能够适应基材的微小变形。适用于卫生间地面、墙面、厨房等湿区防水。施工简便，固化迅速，铺贴瓷砖前的最佳选择。'
  },
  {
    id: 5,
    title: '快干型防水补漏涂料',
    type: '外墙防水涂料',
    description: '快速干燥的防水补漏材料，适用于紧急修补各类渗漏问题。',
    specifications: '15kg/桶',
    dryTime: '2小时',
    date: '2024-02-15',
    images: [
      'https://storage.360buyimg.com/jdc-article/welcomenutui.jpg',
      'https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg'
    ],
    content: '快干型防水补漏涂料是一款应急修补防水材料，特点是固化速度快，一般在2小时内即可干燥，遇水即止漏。本产品可以在微湿的基面上直接施工，无需等待基面完全干燥，极大方便了紧急情况下的使用。涂料具有优异的粘结力，能牢固附着在混凝土、金属、木材、塑料等多种基材上。产品弹性好，能够适应基材的变形和开裂。适用于屋面、外墙、管道接口等各类渗漏部位的紧急修补。'
  },
  {
    id: 6,
    title: '高效透明防水涂料',
    type: '卫生间防水涂料',
    description: '透明无色的防水涂料，不改变原材料外观，适用于大理石、瓷砖等装饰表面。',
    specifications: '10kg/桶',
    dryTime: '4小时',
    date: '2024-03-01',
    images: [
      'https://storage.360buyimg.com/jdc-article/NutUItaro2.jpg',
      'https://storage.360buyimg.com/jdc-article/welcomenutui.jpg'
    ],
    content: '高效透明防水涂料采用纳米级防水材料，涂覆后完全透明，不改变原材料的外观和颜色。特别适用于大理石、花岗岩、瓷砖等高档装饰面的防水处理。产品具有优异的渗透性，能够深入材料内部形成防水层，阻止水分渗透。同时保持材料的透气性，防止水汽积聚导致的霉变。该产品还具有一定的防污能力，使表面更容易清洁。广泛应用于卫生间墙面、厨房台面、大理石背面防水等场景。'
  }
];