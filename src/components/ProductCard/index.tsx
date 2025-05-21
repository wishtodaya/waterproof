import React, { useState, memo } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { Loading } from '@nutui/nutui-react-taro';
import './index.scss';

interface ProductCardProps {
  image: string;
  title: string;
  specifications: string;
  onClick?: () => void;
  aspectRatio?: string; // 可选的宽高比（例如："1/1", "4/3", "16/9"）
  imageFit?: "aspectFill" | "aspectFit" | "widthFix" | "heightFix" | "scaleToFill"; // 可选的填充模式
}

const ProductCard: React.FC<ProductCardProps> = memo(({
  image,
  title,
  specifications,
  onClick,
  aspectRatio = "1/1", // 默认正方形宽高比
  imageFit = "aspectFill"   // 默认填充模式
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // 图片加载完成时处理
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <View 
      className="product-card" 
      onClick={onClick} 
      hoverClass="product-card--active"
    >
      <View 
        className="product-card__image-wrap"
        style={{ aspectRatio }}
      >
        {!imageLoaded && !imageError && (
          <View className="product-card__image-loading">
            <Loading />
          </View>
        )}
        {imageError && (
          <View className="product-card__image-error">
            <Text>加载失败</Text>
          </View>
        )}
        <Image 
          src={image} 
          mode={imageFit}
          className="product-card__image"
          lazyLoad
          onLoad={handleImageLoad}
          onError={() => setImageError(true)}
          style={{ opacity: imageLoaded ? 1 : 0 }}
        />
      </View>
      
      <View className="product-card__info">
        <Text className="product-card__title">{title}</Text>
        <View className="product-card__price-info">
          <Text className="product-card__price-label">全国统一零售价：</Text>
          <Text className="product-card__price-value">{specifications}</Text>
        </View>
      </View>
    </View>
  );
});

export default ProductCard;