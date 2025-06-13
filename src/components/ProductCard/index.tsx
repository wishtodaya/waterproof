import React, { useState, useCallback, memo } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { Loading } from '@nutui/nutui-react-taro';
import './index.scss';

interface ProductCardProps {
  image: string;
  title: string;
  specifications: string;
  onClick?: () => void;
}

type ImageStatus = 'loading' | 'loaded' | 'error';

const ProductCard: React.FC<ProductCardProps> = memo(({
  image,
  title,
  specifications,
  onClick
}) => {
  const [imageStatus, setImageStatus] = useState<ImageStatus>('loading');

  const handleImageLoad = useCallback(() => {
    setImageStatus('loaded');
  }, []);

  const handleImageError = useCallback(() => {
    setImageStatus('error');
  }, []);

  return (
    <View 
      className="product-card" 
      onClick={onClick} 
      hoverClass="product-card--active"
    >
      <View className="product-card__image-wrap">
        {imageStatus === 'loading' && (
          <View className="product-card__image-loading">
            <Loading />
          </View>
        )}
        
        {imageStatus === 'error' && (
          <View className="product-card__image-error">
            <Text>加载失败</Text>
          </View>
        )}
        
        <Image 
          src={image} 
          mode="aspectFit"
          className="product-card__image"
          lazyLoad
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ opacity: imageStatus === 'loaded' ? 1 : 0 }}
        />
      </View>
      
      <View className="product-card__info">
        <Text className="product-card__title">{title}</Text>
        <View className="product-card__price-info">
          <Text className="product-card__price-label">全国统一零售价</Text>
          <Text className="product-card__price-value">{specifications}元</Text>
        </View>
      </View>
    </View>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;