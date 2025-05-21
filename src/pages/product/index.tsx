import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View } from '@tarojs/components';
import Taro, { useDidShow, useShareAppMessage } from '@tarojs/taro';
import { 
  Empty, 
  Toast,
  Popup,
  InfiniteLoading,
  Loading
} from '@nutui/nutui-react-taro';
import PageHeader from 'src/components/PageHeader';
import ProductCard from 'src/components/ProductCard';
import ProductDetail from 'src/components/ProductDetail';
import { getCoatingList, getCoatingDetail, COATING_TYPES, WaterproofCoating } from 'src/services/api/product/coatingApi';
import './index.scss';

export default function ProductPage() {
  // States
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [products, setProducts] = useState<WaterproofCoating[]>([]);
  const [currentType, setCurrentType] = useState('all');
  const [keyword, setKeyword] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'fail' | 'warn'>('fail');
  const [selectedProduct, setSelectedProduct] = useState<WaterproofCoating | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Component mount state reference
  const isMounted = React.useRef(true);
  
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // Share message configuration
  useShareAppMessage(() => {
    return {
      title: '专业防水产品',
      path: '/pages/product/index',
      imageUrl: products.length > 0 ? products[0].images[0] : undefined
    }
  });

  // Toast message helper
  const showToastMessage = useCallback((message: string, type: 'success' | 'fail' | 'warn' = 'fail') => {
    if (!isMounted.current) return;
    setToastMsg(message);
    setToastType(type);
    setShowToast(true);
  }, []);

  // Fetch products with TypeScript-safe implementation
  const fetchProducts = useCallback(async (isRefresh = false) => {
    try {
      const page = isRefresh ? 1 : currentPage;
      
      if (isRefresh) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      const response = await getCoatingList({
        type: currentType,
        keyword,
        page,
        pageSize: 10
      });

      if (!isMounted.current) return;
      
      // Handle success response
      if (response.success) {
        // Handle case where response.data might be undefined
        const productData = response.data || [];
        
        // Update state based on refresh flag
        if (isRefresh) {
          setProducts(productData);
        } else {
          // Use functional update to ensure we have latest state
          setProducts(prevProducts => [...prevProducts, ...productData]);
        }
        
        // Update pagination state
        setHasMore(response.hasMore || false);
        if (!isRefresh) {
          setCurrentPage(prev => prev + 1);
        } else {
          setCurrentPage(1);
        }
      } else {
        // Handle error in response
        showToastMessage(response.error || '获取产品数据失败');
      }
    } catch (error) {
      // Handle exception
      if (!isMounted.current) return;
      console.error('获取产品数据错误', error);
      showToastMessage('获取产品数据失败，请稍后重试');
    } finally {
      // Reset loading states
      if (!isMounted.current) return;
      setLoading(false);
      setLoadingMore(false);
    }
  }, [currentType, keyword, currentPage, showToastMessage]);

  // Effect for filter changes
  useEffect(() => {
    fetchProducts(true);
  }, [currentType, keyword, fetchProducts]);

  // Check for data on page show
  useDidShow(() => {
    if (products.length === 0 && !loading) {
      fetchProducts(true);
    }
  });

  // Pull-to-refresh handler
  useEffect(() => {
    const handlePullDownRefresh = async () => {
      await fetchProducts(true);
      Taro.stopPullDownRefresh();
    };
    
    Taro.eventCenter.on('pullDownRefresh', handlePullDownRefresh);
    return () => {
      Taro.eventCenter.off('pullDownRefresh');
    };
  }, [fetchProducts]);

  // Search handler
  const handleSearch = useCallback((value: string) => {
    setKeyword(value);
  }, []);

  // Type change handler
  const handleTypeChange = useCallback((value: string) => {
    setCurrentType(value);
  }, []);

  // Product click handler
  const handleProductClick = useCallback(async (id: number) => {
    try {
      setLoading(true);
      const response = await getCoatingDetail(id);
      
      if (!isMounted.current) return;
      
      if (response.success && response.data) {
        setSelectedProduct(response.data);
        setShowDetail(true);
      } else {
        showToastMessage(response.error || '获取产品详情失败');
      }
    } catch (error) {
      if (!isMounted.current) return;
      console.error('获取产品详情错误', error);
      showToastMessage('获取产品详情失败，请稍后重试');
    } finally {
      if (!isMounted.current) return;
      setLoading(false);
    }
  }, [showToastMessage]);

  // Close detail modal
  const handleCloseDetail = useCallback(() => {
    setShowDetail(false);
  }, []);

  // Contact button handler
  const handleContactClick = useCallback(() => {
    handleCloseDetail();
    Taro.switchTab({ url: '/pages/contact/index' });
  }, [handleCloseDetail]);

  // Load more handler
  const handleLoadMore = useCallback(() => {
    if (hasMore && !loading && !loadingMore) {
      return fetchProducts(false);
    }
    return Promise.resolve();
  }, [hasMore, loading, loadingMore, fetchProducts]);

  // Skeleton UI - memoized for performance
  const renderSkeletons = useMemo(() => {
    return (
      <View className="product-page-skeletons">
        {[1, 2, 3, 4].map(i => (
          <View key={i} className="product-skeleton">
            <View className="product-skeleton-image"></View>
            <View className="product-skeleton-content">
              <View className="product-skeleton-title"></View>
              <View className="product-skeleton-tag"></View>
              <View className="product-skeleton-desc"></View>
              <View className="product-skeleton-specs"></View>
            </View>
          </View>
        ))}
      </View>
    );
  }, []);

  return (
    <View className="product-page">
      {/* Page header */}
      <View className="product-page-header">
        <PageHeader
          keyword={keyword}
          onSearch={handleSearch}
          searchPlaceholder="搜索防水涂料产品"
          currentType={currentType}
          onTypeChange={handleTypeChange}
          tabs={COATING_TYPES}
        />
      </View>

      {/* Product list content */}
      <View className="product-page-content">
        {loading && products.length === 0 ? (
          renderSkeletons
        ) : products.length > 0 ? (
          <>
            <View className="product-list">
              {products.map((product) => (
                <View key={product.id} className="product-item">
                  <ProductCard
                    image={product.images[0]}
                    title={product.title}
                    specifications={product.specifications}
                    type={product.type}
                    description={product.description}
                    onClick={() => handleProductClick(product.id)}
                  />
                </View>
              ))}
            </View>
            
            {/* Infinite loading */}
            {loadingMore ? (
              <View className="loading-more">
                <Loading />
                <View className="loading-text">加载中...</View>
              </View>
            ) : (
              <InfiniteLoading
                hasMore={hasMore}
                threshold={100}
                loadingText="加载中..."
                loadMoreText="已经到底啦"
                onLoadMore={handleLoadMore}
              />
            )}
          </>
        ) : (
          <View className="product-page-empty">
            <Empty description="暂无相关产品" image="empty" />
          </View>
        )}
      </View>

      {/* Product detail popup */}
      <Popup
        visible={showDetail}
        position="bottom"
        round
        style={{ height: '85%' }}
        onClose={handleCloseDetail}
        closeable
      >
        <ProductDetail 
          product={selectedProduct}
          visible={showDetail}
          onClose={handleCloseDetail}
        />
      </Popup>

      {/* Toast notifications */}
      <Toast
        msg={toastMsg}
        visible={showToast}
        type={toastType}
        onClose={() => setShowToast(false)}
        duration={2000}
        position="center"
      />
    </View>
  );
}