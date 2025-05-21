import { View, Text, Swiper, SwiperItem } from '@tarojs/components'
import { useState, useRef, useEffect } from 'react'
import './index.scss'

// 服务项接口
export interface ServiceItem {
  id: number | string;
  title: string;
  description: string;
  features: string[];
}

interface ServiceCarouselProps {
  services: ServiceItem[];
  onServiceClick?: (service: ServiceItem) => void;
  autoPlay?: boolean;
  interval?: number;
  initialIndex?: number;
  className?: string;
}

const ServiceCarousel: React.FC<ServiceCarouselProps> = ({ 
  services = [],
  onServiceClick, 
  autoPlay = true, 
  interval = 4000,
  initialIndex = 0,
  className = ''
}) => {
  // 当前轮播索引
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  
  // 容器引用
  const containerRef = useRef<any>(null);
  
  // 边距状态
  const [sideMargin, setSideMargin] = useState('40px');
  
  // 缓存有效的服务列表
  const validServices = services?.filter(item => 
    item && (typeof item.id === 'number' || typeof item.id === 'string')
  ) || [];
  
  // 计算边距 - 基于父容器而非屏幕
  useEffect(() => {
    if (containerRef.current) {
      try {
        // 获取容器宽度
        const containerWidth = containerRef.current.clientWidth;
        // 卡片宽度为容器的85%
        const cardWidth = containerWidth * 0.85;
        // 两侧边距等分剩余空间
        const margin = Math.floor((containerWidth - cardWidth) / 2);
        setSideMargin(`${margin}px`);
      } catch (error) {
        // 异常处理
        console.error('计算边距出错', error);
      }
    }
  }, []);
  
  // 处理轮播切换
  const handleSwipeChange = (e: any) => {
    if (e?.detail?.current != null) {
      setCurrentIndex(e.detail.current);
    }
  };
  
  // 处理服务点击
  const handleServiceClick = (service: ServiceItem) => {
    onServiceClick?.(service);
  };

  // 空数据处理
  if (!validServices.length) {
    return <View className='service-carousel-empty'>暂无服务数据</View>;
  }

  // 计算是否应显示指示器
  const shouldShowIndicator = validServices.length > 1;
  
  // 计算初始索引，确保在有效范围内
  const safeInitialIndex = Math.max(0, Math.min(initialIndex, validServices.length - 1));

  return (
    <View className={`service-carousel ${className}`} ref={containerRef}>
      <Swiper
        className='service-swiper'
        circular={validServices.length > 2}
        autoplay={autoPlay && validServices.length > 1}
        interval={interval}
        previousMargin={sideMargin}
        nextMargin={sideMargin}
        onChange={handleSwipeChange}
        indicatorDots={false}
        current={safeInitialIndex}
      >
        {validServices.map((service, index) => (
          <SwiperItem key={`service-${service.id}`} className='service-swiper-item'>
            <View 
              className={`service-card ${index === currentIndex ? 'service-card-active' : ''}`}
              onClick={() => handleServiceClick(service)}
            >
              <View className='service-card-main'>
                <Text className='service-title'>{service.title || ''}</Text>
                <Text className='service-description'>{service.description || ''}</Text>
                
                <View className='service-features'>
                  {(service.features || []).map((feature, idx) => (
                    <Text key={`feature-${idx}`} className='feature-tag'>{feature}</Text>
                  ))}
                </View>
              </View>
            </View>
          </SwiperItem>
        ))}
      </Swiper>
      
      {/* 自定义指示器 */}
      {shouldShowIndicator && (
        <View className="swiper-indicators">
          {validServices.map((_, index) => (
            <View 
              key={`indicator-${index}`} 
              className={`swiper-indicator ${index === currentIndex ? 'swiper-indicator-active' : ''}`}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default ServiceCarousel;