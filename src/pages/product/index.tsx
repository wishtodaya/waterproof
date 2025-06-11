import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
// 修改API导入路径
import { 
  getCoatingList, 
  getCoatingDetail 
} from 'src/services/api/product/coatingApi';
import { WaterproofCoating } from 'src/services/api/product/types';
import './index.scss';

// 保持原有常量
const SKELETON_COUNT = 4;
const PAGE_SIZE = 10;
const POPUP_HEIGHT = '92%';
const TOAST_DURATION = 2000;

// 保持原有状态类型
interface PageState {
  loading: boolean;
  loadingMore: boolean;
  products: WaterproofCoating[];
  selectedProduct: WaterproofCoating | null;
  showDetail: boolean;
  currentPage: number;
  hasMore: boolean;
}

interface ToastState {
  show: boolean;
  msg: string;
  type: 'success' | 'fail' | 'warn';
}

// 保持原有初始状态
const initialState: PageState = {
  loading: true,
  loadingMore: false,
  products: [],
  selectedProduct: null,
  showDetail: false,
  currentPage: 1,
  hasMore: true
};

const initialToast: ToastState = {
  show: false,
  msg: '',
  type: 'fail'
};

export default function ProductPage() {
  const [state, setState] = useState<PageState>(initialState);
  const [toast, setToast] = useState<ToastState>(initialToast);
  const isMounted = useRef(true);
  
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  useShareAppMessage(() => ({
    title: '专业防水产品',
    path: '/pages/product/index',
    imageUrl: state.products[0]?.images[0]
  }));

  const showToastMessage = useCallback((message: string, type: ToastState['type'] = 'fail') => {
    if (!isMounted.current) return;
    setToast({ show: true, msg: message, type });
  }, []);

  const updateState = useCallback((updates: Partial<PageState>) => {
    if (!isMounted.current) return;
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // 修改API调用，保持其他逻辑
  const fetchProducts = useCallback(async (isRefresh = false) => {
    try {
      const page = isRefresh ? 1 : state.currentPage;
      
      updateState({
        [isRefresh ? 'loading' : 'loadingMore']: true
      });
      
      const response = await getCoatingList({ page, pageSize: PAGE_SIZE });

      if (!isMounted.current) return;
      
      if (response.success) {
        const productData = response.data || [];
        
        updateState({
          products: isRefresh ? productData : [...state.products, ...productData],
          currentPage: isRefresh ? 2 : state.currentPage + 1,
          hasMore: response.hasMore || false,
          loading: false,
          loadingMore: false
        });
      } else {
        throw new Error(response.error || '获取产品数据失败');
      }
    } catch (error) {
      if (!isMounted.current) return;
      console.error('获取产品数据错误', error);
      showToastMessage(error instanceof Error ? error.message : '获取产品数据失败，请稍后重试');
      updateState({ loading: false, loadingMore: false });
    }
  }, [state.currentPage, state.products, showToastMessage, updateState]);

  useEffect(() => {
    fetchProducts(true);
  }, []);

  useDidShow(() => {
    if (state.products.length === 0 && !state.loading) {
      fetchProducts(true);
    }
  });

  useEffect(() => {
    const handlePullDownRefresh = async () => {
      await fetchProducts(true);
      Taro.stopPullDownRefresh();
    };
    
    Taro.eventCenter.on('pullDownRefresh', handlePullDownRefresh);
    return () => {
      Taro.eventCenter.off('pullDownRefresh', handlePullDownRefresh);
    };
  }, [fetchProducts]);

  // 修改API调用，保持其他逻辑
  const handleProductClick = useCallback(async (id: number) => {
    try {
      updateState({ loading: true });
      const response = await getCoatingDetail(id);
      
      if (!isMounted.current) return;
      
      if (response.success && response.data) {
        updateState({
          selectedProduct: response.data,
          showDetail: true,
          loading: false
        });
      } else {
        throw new Error(response.error || '获取产品详情失败');
      }
    } catch (error) {
      if (!isMounted.current) return;
      console.error('获取产品详情错误', error);
      showToastMessage(error instanceof Error ? error.message : '获取产品详情失败，请稍后重试');
      updateState({ loading: false });
    }
  }, [showToastMessage, updateState]);

  const handleCloseDetail = useCallback(() => {
    updateState({ showDetail: false });
    setTimeout(() => {
      updateState({ selectedProduct: null });
    }, 300);
  }, [updateState]);

  const handleContactClick = useCallback(() => {
    handleCloseDetail();
    Taro.switchTab({ url: '/pages/contact/index' });
  }, [handleCloseDetail]);

  const handleLoadMore = useCallback(() => {
    if (state.hasMore && !state.loading && !state.loadingMore) {
      return fetchProducts(false);
    }
    return Promise.resolve();
  }, [state.hasMore, state.loading, state.loadingMore, fetchProducts]);

  // 保持原有渲染逻辑
  const renderSkeletons = useMemo(() => (
    <View className="product-grid">
      {Array.from({ length: SKELETON_COUNT }, (_, i) => (
        <View key={i} className="product-skeleton">
          <View className="product-skeleton__image" />
          <View className="product-skeleton__content">
            <View className="product-skeleton__title" />
            <View className="product-skeleton__title" />
            <View className="product-skeleton__price" />
          </View>
        </View>
      ))}
    </View>
  ), []);

  const renderProducts = useMemo(() => (
    <>
      <View className="product-grid">
        {state.products.map((product) => (
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
      
      <InfiniteLoading
        hasMore={state.hasMore}
        threshold={100}
        loadingText="加载中..."
        loadMoreText="已经到底啦"
        onLoadMore={handleLoadMore}
      />
    </>
  ), [state.products, state.hasMore, handleProductClick, handleLoadMore]);

  const renderEmpty = useMemo(() => (
    <View className="product-page__empty">
      <Empty description="暂无相关产品" image="empty" />
    </View>
  ), []);

  return (
    <View className="product-page">
      <View className="product-page__container">
        {state.loading && state.products.length === 0 
          ? renderSkeletons 
          : state.products.length > 0 
            ? renderProducts 
            : renderEmpty
        }
      </View>

      <Popup
        visible={state.showDetail}
        position="bottom"
        round
        style={{ height: POPUP_HEIGHT }}
        onClose={handleCloseDetail}
        closeable={false}
      >
        {state.selectedProduct && (
          <ProductDetail 
            product={state.selectedProduct}
            visible={state.showDetail}
            onClose={handleCloseDetail}
            onContactClick={handleContactClick}
          />
        )}
      </Popup>

      <Toast
        msg={toast.msg}
        visible={toast.show}
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, show: false }))}
        duration={TOAST_DURATION}
        position="center"
      />
    </View>
  );
}