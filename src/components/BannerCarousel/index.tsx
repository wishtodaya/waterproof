import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components'
import { Banner } from 'src/api/index/types'
import './index.scss'

interface BannerCarouselProps {
  banners: Banner[];
}

export default function BannerCarousel({ banners }: BannerCarouselProps) {
  return (
    <View className='banner-carousel'>
      <Swiper
        className='banner-swiper'
        indicatorColor='#ddd'
        indicatorActiveColor='#2563EB'
        circular
        indicatorDots
        autoplay
        interval={3500}
      >
        {banners.map(banner => (
          <SwiperItem key={banner.id}>
            <View className='banner-item'>
              <Image 
                className='banner-image' 
                src={banner.imageUrl} 
                mode='aspectFill'
              />
              <View className='banner-content'>
                {banner.title && (
                  <Text className='banner-title'>{banner.title}</Text>
                )}
                
                {banner.subtitle && (
                  <Text className='banner-subtitle'>{banner.subtitle}</Text>
                )}
              </View>
            </View>
          </SwiperItem>
        ))}
      </Swiper>
    </View>
  )
}