import React, { useState, memo } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { Tag, Loading } from '@nutui/nutui-react-taro';
import './index.scss';

interface ProductCardProps {
  image: string;
  title: string;
  specifications: string;
  type: string;
  description: string;
  onClick?: () => void;
}

// 使用 memo 避免不必要的重渲染
const ProductCard: React.FC<ProductCardProps> = memo(({
  image,
  title,
  specifications,
  type,
  description,
  onClick
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <View 
      className="product-card" 
      onClick={onClick} 
      hoverClass="product-card--active"
      aria-label={`${title}, ${type}产品`}
      role="button"
    >
      {/* 产品图片 */}
      <View className="product-card__image">
        {!imageLoaded && !imageError && (
          <View className="product-card__image-loading">
            <Loading  />
          </View>
        )}
        {imageError && (
          <View className="product-card__image-error">
            加载失败
          </View>
        )}
        <Image 
          src={image} 
          mode="aspectFill" 
          className="product-card__image-el"
          lazyLoad
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          style={{ opacity: imageLoaded ? 1 : 0 }}
        />
      </View>
      
      {/* 产品内容 */}
      <View className="product-card__content">
        <View className="product-card__title">{title}</View>
        
        <View className="product-card__tags">
          <Tag 
            className="product-card__tag"
            plain
          >
            {type}
          </Tag>
        </View>
        
        <View className="product-card__description">{description}</View>
        
        <View className="product-card__specs">
          <Text className="product-card__specs-label">规格: </Text>
          <Text className="product-card__specs-value">{specifications}</Text>
        </View>
      </View>
    </View>
  );
});

export default ProductCard;