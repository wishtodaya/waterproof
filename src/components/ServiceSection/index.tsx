// src/components/ServiceSection/index.tsx
import { View, Text } from '@tarojs/components'
import ServiceCarousel from 'src/components/ServiceCardCarousel'
import { Service } from 'src/services/api/index/indexApi'
import './index.scss'

interface ServiceSectionProps {
  services: Service[];
  title?: string;
}

const ServiceSection: React.FC<ServiceSectionProps> = ({
  services,
  title = '我们的服务'
}) => {
  // 处理服务点击 - 空实现
  const handleServiceClick = (service: Service) => {
    // 空实现，可由父组件通过props传入具体实现
    console.log('Service clicked:', service);
  };

  return (
    <View className='section service-section'>
      <View className='section-header'>
        <Text className='section-title'>{title}</Text>
      </View>
      <ServiceCarousel 
        services={services}
        onServiceClick={handleServiceClick}
        autoPlay={true}
        interval={5000}
        initialIndex={0}
        className="service-carousel-custom"
      />
    </View>
  );
};

export default ServiceSection;