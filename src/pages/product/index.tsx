import { useState, useCallback } from 'react'
import { View } from '@tarojs/components'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { Empty, Popup, InfiniteLoading } from '@nutui/nutui-react-taro'
import { usePagination } from 'src/utils/http/hooks'
import { api } from 'src/api'
import ProductCard from 'src/components/ProductCard'
import ProductDetail from 'src/components/ProductDetail'
import { WaterproofCoating } from 'src/api/product/types'
import './index.scss'

export default function ProductPage() {
  const [selectedProduct, setSelectedProduct] = useState<WaterproofCoating | null>(null)
  const [showDetail, setShowDetail] = useState(false)

  // 分享配置
  useShareAppMessage(() => ({
    title: '专业防水产品',
    path: '/pages/product/index',
  }))

  // 获取产品列表
  const {
    list: products,
    loading,
    hasMore,
    loadMore,
    refresh
  } = usePagination(
    // FIX: Adapt pagination params to what the API expects (pageNo -> page)
    (params) => api.coating.getCoatingList({
      page: params.pageNo,
      pageSize: params.pageSize,
    }),
    { defaultPageSize: 10 }
  )

  // 查看产品详情
  const handleProductClick = useCallback(async (id: number) => {
    try {
      const product = await api.coating.getCoatingDetail(id)
      setSelectedProduct(product)
      setShowDetail(true)
    } catch (error) {
      // HTTP层已处理错误
    }
  }, [])

  // 关闭详情
  const handleCloseDetail = useCallback(() => {
    setShowDetail(false)
    setTimeout(() => setSelectedProduct(null), 300)
  }, [])

  // 联系咨询
  const handleContactClick = useCallback(() => {
    handleCloseDetail()
    Taro.switchTab({ url: '/pages/contact/index' })
  }, [handleCloseDetail])

  // 下拉刷新
  Taro.usePullDownRefresh(async () => {
    await refresh()
    Taro.stopPullDownRefresh()
  })

  return (
    <View className="product-page">
      <View className="product-page__container">
        {loading && products.length === 0 ? (
          // 骨架屏
          <View className="product-grid">
            {Array.from({ length: 4 }, (_, i) => (
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

            <InfiniteLoading
              hasMore={hasMore}
              threshold={100}
              loadingText="加载中..."
              loadMoreText="已经到底啦"
              onLoadMore={loadMore}
            />
          </>
        ) : (
          <View className="product-page__empty">
            <Empty description="暂无相关产品" image="empty" />
          </View>
        )}
      </View>

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
    </View>
  )
}