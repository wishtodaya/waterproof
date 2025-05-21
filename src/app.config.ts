export default defineAppConfig({
  // 将所有TabBar页面放在主包中
  pages: [
    'pages/index/index',
    'pages/product/index',
    'pages/cases/index',
    'pages/contact/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FFFFFF', // 保持白色背景
    navigationBarTitleText: '防水服务',
    navigationBarTextStyle: 'black'
  },
  // 非TabBar页面可以放在分包中
  subPackages: [],
  tabBar: {
    color: '#757575',         // 更改为主题中的次要文本颜色
    selectedColor: '#2563EB', // 保持品牌蓝色不变
    backgroundColor: '#FFFFFF', // 保持白色背景
    borderStyle: 'white',     // 添加白色边框样式，更现代
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: 'assets/tab-bar/home.png',
        selectedIconPath: 'assets/tab-bar/home-active.png'
      },
      {
        pagePath: 'pages/product/index',
        text: '产品',
        iconPath: 'assets/tab-bar/service.png',
        selectedIconPath: 'assets/tab-bar/service-active.png'
      },
      {
        pagePath: 'pages/cases/index',
        text: '案例',
        iconPath: 'assets/tab-bar/case.png',
        selectedIconPath: 'assets/tab-bar/case-active.png'
      },
      {
        pagePath: 'pages/contact/index',
        text: '联系我们',
        iconPath: 'assets/tab-bar/contact.png',
        selectedIconPath: 'assets/tab-bar/contact-active.png'
      }
    ]
  },
  lazyCodeLoading: "requiredComponents"
})