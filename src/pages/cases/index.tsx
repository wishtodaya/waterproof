// pages/cases/index.tsx
import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { View, Text, Image, ScrollView, Video } from '@tarojs/components'
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
  CITY_TYPES,
  PAGE_SIZE
} from 'src/services/api/cases/casesApi'

export default function CasesPage() {
  // 状态管理
  const [loading, setLoading] = useState(true);
  const [cases, setCases] = useState<CaseData[]>([]);
  const [currentCity, setCurrentCity] = useState<string>('all');
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
      try {
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
          } else {
            setCases(prev => [...prev, ...responseData]);
            setPage(prev => prev + 1);
          }
          
          setHasMore(res.hasMore || false);
        } else {
          showToastMessage(res.error || '获取案例列表失败');
        }
      } catch (err) {
        if (!isMounted.current) return;
        showToastMessage(handleCasesError(err));
      } finally {
        if (!isMounted.current) return;
        setLoading(false);
      }
    },
    [currentCity, keyword, page, showToastMessage]
  );

  // 城市或关键词变化时加载案例
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
  }, []);

  // 处理城市变化
  const handleCityChange = useCallback((value: string) => {
    setCurrentCity(value);
  }, []);

  // 处理加载更多
  const handleLoadMore = useCallback(() => {
    if (hasMore && !loading) {
      return loadCases(false);
    }
    return Promise.resolve();
  }, [hasMore, loading, loadCases]);

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

  // 格式化日期字符串
  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  }, []);

  return (
    <View className="cases-page">
      {/* 使用容器包裹PageHeader */}
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
                    <View className="cases-page-card-description">{item.description}</View>
                    <View className="cases-page-card-date">施工时间: {formatDate(item.date)}</View>
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
        style={{ height: '80%' }}
        onClose={() => setShowDetail(false)}
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
                
                {/* 视频区域 */}
                {selectedCase.videos && selectedCase.videos.length > 0 && (
                  <View className="cases-page-detail-videos">
                    {selectedCase.videos.map((video, idx) => (
                      <Video 
                        key={idx}
                        src={video}
                        className="cases-page-detail-video"
                        controls
                        showFullscreenBtn
                        showPlayBtn
                        autoplay={false}
                      />
                    ))}
                  </View>
                )}
                
                <View className="cases-page-detail-info">
                  <View className="cases-page-detail-date">
                    施工时间: {formatDate(selectedCase.date)}
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