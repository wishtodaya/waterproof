import React, { useState, useEffect } from 'react';
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
  
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [product?.id]);
  
  const handleContactClick = () => {
    if (onContactClick) {
      onContactClick();
    }
  };
  
  if (!visible || !product) return null;
  
  return (
    <View className="detail">
      {/* 关闭按钮 */}
      <View className="detail__close" onClick={onClose}>
        <Text className="detail__close-icon">×</Text>
      </View>
      
      <ScrollView 
        scrollY 
        className="detail__scroll"
        enhanced
        showScrollbar={false}
      >
        {/* 图片轮播区域 */}
        <View className="detail__gallery">
          <ScrollView 
            scrollX 
            className="detail__gallery-scroll"
            scrollWithAnimation
            onScroll={(e) => {
              if (product.images.length > 1) {
                const { scrollLeft, scrollWidth } = e.detail;
                const itemWidth = scrollWidth / product.images.length;
                const index = Math.round(scrollLeft / itemWidth);
                if (index !== currentImageIndex && index >= 0 && index < product.images.length) {
                  setCurrentImageIndex(index);
                }
              }
            }}
          >
            {product.images.map((image, index) => (
              <View 
                key={`img-${index}`}
                className="detail__gallery-item"
              >
                <Image 
                  src={image} 
                  className="detail__gallery-image" 
                  mode="aspectFill"
                  lazyLoad
                />
              </View>
            ))}
          </ScrollView>
          
          {/* 图片指示器 */}
          {product.images.length > 1 && (
            <View className="detail__gallery-indicators">
              {product.images.map((_, index) => (
                <View 
                  key={`indicator-${index}`}
                  className={`detail__gallery-indicator ${
                    currentImageIndex === index ? 'detail__gallery-indicator--active' : ''
                  }`}
                />
              ))}
            </View>
          )}
        </View>
        
        {/* 产品信息 */}
        <View className="detail__info">
          {/* 产品标题 */}
          <Text className="detail__title">{product.title}</Text>
          
          {/* 价格信息 */}
          <View className="detail__price-info">
            <Text className="detail__price-label">全国统一零售价：</Text>
            <Text className="detail__price-value">{product.specifications}</Text>
          </View>
          
          {/* 规格信息 */}
          <View className="detail__specs">
            <View className="detail__spec-item">
              <Text className="detail__spec-label">规格:</Text>
              <Text className="detail__spec-value">{product.type}</Text>
            </View>
          </View>
          
          {/* 产品简介 */}
          <View className="detail__section">
            <View className="detail__section-header">
              <Text className="detail__section-title">产品简介</Text>
            </View>
            <Text className="detail__section-content">{product.description}</Text>
          </View>
          
          {/* 适用范围 */}
          <View className="detail__section">
            <View className="detail__section-header">
              <Text className="detail__section-title">适用范围</Text>
            </View>
            <Text className="detail__section-content">{product.content}</Text>
          </View>
        </View>
      </ScrollView>
      
      {/* 固定在底部的咨询按钮 */}
      <View className="detail__footer">
        <Button 
          type="primary" 
          block
          className="detail__contact-btn"
          onClick={handleContactClick}
        >
          咨询此产品
        </Button>
      </View>
    </View>
  );
};

export default ProductDetail;