// pages/cases/index.tsx
import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { View, Text, Image,ScrollView} from '@tarojs/components'
import Taro, { useDidShow, useShareAppMessage } from '@tarojs/taro'
import { 
  Button,
  Empty, 
  InfiniteLoading,
  Popup,
  Toast,
  Loading
} from '@nutui/nutui-react-taro'
import './index.scss'

// Import PageHeader component
import PageHeader from 'src/components/PageHeader';

// Import API and types
import { 
  CaseData, 
  CaseQueryParams 
} from 'src/services/api/cases/types'
import {
  getCases,
  getCaseDetail,
  handleCasesError,
  CASES_TYPES,
  PAGE_SIZE
} from 'src/services/api/cases/casesApi'

export default function CasesPage() {
  // 状态管理
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [cases, setCases] = useState<CaseData[]>([]);
  const [currentType, setCurrentType] = useState<string>('all');
  const [keyword, setKeyword] = useState('');
  const [selectedCase, setSelectedCase] = useState<CaseData | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'fail' | 'warn'>('fail');

  // Component mount state tracking
  const isMounted = useRef(true);
  
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // 分享功能
  useShareAppMessage(() => ({
    title: '防水工程案例展示',
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

  // 加载案例数据 - with TypeScript fix
  const loadCases = useCallback(
    async (isRefresh = false) => {
      try {
        const currentPage = isRefresh ? 1 : page;
        
        if (isRefresh) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }

        const res = await getCases({
          type: currentType,
          keyword,
          page: currentPage,
          pageSize: PAGE_SIZE,
        });

        if (!isMounted.current) return;

        if (res.success) {
          // Use default empty array to avoid TypeScript error
          const responseData = res.data || [];
          
          // Update cases based on refresh flag
          if (isRefresh) {
            setCases(responseData);
          } else {
            setCases(prev => [...prev, ...responseData]);
          }
          
          setHasMore(res.hasMore || false);
          
          if (isRefresh) {
            setPage(1);
          } else {
            setPage(prev => prev + 1);
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
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    [currentType, keyword, page, showToastMessage]
  );

  // 类型或关键词变化时加载案例
  useEffect(() => {
    loadCases(true);
  }, [currentType, keyword, loadCases]);

  // 页面显示时重新加载案例
  useDidShow(() => {
    if (cases.length === 0 && !loading) {
      loadCases(true);
    }
  });

  // 处理搜索输入变化
  const handleSearch = useCallback((value: string) => {
    setKeyword(value);
  }, []);

  // 处理类型变化
  const handleTypeChange = useCallback((value: string) => {
    setCurrentType(value);
  }, []);

  // 处理下拉刷新
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadCases(true);
    Taro.stopPullDownRefresh();
  }, [loadCases]);
  
  // 注册下拉刷新
  useEffect(() => {
    Taro.eventCenter.on('pullDownRefresh', handleRefresh);
    
    return () => {
      Taro.eventCenter.off('pullDownRefresh');
    };
  }, [handleRefresh]);

  // 处理加载更多
  const handleLoadMore = useCallback(() => {
    if (hasMore && !loading && !loadingMore) {
      return loadCases(false);
    }
    return Promise.resolve();
  }, [hasMore, loading, loadingMore, loadCases]);

  // 处理案例点击
  const handleCaseClick = useCallback(async (id: number) => {
    try {
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
  }, [showToastMessage]);

  // 处理预约服务
  const handleBook = useCallback(async (data: CaseData) => {
    try {
      await Taro.setStorage({
        key: 'selected_case',
        data,
      });
      showToastMessage('已添加到咨询列表', 'success');
      setTimeout(() => {
        if (isMounted.current) {
          Taro.switchTab({
            url: '/pages/contact/index',
          });
        }
      }, 1500);
    } catch (err) {
      if (!isMounted.current) return;
      showToastMessage(handleCasesError(err));
    }
  }, [showToastMessage]);

  // 关闭详情弹窗
  const handleCloseDetail = useCallback(() => {
    setShowDetail(false);
  }, []);

  // 骨架屏UI - 使用useMemo优化性能
  const renderSkeletons = useMemo(() => {
    return (
      <View className="cases-page-skeletons">
        {[1, 2, 3].map((i) => (
          <View key={i} className="cases-page-skeleton">
            <View className="cases-page-skeleton-image"></View>
            <View className="cases-page-skeleton-content">
              <View className="cases-page-skeleton-title"></View>
              <View className="cases-page-skeleton-tag"></View>
              <View className="cases-page-skeleton-desc"></View>
              <View className="cases-page-skeleton-meta">
                <View className="cases-page-skeleton-meta-item"></View>
                <View className="cases-page-skeleton-meta-item"></View>
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  }, []);

  // 格式化日期字符串
  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  }, []);

  return (
    <View className="cases-page">
      {/* 使用容器包裹PageHeader，处理定位 */}
      <View className="cases-page-header">
        <PageHeader
          keyword={keyword}
          onSearch={handleSearch}
          searchPlaceholder="搜索工程案例"
          currentType={currentType}
          onTypeChange={handleTypeChange}
          tabs={CASES_TYPES}
        />
      </View>

      {/* 内容 */}
      <View className="cases-page-content">
        {/* 加载骨架屏 */}
        {loading && cases.length === 0 ? (
          renderSkeletons
        ) : cases.length > 0 ? (
          <View className="cases-page-list">
            {cases.map((item, index) => (
              <View key={item.id} className={`cases-page-item cases-page-item-${index + 1}`}>
                <View className="cases-page-card" onClick={() => handleCaseClick(item.id)}>
                  <View className="cases-page-card-images">
                    <Image 
                      src={item.images[0]} 
                      className="cases-page-card-image"
                      mode="aspectFill"
                      lazyLoad
                    />
                  </View>
                  <View className="cases-page-card-content">
                    <View className="cases-page-card-title">{item.title}</View>
                    <View className="cases-page-card-type">{item.type}</View>
                    <View className="cases-page-card-description">{item.description}</View>
                    <View className="cases-page-card-meta">
                      <Text className="cases-page-card-meta-item">面积: {item.area}</Text>
                      <Text className="cases-page-card-meta-item">工期: {item.duration}</Text>
                    </View>
                  </View>
                </View>
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
          loadingMore ? (
            <View className="loading-more">
              <Loading/>
              <View className="loading-text">加载中...</View>
            </View>
          ) : (
            <InfiniteLoading
              hasMore={hasMore}
              threshold={200}
              loadingText="加载中..."
              loadMoreText="已经到底啦"
              onLoadMore={handleLoadMore}
            />
          )
        )}
      </View>

      {/* 案例详情弹窗 */}
      <Popup
  visible={showDetail}
  position="bottom"
  round
  style={{ height: '80%' }}
  onClose={handleCloseDetail}
>
  {selectedCase && (
    <View className="cases-page-detail">
      {/* 固定高度的头部 */}
      <View className="cases-page-detail-header">
        <View className="cases-page-detail-title">{selectedCase.title}</View>
      </View>
      
      {/* 滚动内容区域 */}
      <ScrollView 
        scrollY
        className="cases-page-detail-scroll"
        enhanced={false}
        showScrollbar={false}
      >
        <View className="cases-page-detail-content">
          <View className="cases-page-detail-images">
            {selectedCase.images.map((img, idx) => (
              <Image 
                key={idx} 
                src={img} 
                className="cases-page-detail-image"
                mode="aspectFill"
                lazyLoad
                onClick={() => {
                  Taro.previewImage({
                    current: img,
                    urls: selectedCase.images
                  });
                }}
              />
            ))}
          </View>
          <View className="cases-page-detail-info">
            <View className="cases-page-detail-type">{selectedCase.type}</View>
            <View className="cases-page-detail-meta">
              <Text className="cases-page-detail-meta-item">面积: {selectedCase.area}</Text>
              <Text className="cases-page-detail-meta-item">工期: {selectedCase.duration}</Text>
              <Text className="cases-page-detail-meta-item">完成日期: {formatDate(selectedCase.date)}</Text>
            </View>
            <View className="cases-page-detail-description">项目概述</View>
            <View className="cases-page-detail-text">{selectedCase.content}</View>
            <Button 
              type="primary" 
              block
              shape="round"
              className="cases-page-detail-button"
              onClick={() => handleBook(selectedCase)}
            >
              咨询类似方案
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
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