import { useState, useCallback, useEffect, useRef } from 'react'
import { View } from '@tarojs/components'
import Taro, { useDidShow, useShareAppMessage } from '@tarojs/taro'
import { Empty, InfiniteLoading, Popup, Toast } from '@nutui/nutui-react-taro'
import './index.scss'

// Import components
import PageHeader, { TabItem } from 'src/components/PageHeader'
import CaseCard from 'src/components/CaseCard'
import CaseDetail from 'src/components/CaseDetail'

// API imports
import { CaseData, CityOption } from 'src/services/api/cases/types'
import { getCases, getCaseDetail, getCities } from 'src/services/api/cases/casesApi'

const PAGE_SIZE = 10

// 简化错误处理
const handleCasesError = (err: any): string => {
  return err instanceof Error ? err.message : '发生未知错误，请稍后重试'
}

// 保持原有状态结构
const INITIAL_STATE = {
  loading: true,
  cases: [] as CaseData[],
  cities: [] as CityOption[],
  citiesLoading: true,
  currentCity: 'all',
  keyword: '',
  selectedCase: null as CaseData | null,
  showDetail: false,
  page: 1,
  hasMore: true,
  showToast: false,
  toastMsg: '',
  toastType: 'fail' as 'success' | 'fail' | 'warn'
}

