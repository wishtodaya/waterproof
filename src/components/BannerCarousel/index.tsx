// src/components/BannerCarousel/index.tsx
import { useState, useRef, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { 
  Image,
  Swiper,
  SwiperItem
} from '@nutui/nutui-react-taro'
import './index.scss'

export interface BannerItem {
  id: string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
}

interface BannerCarouselProps {
  banners: BannerItem[];
  badgeText?: string;
}

const BannerCarousel: React.FC<BannerCarouselProps> = ({ 
  banners,
  badgeText = '10年专业品质'
}) => {
  // 状态管理
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});
  const [swiperInitialized, setSwiperInitialized] = useState(false);
  
  // Swiper引用
  const swiperRef = useRef(null);

  // 初始化组件
  useEffect(() => {
    // 预设所有轮播图状态为未加载
    if (banners?.length) {
      const initialLoadState = banners.reduce((acc, banner) => {
        acc[banner.id] = false;
        return acc;
      }, {} as Record<string, boolean>);
      setImagesLoaded(initialLoadState);
    }
    
    // 延迟初始化轮播，减少初始加载时的闪烁
    setTimeout(() => {
      setSwiperInitialized(true);
    }, 100);
  }, [banners]);

  // 图片加载处理函数
  const handleImageLoad = (bannerId: string) => {
    setImagesLoaded(prev => ({
      ...prev,
      [bannerId]: true
    }));
  };

  return (
    <View className='banner-section'>
      {swiperInitialized && (
        <Swiper
          className='banner-swiper'
          height={280}
          autoPlay={true}
          loop={true}
          defaultValue={0}
          direction="horizontal"
          indicator={true}
          ref={swiperRef}
          style={{
            willChange: 'transform',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
          }}
          // 以下是对Taro Swiper的属性透传
          indicatorColor='rgba(255, 255, 255, 0.4)'
          indicatorActiveColor='#fff'
          interval={4000}
          previousMargin='0px'
          nextMargin='0px'
        >
          {banners.map((banner) => (
            <SwiperItem key={banner.id}>
              <View className='banner-item'>
                <Image 
                  src={banner.imageUrl}
                  width="100%"
                  height="100%"
                  className={`banner-image ${imagesLoaded[banner.id] ? '' : 'loading'}`}
                  onLoad={() => handleImageLoad(banner.id)}
                  loading={<View className="banner-loading">加载中...</View>}
                  error={<View className="banner-error">加载失败</View>}
                />
                <View className='banner-overlay'>
                  <Text className='banner-title'>{banner.title || '专业防水服务'}</Text>
                  <Text className='banner-subtitle'>{banner.subtitle || '10年专注防水 · 品质保障'}</Text>
                </View>
                {badgeText && <View className='quality-badge'>{badgeText}</View>}
              </View>
            </SwiperItem>
          ))}
        </Swiper>
      )}
    </View>
  );
};

export default BannerCarousel;