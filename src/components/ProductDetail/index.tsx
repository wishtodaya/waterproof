import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import { Button } from '@nutui/nutui-react-taro';
import { WaterproofCoating } from 'src/services/api/product/types';
import './index.scss';

interface ProductDetailProps {
  product: WaterproofCoating;
  visible: boolean;
  onClose: () => void;
  onContactClick?: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ 
  product, 
  visible, 
  onClose,
  onContactClick
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // 产品切换时重置图片索引
  useEffect(() => {
    if (product?.id) {
      setCurrentImageIndex(0);
    }
  }, [product?.id]);
  
  // 处理横向滚动
  const handleScroll = useCallback((e: any) => {
    if (!product || product.images.length <= 1) return;
    
    const { scrollLeft, scrollWidth } = e.detail;
    const itemWidth = scrollWidth / product.images.length;
    const index = Math.round(scrollLeft / itemWidth);
    
    if (index !== currentImageIndex && index >= 0 && index < product.images.length) {
      setCurrentImageIndex(index);
    }
  }, [currentImageIndex, product]);
  
  // 缓存图片指示器渲染
  const imageIndicators = useMemo(() => {
    if (!product || product.images.length <= 1) return null;
    
    return (
      <View className="detail__gallery-indicators">
        {product.images.map((_, index) => (
          <View 
            key={index}
            className={`detail__gallery-indicator ${
              currentImageIndex === index ? 'detail__gallery-indicator--active' : ''
            }`}
          />
        ))}
      </View>
    );
  }, [product, currentImageIndex]);
  
  if (!visible || !product) return null;
  
  return (
    <View className="detail">
      {/* 顶部操作栏 */}
      <View className="detail__header">
        <View className="detail__close" onClick={onClose}>
          <Text className="detail__close-icon">×</Text>
        </View>
      </View>
      
      {/* 主内容滚动区 */}
      <ScrollView 
        scrollY 
        className="detail__scroll"
        enhanced
        showScrollbar={false}
      >
        {/* 图片轮播 */}
        <View className="detail__gallery">
          <ScrollView 
            scrollX 
            className="detail__gallery-scroll"
            scrollWithAnimation
            onScroll={handleScroll}
          >
            {product.images.map((image, index) => (
              <View 
                key={index}
                className="detail__gallery-item"
              >
                <Image 
                  src={image} 
                  className="detail__gallery-image" 
                  mode="aspectFit"
                  lazyLoad
                />
              </View>
            ))}
          </ScrollView>
          
          {imageIndicators}
        </View>
        
        {/* 产品信息 */}
        <View className="detail__content">
          <View className="detail__title-section">
            <Text className="detail__title">{product.title}</Text>
          </View>
          
          <View className="detail__info-card">
            <View className="detail__info-item">
              <Text className="detail__info-label">全国统一零售价</Text>
              <Text className="detail__info-value detail__info-value--price">
                {product.specifications}
              </Text>
            </View>
            <View className="detail__info-item">
              <Text className="detail__info-label">产品规格</Text>
              <Text className="detail__info-value">{product.type}</Text>
            </View>
          </View>
          
          <View className="detail__divider" />
          
          <View className="detail__section">
            <View className="detail__section-header">
              <Text className="detail__section-title">产品简介</Text>
            </View>
            <Text className="detail__section-content">{product.description}</Text>
          </View>
          
          <View className="detail__section">
            <View className="detail__section-header">
              <Text className="detail__section-title">适用范围</Text>
            </View>
            <Text className="detail__section-content">{product.content}</Text>
          </View>
        </View>
      </ScrollView>
      
      {/* 底部操作栏 */}
      <View className="detail__footer">
        <Button 
          type="primary" 
          block
          className="detail__contact-btn"
          onClick={onContactClick}
        >
          咨询此产品
        </Button>
      </View>
    </View>
  );
};

export default ProductDetail;