export default function CasesPage() {
  const [loading, setLoading] = useState(INITIAL_STATE.loading)
  const [cases, setCases] = useState<CaseData[]>(INITIAL_STATE.cases)
  const [cities, setCities] = useState<CityOption[]>(INITIAL_STATE.cities)
  const [citiesLoading, setCitiesLoading] = useState(INITIAL_STATE.citiesLoading)
  const [currentCity, setCurrentCity] = useState(INITIAL_STATE.currentCity)
  const [keyword, setKeyword] = useState(INITIAL_STATE.keyword)
  const [selectedCase, setSelectedCase] = useState<CaseData | null>(INITIAL_STATE.selectedCase)
  const [showDetail, setShowDetail] = useState(INITIAL_STATE.showDetail)
  const [page, setPage] = useState(INITIAL_STATE.page)
  const [hasMore, setHasMore] = useState(INITIAL_STATE.hasMore)
  const [showToast, setShowToast] = useState(INITIAL_STATE.showToast)
  const [toastMsg, setToastMsg] = useState(INITIAL_STATE.toastMsg)
  const [toastType, setToastType] = useState<'success' | 'fail' | 'warn'>(INITIAL_STATE.toastType)

  const isMounted = useRef(true)
  const loadingRef = useRef(false)

  useEffect(() => () => { isMounted.current = false }, [])

  // 分享功能
  useShareAppMessage(() => ({
    title: '郑式修缮防水工程案例',
    path: '/pages/cases/index',
    imageUrl: cases.length > 0 ? cases[0].images[0] : undefined,
  }))

  const showToastMessage = useCallback((message: string, type: 'success' | 'fail' | 'warn' = 'fail') => {
    if (!isMounted.current) return
    setToastMsg(message)
    setToastType(type)
    setShowToast(true)
  }, [])

  // 加载城市列表
  const loadCities = useCallback(async () => {
    try {
      setCitiesLoading(true)
      const res = await getCities()
      
      if (!isMounted.current) return
      
      if (res.success && res.data) {
        setCities(res.data)
      } else {
        showToastMessage(res.error || '获取城市列表失败')
        setCities([{ title: '全部', value: 'all' }])
      }
    } catch (err) {
      if (!isMounted.current) return
      showToastMessage(handleCasesError(err))
      setCities([{ title: '全部', value: 'all' }])
    } finally {
      if (!isMounted.current) return
      setCitiesLoading(false)
    }
  }, [showToastMessage])

  // 将城市数据转换为PageHeader需要的TabItem格式
  const tabs: TabItem[] = cities.map(city => ({
    title: city.title,
    value: city.value
  }))

  const loadCases = useCallback(async (isRefresh = false) => {
    if (loadingRef.current) return
    try {
      loadingRef.current = true
      const currentPage = isRefresh ? 1 : page
      if (isRefresh) setLoading(true)

      const res = await getCases({
        city: currentCity === 'all' ? undefined : currentCity,
        keyword: keyword || undefined,
        page: currentPage,
        pageSize: PAGE_SIZE,
      })
      if (!isMounted.current) return

      if (res.success) {
        const data = res.data || []
        if (isRefresh) {
          setCases(data)
          setPage(1)
          setHasMore(res.hasMore || false)
        } else {
          setCases(prev => [...prev, ...data])
          setPage(prev => prev + 1)
          setHasMore(res.hasMore || false)
        }
      } else {
        showToastMessage(res.error || '获取案例列表失败')
      }
    } catch (err) {
      if (!isMounted.current) return
      showToastMessage(handleCasesError(err))
    } finally {
      if (!isMounted.current) return
      setLoading(false)
      loadingRef.current = false
    }
  }, [currentCity, keyword, page, showToastMessage])

  // 初始化时加载城市列表
  useEffect(() => {
    loadCities()
  }, [loadCities])

  // 当城市或关键词变化时重新加载案例
  useEffect(() => { 
    if (!citiesLoading) {
      loadCases(true) 
    }
  }, [currentCity, keyword, citiesLoading])

  useDidShow(() => { 
    if (cases.length === 0 && !loading && !citiesLoading) {
      loadCases(true)
    }
  })

  const handleSearch = useCallback((value: string) => {
    setKeyword(value)
    setPage(1)
  }, [])

  const handleCityChange = useCallback((value: string) => {
    setCurrentCity(value)
    setPage(1)
  }, [])

  const handleLoadMore = useCallback(() => {
    if (hasMore && !loading && !loadingRef.current) {
      return loadCases(false)
    }
    return Promise.resolve()
  }, [hasMore, loading, loadCases])

  const handleCaseClick = useCallback(async (id: number) => {
    try {
      const cached = cases.find(c => c.id === id)
      if (cached) {
        setSelectedCase(cached)
        setShowDetail(true)
        return
      }
      setLoading(true)
      const res = await getCaseDetail(id)
      if (!isMounted.current) return
      if (res.success && res.data) {
        setSelectedCase(res.data)
        setShowDetail(true)
      } else {
        showToastMessage(res.error || '获取案例详情失败')
      }
    } catch (err) {
      if (!isMounted.current) return
      showToastMessage(handleCasesError(err))
    } finally {
      if (!isMounted.current) return
      setLoading(false)
    }
  }, [cases, showToastMessage])

  const handleBook = useCallback(() => {
    setShowDetail(false)
    Taro.switchTab({ url: '/pages/contact/index' })
  }, [])

  const handleCloseDetail = useCallback(() => {
    setShowDetail(false)
    setTimeout(() => { if (isMounted.current) setSelectedCase(null) }, 300)
  }, [])

  const renderSkeletons = useCallback(() => (
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
  ), [])

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
        />
      </View>
      <View className="cases-page-content">
        {(loading && cases.length === 0) || citiesLoading ? renderSkeletons() : (
          cases.length > 0 ? (
            <View className="cases-page-list">
              {cases.map((item, idx) => (
                <View key={item.id} className={`cases-page-item cases-page-item-${Math.min(idx+1, 10)}`}>
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
            </View>
          ) : (
            <View className="cases-page-empty">
              <Empty description="暂无相关案例" image="empty" />
            </View>
          )
        )}
        {cases.length > 0 && !citiesLoading && (
          <InfiniteLoading
            hasMore={hasMore}
            threshold={200}
            loadingText="加载中..."
            loadMoreText="已经到底啦"
            onLoadMore={handleLoadMore}
          />
        )}
      </View>
      <Popup visible={showDetail} position="bottom" round style={{ height: '90%' }} onClose={handleCloseDetail} closeable={false}>
        {selectedCase && (
          <CaseDetail
            caseData={selectedCase}
            visible={showDetail}
            onClose={handleCloseDetail}
            onContactClick={handleBook}
          />
        )}
      </Popup>
      <Toast
        msg={toastMsg}
        visible={showToast}
        type={toastType}
        onClose={() => setShowToast(false)}
        duration={2000}
        position="center"
        closeOnOverlayClick
      />
    </View>
  )
}