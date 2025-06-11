import React, { memo, useCallback } from 'react';
import { View, Text, Image } from '@tarojs/components';
import './index.scss';

interface CaseCardProps {
  id: number;
  title: string;
  description: string;
  date: string;
  image: string;
  onClick?: () => void;
}

// 日期格式化函数提取到组件外部，避免重复创建
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
  } catch {
    return dateString;
  }
};

const CaseCard: React.FC<CaseCardProps> = memo(({
  title,
  description,
  date,
  image,
  onClick
}) => {
  // 使用useCallback优化事件处理
  const handleClick = useCallback(() => {
    onClick?.();
  }, [onClick]);

  // 图片加载失败处理
  const handleImageError = useCallback((e: any) => {
    e.target.src = 'https://via.placeholder.com/400x200?text=图片加载失败';
  }, []);

  return (
    <View className="case-card" onClick={handleClick}>
      <View className="case-card__images">
        <Image 
          src={image} 
          className="case-card__image"
          mode="aspectFill"
          lazyLoad
          onError={handleImageError}
        />
      </View>
      <View className="case-card__content">
        <Text className="case-card__title">{title}</Text>
        <Text className="case-card__description">{description}</Text>
        <View className="case-card__date">
          施工时间: {formatDate(date)}
        </View>
      </View>
    </View>
  );
});

// 设置显示名称，便于调试
CaseCard.displayName = 'CaseCard';

export default CaseCard;