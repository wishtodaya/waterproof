import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { View, Text, Image, ScrollView, Video } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Button } from '@nutui/nutui-react-taro';
import { CaseData } from 'src/api/cases/types';
import './index.scss';

interface CaseDetailProps {
  caseData: CaseData;
  visible: boolean;
  onClose: () => void;
  onContactClick?: () => void;
}

// 格式化日期函数
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  } catch {
    return dateString;
  }
};

const CaseDetail: React.FC<CaseDetailProps> = ({ 
  caseData, 
  visible, 
  onClose,
  onContactClick
}) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const scrollTimerRef = useRef<any>(null);
  
  // 优化媒体列表计算
  const { hasVideos, mediaList } = useMemo(() => {
    if (!caseData) {
      return { hasVideos: false, mediaList: [] };
    }
    
    const videos = caseData.videos || [];
    const images = caseData.images || [];
    const hasVids = videos.length > 0;
    
    return { 
      hasVideos: hasVids, 
      mediaList: hasVids ? videos : images 
    };
  }, [caseData]);
  
  // 重置媒体索引
  useEffect(() => {
    if (visible && caseData?.id) {
      setCurrentMediaIndex(0);
    }
  }, [visible, caseData?.id]);
  
  // 清理定时器
  useEffect(() => {
    return () => {
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
    };
  }, []);
  
  // 优化滚动处理
  const handleScroll = useCallback((e: any) => {
    if (!caseData || mediaList.length <= 1) return;
    
    // 防抖处理
    if (scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current);
    }
    
    scrollTimerRef.current = setTimeout(() => {
      const { scrollLeft, scrollWidth } = e.detail;
      const itemWidth = scrollWidth / mediaList.length;
      const index = Math.round(scrollLeft / itemWidth);
      
      if (index !== currentMediaIndex && index >= 0 && index < mediaList.length) {
        setCurrentMediaIndex(index);
      }
    }, 50);
  }, [currentMediaIndex, caseData, mediaList]);
  
  // 媒体指示器渲染
  const renderMediaIndicators = useMemo(() => {
    if (!caseData || mediaList.length <= 1) return null;
    
    return (
      <View className="case-detail__gallery-indicators">
        {mediaList.map((_, index) => (
          <View 
            key={index}
            className={`case-detail__gallery-indicator ${
              currentMediaIndex === index ? 'case-detail__gallery-indicator--active' : ''
            }`}
          />
        ))}
      </View>
    );
  }, [caseData, currentMediaIndex, mediaList]);
  
  // 处理图片预览
  const handleImagePreview = useCallback((currentUrl: string) => {
    if (!hasVideos && caseData?.images) {
      Taro.previewImage({
        current: currentUrl,
        urls: caseData.images,
        fail: () => {
          console.error('图片预览失败');
        }
      });
    }
  }, [hasVideos, caseData]);
  
  // 处理图片加载错误
  const handleImageError = useCallback((e: any) => {
    e.target.src = 'https://via.placeholder.com/400x320?text=图片加载失败';
  }, []);
  
  // 处理咨询点击 - 直接跳转
  const handleContactClick = useCallback(() => {
    if (onContactClick) {
      onContactClick();
    } else {
      // 默认行为：直接跳转到联系页面
      Taro.switchTab({
        url: '/pages/contact/index',
      });
    }
  }, [onContactClick]);
  
  if (!visible || !caseData) return null;
  
  return (
    <View className="case-detail">
      {/* 顶部操作栏 */}
      <View className="case-detail__header">
        <View className="case-detail__close" onClick={onClose}>
          <Text className="case-detail__close-icon">×</Text>
        </View>
      </View>
      
      {/* 主内容滚动区 */}
      <ScrollView 
        scrollY 
        className="case-detail__scroll"
        enhanced
        showScrollbar={false}
        bounces={false}
      >
        {/* 媒体轮播 - 高度调整 */}
        <View className="case-detail__gallery">
          <ScrollView 
            scrollX 
            className="case-detail__gallery-scroll"
            scrollWithAnimation
            onScroll={handleScroll}
            enhanced
            showScrollbar={false}
          >
            {hasVideos ? (
              // 视频轮播
              mediaList.map((video, index) => (
                <View 
                  key={`video-${index}`}
                  className="case-detail__gallery-item case-detail__gallery-item--video"
                >
                  <Video 
                    src={video}
                    className="case-detail__gallery-video"
                    controls
                    showFullscreenBtn
                    showPlayBtn
                    autoplay={false}
                    objectFit="contain"
                    poster=""
                  />
                </View>
              ))
            ) : (
              // 图片轮播
              mediaList.map((image, index) => (
                <View 
                  key={`image-${index}`}
                  className="case-detail__gallery-item"
                  onClick={() => handleImagePreview(image)}
                >
                  <Image 
                    src={image} 
                    className="case-detail__gallery-image" 
                    mode="aspectFill"
                    lazyLoad
                    onError={handleImageError}
                  />
                </View>
              ))
            )}
          </ScrollView>
          
          {renderMediaIndicators}
        </View>
        
        {/* 案例信息 */}
        <View className="case-detail__content">
          <View className="case-detail__title-section">
            <Text className="case-detail__title">{caseData.title}</Text>
          </View>
          
          {/* 优化后的信息卡片 */}
          <View className="case-detail__info-card">
            <View className="case-detail__info-item">
              <Text className="case-detail__info-label">施工时间</Text>
              <Text className="case-detail__info-value case-detail__info-value--date">
                {formatDate(caseData.date)}
              </Text>
            </View>
            <View className="case-detail__info-item">
              <Text className="case-detail__info-label">项目地点</Text>
              <Text className="case-detail__info-value">{caseData.city}</Text>
            </View>
          </View>
          
          <View className="case-detail__divider" />
          
          {/* 项目概述 */}
          <View className="case-detail__section">
            <View className="case-detail__section-header">
              <Text className="case-detail__section-title">项目概述</Text>
            </View>
            <Text className="case-detail__section-content">{caseData.content}</Text>
          </View>
        </View>
      </ScrollView>
      
      {/* 底部操作栏 */}
      <View className="case-detail__footer">
        <Button 
          type="primary" 
          block
          className="case-detail__contact-btn"
          onClick={handleContactClick}
        >
          咨询此案例
        </Button>
      </View>
    </View>
  );
};

export default CaseDetail;