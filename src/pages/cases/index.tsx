import { useState, useCallback } from 'react'
import { View } from '@tarojs/components'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { Empty, InfiniteLoading, Popup } from '@nutui/nutui-react-taro'
import { useRequest, usePagination } from 'src/utils/http/hooks'
import { api } from 'src/api'
import './index.scss'

// Import components
import PageHeader, { TabItem } from 'src/components/PageHeader'
import CaseCard from 'src/components/CaseCard'
import CaseDetail from 'src/components/CaseDetail'
import { CaseData } from 'src/api/cases/types'

export default function CasesPage() {
  const [currentCity, setCurrentCity] = useState('all')
  const [keyword, setKeyword] = useState('')
  const [selectedCase, setSelectedCase] = useState<CaseData | null>(null)
  const [showDetail, setShowDetail] = useState(false)

  // 分享功能
  useShareAppMessage(() => ({
    title: '郑式修缮防水工程案例',
    path: '/pages/cases/index',
  }))

  // 获取城市列表
  const { data: cities = [], loading: citiesLoading } = useRequest(
    api.cases.getCities,
    {
      onError: () => {
        // 错误时返回默认城市
        return [{ title: '全部', value: 'all' }]
      }
    }
  )

  // 获取案例列表（分页）
  const {
    list: cases,
    loading,
    refreshing,
    hasMore,
    loadMore,
    refresh
  } = usePagination(
    (params) => api.cases.getCases({
      ...params,
      city: currentCity === 'all' ? undefined : currentCity,
      keyword: keyword || undefined,
    }),
    { defaultPageSize: 10 }
  )

  // 城市切换
  const handleCityChange = useCallback((value: string) => {
    setCurrentCity(value)
    refresh() // 刷新列表
  }, [refresh])

  // 搜索
  const handleSearch = useCallback((value: string) => {
    setKeyword(value)
    refresh() // 刷新列表
  }, [refresh])

  // 查看案例详情
  const handleCaseClick = useCallback(async (id: number) => {
    try {
      const cached = cases.find(c => c.id === id)
      if (cached) {
        setSelectedCase(cached)
        setShowDetail(true)
        return
      }
      const caseDetail = await api.cases.getCaseDetail(id)
      setSelectedCase(caseDetail)
      setShowDetail(true)
    } catch (error) {
      // HTTP层已经处理了错误提示
    }
  }, [cases])

  // 预约
  const handleBook = useCallback(() => {
    setShowDetail(false)
    Taro.switchTab({ url: '/pages/contact/index' })
  }, [])

  // 关闭详情
  const handleCloseDetail = useCallback(() => {
    setShowDetail(false)
    setTimeout(() => setSelectedCase(null), 300)
  }, [])

  // 转换城市数据为tabs，修复null问题
  const tabs: TabItem[] = (cities || []).map(city => ({
    title: city.title,
    value: city.value
  }))

  return (
    <View className="cases-page">
      <View className="cases-page-header">
        <PageHeader
          keyword={keyword}
          onSearch={handleSearch}
          searchPlaceholder="搜索城市案例"
          currentType={currentCity}
          onTypeChange={handleCityChange}
          tabs={tabs}
          // loading={citiesLoading} // FIX: Removed prop. 'loading' is not defined in PageHeaderProps. If needed, add this prop to the PageHeader component itself.
        />
      </View>

      <View className="cases-page-content">
        {loading && cases.length === 0 ? (
          <View className="cases-page-skeletons">
            {[1,2,3].map(i => (
              <View key={i} className="cases-page-skeleton">
                <View className="cases-page-skeleton-image" />
                <View className="cases-page-skeleton-content">
                  <View className="cases-page-skeleton-title" />
                  <View className="cases-page-skeleton-desc" />
                  <View className="cases-page-skeleton-date" />
                </View>
              </View>
            ))}
          </View>
        ) : cases.length > 0 ? (
          <View className="cases-page-list">
            {cases.map((item) => (
              <View key={item.id} className="cases-page-item">
                <CaseCard
                  id={item.id}
                  title={item.title}
                  description={item.description}
                  date={item.date}
                  image={item.images[0]}
                  onClick={() => handleCaseClick(item.id)}
                />
              </View>
            ))}
            <InfiniteLoading
              hasMore={hasMore}
              threshold={200}
              loadingText="加载中..."
              loadMoreText="已经到底啦"
              onLoadMore={loadMore}
            />
          </View>
        ) : (
          <View className="cases-page-empty">
            <Empty description="暂无相关案例" image="empty" />
          </View>
        )}
      </View>

      <Popup
        visible={showDetail}
        position="bottom"
        round
        style={{ height: '90%' }}
        onClose={handleCloseDetail}
      >
        {selectedCase && (
          <CaseDetail
            caseData={selectedCase}
            visible={showDetail}
            onClose={handleCloseDetail}
            onContactClick={handleBook}
          />
        )}
      </Popup>
    </View>
  )
}