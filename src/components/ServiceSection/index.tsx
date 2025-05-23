import { View, Text } from '@tarojs/components'
import { Service } from 'src/services/api/index/types'
import './index.scss'

interface ServiceSectionProps {
  services: Service[];
  title?: string;
}

const ServiceSection: React.FC<ServiceSectionProps> = ({ services, title = "我们的服务" }) => {
  if (!services || services.length === 0) {
    return null;
  }

  return (
    <View className='service-section-container card'>
      <View className='section-header'>
        <Text className='section-title'>{title}</Text>
      </View>
      <View className='service-grid'>
        {services.map(service => (
          <View key={service.id} className='service-item'>
            <Text className='service-item-title text-bold'>{service.title}</Text>
            <Text className='service-item-description'>{service.description}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default ServiceSection;