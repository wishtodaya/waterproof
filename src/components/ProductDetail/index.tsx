// components/ProductDetail/index.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Button } from '@nutui/nutui-react-taro';
import { WaterproofCoating } from 'src/services/api/product/types';
import './index.scss';

interface ProductDetailProps {
  product: WaterproofCoating | null;
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
  
  const handleImageClick = (index: number) => {
    if (!product) return;
    
    Taro.previewImage({
      current: product.images[index],
      urls: product.images
    });
  };
  
  const handleContactClick = () => {
    onClose();
    if (onContactClick) {
      onContactClick();
    } else {
      Taro.switchTab({ url: '/pages/contact/index' });
    }
  };
  
  if (!visible || !product) return null;
  
  return (
    <View className="product-detail-container">
      {/* 固定高度的图片区域 */}
      <View className="product-detail-images">
        <ScrollView 
          scrollX 
          className="images-scroll"
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
              key={`image-${index}`} 
              className="image-item"
              onClick={() => handleImageClick(index)}
            >
              <Image 
                src={image} 
                mode="aspectFill"
                className="detail-image"
                lazyLoad
              />
            </View>
          ))}
        </ScrollView>
        
        {product.images.length > 1 && (
          <View className="image-indicators">
            {product.images.map((_, index) => (
              <View 
                key={`indicator-${index}`}
                className={`image-indicator ${currentImageIndex === index ? 'active' : ''}`} 
              />
            ))}
          </View>
        )}
        
        <View className="image-hint">
          <Text className="hint-text">点击查看大图</Text>
        </View>
      </View>
      
      {/* 可滚动的内容区域 */}
      <ScrollView 
        scrollY
        className="product-detail-info"
        enhanced={false}
        showScrollbar={false}
      >
        <View className="product-title">{product.title}</View>
        
        <View className="product-specs">
          <View className="spec-item">
            <Text className="spec-label">产品类型:</Text>
            <Text className="spec-value">{product.type}</Text>
          </View>
          <View className="spec-item">
            <Text className="spec-label">规格:</Text>
            <Text className="spec-value">{product.specifications}</Text>
          </View>
          <View className="spec-item">
            <Text className="spec-label">干燥时间:</Text>
            <Text className="spec-value">{product.dryTime}</Text>
          </View>
        </View>
        
        <View className="product-section">
          <Text className="section-title">产品简介</Text>
          <Text className="section-content">{product.description}</Text>
        </View>
        
        <View className="product-section">
          <Text className="section-title">详细说明</Text>
          <Text className="section-content">{product.content}</Text>
        </View>
        
        <View className="product-actions">
          <Button 
            type="primary" 
            block
            className="contact-button"
            onClick={handleContactClick}
          >
            咨询此产品
          </Button>
        </View>
      </ScrollView>
      
      <View className="close-button" onClick={onClose}>
        <Text className="close-icon">×</Text>
      </View>
    </View>
  );
};

export default ProductDetail;