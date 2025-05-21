// pages/index/index.tsx
import { useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import { Toast, Loading } from '@nutui/nutui-react-taro'
import Taro from '@tarojs/taro'
import './index.scss'

// 导入组件
import BannerCarousel from 'src/components/BannerCarousel'
import QuickContact from 'src/components/QuickContact'
import ServiceSection from 'src/components/ServiceSection'
import ShowcaseSection from 'src/components/ShowcaseSection'

// 直接导入API和类型
import { IndexData } from 'src/services/api/index/types'
import { getIndexData, handleIndexError } from 'src/services/api/index/indexApi'

export default function IndexPage() {
  // 状态管理
  const [loading, setLoading] = useState(true)
  const [indexData, setIndexData] = useState<IndexData | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const [toastType, setToastType] = useState<'success' | 'fail' | 'warn'>('success')
  
  // 显示提示消息
  const showToastMessage = (message: string, type: 'success' | 'fail' | 'warn' = 'success') => {
    if (showToast) {
      setShowToast(false)
      setTimeout(() => {
        setToastMsg(message)
        setToastType(type)
        setShowToast(true)
      }, 100)
    } else {
      setToastMsg(message)
      setToastType(type)
      setShowToast(true)
    }
  }
  
  // 获取数据
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      
      try {
        // 获取所有首页数据
        const result = await getIndexData()
        
        if (result.success && result.data) {
          setIndexData(result.data)
        } else {
          showToastMessage(result.error || '获取首页数据失败', 'fail')
        }
      } catch (error) {
        console.error('加载数据失败:', error)
        showToastMessage(handleIndexError(error), 'fail')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  // 下拉刷新处理
  useEffect(() => {
    Taro.eventCenter.on('pullDownRefresh', async () => {
      try {
        // 刷新首页数据
        const result = await getIndexData()
        
        if (result.success && result.data) {
          setIndexData(result.data)
          showToastMessage('刷新成功', 'success')
        } else {
          showToastMessage(result.error || '刷新数据失败', 'fail')
        }
      } catch (error) {
        showToastMessage(handleIndexError(error), 'fail')
      } finally {
        Taro.stopPullDownRefresh()
      }
    })
    
    return () => {
      Taro.eventCenter.off('pullDownRefresh')
    }
  }, [])
  
  // 加载状态
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
        onShowToast={showToastMessage}
      />
      
      {/* 服务分类 */}
      <ServiceSection services={indexData.services} />
      
      {/* 精选案例 */}
      <ShowcaseSection 
        showcases={indexData.showcases}
        contactPhone={indexData.contactInfo.phone}
        onShowToast={showToastMessage}
      />
      
      {/* Toast组件 */}
      <Toast
        msg={toastMsg}
        visible={showToast}
        type={toastType}
        onClose={() => setShowToast(false)}
        duration={2000}
        position='center'
        closeOnOverlayClick
      />
    </View>
  )
}