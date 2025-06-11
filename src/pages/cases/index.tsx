import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { View } from '@tarojs/components'
import Taro, { useDidShow, useShareAppMessage } from '@tarojs/taro'
import { 
  Empty, 
  InfiniteLoading,
  Popup,
  Toast
} from '@nutui/nutui-react-taro'
import './index.scss'

// Import components
import PageHeader from 'src/components/PageHeader';
import CaseCard from 'src/components/CaseCard';
import CaseDetail from 'src/components/CaseDetail';

// Import API and types
import { 
  CaseData, 
  CaseQueryParams 
} from 'src/services/api/cases/types'
import {
  getCases,
  getCaseDetail,
  handleCasesError,
  CITY_TYPES,
  PAGE_SIZE
} from 'src/services/api/cases/casesApi'

// 初始状态常量
const INITIAL_STATE = {
  loading: true,
  cases: [] as CaseData[],
  currentCity: 'all',
  keyword: '',
  selectedCase: null as CaseData | null,
  showDetail: false,
  page: 1,
  hasMore: true,
  showToast: false,
  toastMsg: '',
  toastType: 'fail' as 'success' | 'fail' | 'warn'
};

export default function CasesPage() {
  // 状态管理
  const [loading, setLoading] = useState(INITIAL_STATE.loading);
  const [cases, setCases] = useState<CaseData[]>(INITIAL_STATE.cases);
  const [currentCity, setCurrentCity] = useState(INITIAL_STATE.currentCity);
  const [keyword, setKeyword] = useState(INITIAL_STATE.keyword);
  const [selectedCase, setSelectedCase] = useState<CaseData | null>(INITIAL_STATE.selectedCase);
  const [showDetail, setShowDetail] = useState(INITIAL_STATE.showDetail);
  const [page, setPage] = useState(INITIAL_STATE.page);
  const [hasMore, setHasMore] = useState(INITIAL_STATE.hasMore);
  const [showToast, setShowToast] = useState(INITIAL_STATE.showToast);
  const [toastMsg, setToastMsg] = useState(INITIAL_STATE.toastMsg);
  const [toastType, setToastType] = useState<'success' | 'fail' | 'warn'>(INITIAL_STATE.toastType);

  // 组件挂载状态追踪
  const isMounted = useRef(true);
  const loadingRef = useRef(false);
  
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // 分享功能
  useShareAppMessage(() => ({
    title: '郑式修缮防水工程案例',
    path: '/pages/cases/index',
    imageUrl: cases.length > 0 ? cases[0].images[0] : undefined,
  }));

  // 显示提示消息
  const showToastMessage = useCallback((message: string, type: 'success' | 'fail' | 'warn' = 'fail') => {
    if (!isMounted.current) return;
    setToastMsg(message);
    setToastType(type);
    setShowToast(true);
  }, []);

  // 加载案例数据
  const loadCases = useCallback(
    async (isRefresh = false) => {
      // 防止重复加载
      if (loadingRef.current) return;
      
      try {
        loadingRef.current = true;
        const currentPage = isRefresh ? 1 : page;
        
        if (isRefresh) {
          setLoading(true);
        }

        const res = await getCases({
          city: currentCity,
          keyword,
          page: currentPage,
          pageSize: PAGE_SIZE,
        });

        if (!isMounted.current) return;

        if (res.success) {
          const responseData = res.data || [];
          
          if (isRefresh) {
            setCases(responseData);
            setPage(1);
            setHasMore(res.hasMore || false);
          } else {
            setCases(prev => [...prev, ...responseData]);
            setPage(prev => prev + 1);
            setHasMore(res.hasMore || false);
          }
        } else {
          showToastMessage(res.error || '获取案例列表失败');
        }
      } catch (err) {
        if (!isMounted.current) return;
        showToastMessage(handleCasesError(err));
      } finally {
        if (!isMounted.current) return;
        setLoading(false);
        loadingRef.current = false;
      }
    },
    [currentCity, keyword, page, showToastMessage]
  );

  // 城市或关键词变化时重新加载
  useEffect(() => {
    loadCases(true);
  }, [currentCity, keyword]);

  // 页面显示时检查数据
  useDidShow(() => {
    if (cases.length === 0 && !loading) {
      loadCases(true);
    }
  });

  // 处理搜索输入变化
  const handleSearch = useCallback((value: string) => {
    setKeyword(value);
    setPage(1);
  }, []);

  // 处理城市变化
  const handleCityChange = useCallback((value: string) => {
    setCurrentCity(value);
    setPage(1);
  }, []);

  // 处理加载更多
  const handleLoadMore = useCallback(() => {
    if (hasMore && !loading && !loadingRef.current) {
      return loadCases(false);
    }
    return Promise.resolve();
  }, [hasMore, loading, loadCases]);

  // 处理案例点击
  const handleCaseClick = useCallback(async (id: number) => {
    try {
      // 先检查缓存
      const cachedCase = cases.find(c => c.id === id);
      if (cachedCase) {
        setSelectedCase(cachedCase);
        setShowDetail(true);
        return;
      }
      
      setLoading(true);
      const res = await getCaseDetail(id);
      
      if (!isMounted.current) return;
      
      if (res.success && res.data) {
        setSelectedCase(res.data);
        setShowDetail(true);
      } else {
        showToastMessage(res.error || '获取案例详情失败');
      }
    } catch (err) {
      if (!isMounted.current) return;
      showToastMessage(handleCasesError(err));
    } finally {
      if (!isMounted.current) return;
      setLoading(false);
    }
  }, [cases, showToastMessage]);

  // 处理预约服务
  const handleBook = useCallback(() => {
    setShowDetail(false);
    // 直接跳转到联系页面
    Taro.switchTab({
      url: '/pages/contact/index',
    });
  }, []);

  // 处理详情关闭
  const handleCloseDetail = useCallback(() => {
    setShowDetail(false);
    // 延迟清理数据，等待动画结束
    setTimeout(() => {
      if (isMounted.current) {
        setSelectedCase(null);
      }
    }, 300);
  }, []);

  // 骨架屏UI
  const renderSkeletons = useMemo(() => {
    return (
      <View className="cases-page-skeletons">
        {[1, 2, 3].map((i) => (
          <View key={i} className="cases-page-skeleton">
            <View className="cases-page-skeleton-image"></View>
            <View className="cases-page-skeleton-content">
              <View className="cases-page-skeleton-title"></View>
              <View className="cases-page-skeleton-desc"></View>
              <View className="cases-page-skeleton-date"></View>
            </View>
          </View>
        ))}
      </View>
    );
  }, []);

  return (
    <View className="cases-page">
      {/* Header容器 */}
      <View className="cases-page-header">
        <PageHeader
          keyword={keyword}
          onSearch={handleSearch}
          searchPlaceholder="搜索城市案例"
          currentType={currentCity}
          onTypeChange={handleCityChange}
          tabs={CITY_TYPES}
        />
      </View>

      {/* 内容区域 */}
      <View className="cases-page-content">
        {/* 加载状态 */}
        {loading && cases.length === 0 ? (
          renderSkeletons
        ) : cases.length > 0 ? (
          <View className="cases-page-list">
            {cases.map((item, index) => (
              <View key={item.id} className={`cases-page-item cases-page-item-${Math.min(index + 1, 10)}`}>
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
        )}

        {/* 无限加载 */}
        {cases.length > 0 && (
          <InfiniteLoading
            hasMore={hasMore}
            threshold={200}
            loadingText="加载中..."
            loadMoreText="已经到底啦"
            onLoadMore={handleLoadMore}
          />
        )}
      </View>

      {/* 案例详情弹窗 */}
      <Popup
        visible={showDetail}
        position="bottom"
        round
        style={{ height: '90%' }}
        onClose={handleCloseDetail}
        closeable={false}
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

      {/* Toast组件 */}
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
  );
}