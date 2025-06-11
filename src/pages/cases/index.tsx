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

// 修改API导入路径
import { 
  CaseData, 
  CaseQueryParams 
} from 'src/services/api/cases/types'
import {
  getCases,
  getCaseDetail
} from 'src/services/api/cases/casesApi'

// 移动常量到本地，移除无用的导入
const CITY_TYPES = [
  { title: '全部', value: 'all' },
  { title: '深圳', value: '深圳' },
  { title: '广州', value: '广州' },
  { title: '东莞', value: '东莞' },
  { title: '佛山', value: '佛山' },
  { title: '惠州', value: '惠州' }
];

const PAGE_SIZE = 10;

// 简化错误处理
const handleCasesError = (err: any): string => {
  return err instanceof Error ? err.message : '发生未知错误，请稍后重试';
};

// 保持原有状态结构
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
  // 保持原有状态管理结构
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

  // 保持原有的ref管理
  const isMounted = useRef(true);
  const loadingRef = useRef(false);
  
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // 保持原有分享功能
  useShareAppMessage(() => ({
    title: '郑式修缮防水工程案例',
    path: '/pages/cases/index',
    imageUrl: cases.length > 0 ? cases[0].images[0] : undefined,
  }));

  // 保持原有Toast处理
  const showToastMessage = useCallback((message: string, type: 'success' | 'fail' | 'warn' = 'fail') => {
    if (!isMounted.current) return;
    setToastMsg(message);
    setToastType(type);
    setShowToast(true);
  }, []);

  // 修改API调用，其他逻辑保持不变
  const loadCases = useCallback(
    async (isRefresh = false) => {
      if (loadingRef.current) return;
      
      try {
        loadingRef.current = true;
        const currentPage = isRefresh ? 1 : page;
        
        if (isRefresh) {
          setLoading(true);
        }

        const res = await getCases({
          city: currentCity === 'all' ? undefined : currentCity,
          keyword: keyword || undefined,
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

  // 保持原有的useEffect和其他处理函数
  useEffect(() => {
    loadCases(true);
  }, [currentCity, keyword]);

  useDidShow(() => {
    if (cases.length === 0 && !loading) {
      loadCases(true);
    }
  });

  const handleSearch = useCallback((value: string) => {
    setKeyword(value);
    setPage(1);
  }, []);

  const handleCityChange = useCallback((value: string) => {
    setCurrentCity(value);
    setPage(1);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !loading && !loadingRef.current) {
      return loadCases(false);
    }
    return Promise.resolve();
  }, [hasMore, loading, loadCases]);

  // 修改API调用，其他逻辑保持不变
  const handleCaseClick = useCallback(async (id: number) => {
    try {
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

  const handleBook = useCallback(() => {
    setShowDetail(false);
    Taro.switchTab({
      url: '/pages/contact/index',
    });
  }, []);

  const handleCloseDetail = useCallback(() => {
    setShowDetail(false);
    setTimeout(() => {
      if (isMounted.current) {
        setSelectedCase(null);
      }
    }, 300);
  }, []);

  // 保持原有骨架屏渲染
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