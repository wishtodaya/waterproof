import { View, Text, Swiper, SwiperItem } from '@tarojs/components'
import { Service } from 'src/services/api/index/types'
import './index.scss'

interface ServiceSectionProps {
  services: Service[]
}

export default function ServiceSection({ services }: ServiceSectionProps) {
  return (
    <View className='service-section card'>
      <View className='service-section__header'>
        <Text className='service-section__title'>我们的服务</Text>
        <Text className='service-section__subtitle'>专业团队，优质服务</Text>
      </View>
      
      <Swiper
        className='service-section__swiper'
        indicatorColor='#ddd'
        indicatorActiveColor='#2563EB'
        circular
        indicatorDots
        autoplay
        interval={5000} // 增加间隔时间，让用户有更多时间阅读
      >
        {services.map(service => (
          <SwiperItem key={service.id}>
            <View className='service-item'>
              <Text className='service-item__title'>{service.title}</Text>
              <Text className='service-item__description'>{service.description}</Text>
            </View>
          </SwiperItem>
        ))}
      </Swiper>
    </View>
  )
}