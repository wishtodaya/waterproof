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
    navigationBarBackgroundColor: '#FFFFFF',
    navigationBarTitleText: '郑式修缮', // 修改导航标题
    navigationBarTextStyle: 'black'
  },
  // 非TabBar页面可以放在分包中
  subPackages: [],
  tabBar: {
    color: '#757575',
    selectedColor: '#2563EB',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
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