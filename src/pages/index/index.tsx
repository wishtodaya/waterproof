import { useCallback } from 'react'
import { View, Text } from '@tarojs/components'
import { Loading } from '@nutui/nutui-react-taro'
import Taro from '@tarojs/taro'
import { useRequest } from 'src/utils/http/hooks'
import { api } from 'src/api'
import './index.scss'

// 导入组件
import BannerCarousel from 'src/components/BannerCarousel'
import QuickContact from 'src/components/QuickContact'
import ServiceSection from 'src/components/ServiceSection'
import ShowcaseSection from 'src/components/ShowcaseSection'

export default function IndexPage() {
  // 获取首页数据
  const {
    data: indexData,
    loading,
    refresh
  } = useRequest(api.index.getIndexData)

  // 下拉刷新
  const handlePullDownRefresh = useCallback(async () => {
    await refresh()
    Taro.stopPullDownRefresh()
    Taro.showToast({
      title: '刷新成功',
      icon: 'success',
      duration: 1500
    })
  }, [refresh])

  // Toast提示（FIX: 适配组件的类型要求）
  const showToast = useCallback((message: string, type: 'success' | 'fail' | 'warn' = 'success') => {
    Taro.showToast({
      title: message,
      icon: type === 'success' ? 'success' : type === 'fail' ? 'error' : 'none',
      duration: 2000
    })
  }, [])

  // 监听下拉刷新
  Taro.usePullDownRefresh(handlePullDownRefresh)

  if (loading || !indexData) {
    return (
      <View className='loading-container'>
        <Loading type='spinner' />
        <Text className='loading-text'>加载中...</Text>
      </View>
    )
  }

  return (
    <View className='page'>
      {/* Banner区域 */}
      <BannerCarousel banners={indexData.banners} />

      {/* 快速联系 */}
      <QuickContact
        contactInfo={indexData.contactInfo}
        onShowToast={showToast}
      />

      {/* 服务项目 */}
      <ServiceSection
        services={indexData.services}
        title="我们的服务"
      />

      {/* 精选案例 */}
      <ShowcaseSection
        showcases={indexData.showcases}
        onShowToast={showToast}
      />
    </View>
  )
}