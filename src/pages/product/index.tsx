import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View } from '@tarojs/components';
import Taro, { useDidShow, useShareAppMessage } from '@tarojs/taro';
import { 
  Empty, 
  Toast,
  Popup,
  InfiniteLoading
} from '@nutui/nutui-react-taro';
import ProductCard from 'src/components/ProductCard';
import ProductDetail from 'src/components/ProductDetail';
import { getCoatingList, getCoatingDetail, WaterproofCoating } from 'src/services/api/product/coatingApi';
import './index.scss';

export default function ProductPage() {
  // 状态管理
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [products, setProducts] = useState<WaterproofCoating[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'fail' | 'warn'>('fail');
  const [selectedProduct, setSelectedProduct] = useState<WaterproofCoating | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // 组件挂载状态引用
  const isMounted = React.useRef(true);
  
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // 分享消息配置
  useShareAppMessage(() => {
    return {
      title: '专业防水产品',
      path: '/pages/product/index',
      imageUrl: products.length > 0 ? products[0].images[0] : undefined
    }
  });

  // Toast消息帮助函数
  const showToastMessage = useCallback((message: string, type: 'success' | 'fail' | 'warn' = 'fail') => {
    if (!isMounted.current) return;
    setToastMsg(message);
    setToastType(type);
    setShowToast(true);
  }, []);

  // 获取产品列表
  const fetchProducts = useCallback(async (isRefresh = false) => {
    try {
      const page = isRefresh ? 1 : currentPage;
      
      if (isRefresh) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      const response = await getCoatingList({
        page,
        pageSize: 10
      });

      if (!isMounted.current) return;
      
      // 处理成功响应
      if (response.success) {
        const productData = response.data || [];
        
        // 根据刷新标志更新状态
        if (isRefresh) {
          setProducts(productData);
        } else {
          setProducts(prevProducts => [...prevProducts, ...productData]);
        }
        
        // 更新分页状态
        setHasMore(response.hasMore || false);
        if (!isRefresh) {
          setCurrentPage(prev => prev + 1);
        } else {
          setCurrentPage(2);
        }
      } else {
        // 处理错误响应
        showToastMessage(response.error || '获取产品数据失败');
      }
    } catch (error) {
      // 处理异常
      if (!isMounted.current) return;
      console.error('获取产品数据错误', error);
      showToastMessage('获取产品数据失败，请稍后重试');
    } finally {
      // 重置加载状态
      if (!isMounted.current) return;
      setLoading(false);
      setLoadingMore(false);
    }
  }, [currentPage, showToastMessage]);

  // 挂载和刷新时获取产品
  useEffect(() => {
    fetchProducts(true);
  }, [fetchProducts]);

  // 页面显示时检查数据
  useDidShow(() => {
    if (products.length === 0 && !loading) {
      fetchProducts(true);
    }
  });

  // 下拉刷新处理
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

  // 产品点击处理
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

  // 关闭详情模态框
  const handleCloseDetail = useCallback(() => {
    setShowDetail(false);
    setTimeout(() => {
      setSelectedProduct(null);
    }, 300);
  }, []);

  // 联系按钮处理
  const handleContactClick = useCallback(() => {
    handleCloseDetail();
    Taro.switchTab({ url: '/pages/contact/index' });
  }, [handleCloseDetail]);

  // 加载更多处理
  const handleLoadMore = useCallback(() => {
    if (hasMore && !loading && !loadingMore) {
      return fetchProducts(false);
    }
    return Promise.resolve();
  }, [hasMore, loading, loadingMore, fetchProducts]);

  // 骨架屏UI - 使用记忆化优化性能
  const renderSkeletons = useMemo(() => {
    return (
      <View className="product-grid__skeletons">
        {[1, 2, 3, 4].map(i => (
          <View key={i} className="product-skeleton">
            <View className="product-skeleton__image"></View>
            <View className="product-skeleton__content">
              <View className="product-skeleton__title"></View>
              <View className="product-skeleton__title" style={{ width: '80%' }}></View>
              <View className="product-skeleton__price"></View>
            </View>
          </View>
        ))}
      </View>
    );
  }, []);

  return (
    <View className="product-page">
      {/* 产品列表内容 */}
      <View className="product-page__container">
        {loading && products.length === 0 ? (
          renderSkeletons
        ) : products.length > 0 ? (
          <>
            <View className="product-grid">
              {products.map((product) => (
                <View key={product.id} className="product-grid__item">
                  <ProductCard
                    image={product.images[0]}
                    title={product.title}
                    specifications={product.specifications}
                    onClick={() => handleProductClick(product.id)}
                  />
                </View>
              ))}
            </View>
            
            {/* 无限加载 */}
            <InfiniteLoading
              hasMore={hasMore}
              threshold={100}
              loadingText="加载中..."
              loadMoreText="已经到底啦"
              onLoadMore={handleLoadMore}
            />
          </>
        ) : (
          <View className="product-page__empty">
            <Empty description="暂无相关产品" image="empty" />
          </View>
        )}
      </View>

      {/* 产品详情弹窗 */}
      <Popup
        visible={showDetail}
        position="bottom"
        round
        style={{ height: '92%' }}
        onClose={handleCloseDetail}
        closeable={false}
      >
        {selectedProduct && (
          <ProductDetail 
            product={selectedProduct}
            visible={showDetail}
            onClose={handleCloseDetail}
            onContactClick={handleContactClick}
          />
        )}
      </Popup>

      {/* Toast提示 */}
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