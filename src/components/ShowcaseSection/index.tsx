// src/components/ShowcaseSection/index.tsx
import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import { Image, Popup } from '@nutui/nutui-react-taro'
import Taro from '@tarojs/taro'
import { Showcase } from 'src/services/api/index/indexApi'
import './index.scss'

interface ShowcaseSectionProps {
  showcases: Showcase[];
  title?: string;
  contactPhone?: string;
  onShowToast?: (message: string, type: 'success' | 'fail' | 'warn') => void;
}

const ShowcaseSection: React.FC<ShowcaseSectionProps> = ({
  showcases,
  title = '精选案例',
  contactPhone,
  onShowToast
}) => {
  // 状态管理
  const [showShowcaseDetail, setShowShowcaseDetail] = useState(false);
  const [selectedShowcase, setSelectedShowcase] = useState<Showcase | null>(null);

  // 查看案例详情
  const handleShowcaseClick = (showcase: Showcase) => {
    setSelectedShowcase(showcase);
    setShowShowcaseDetail(true);
  };

  // 电话咨询
  const handleCall = () => {
    if (!contactPhone) return;
    
    Taro.makePhoneCall({
      phoneNumber: contactPhone
    }).catch(err => {
      if (err.errMsg && !err.errMsg.includes('cancel')) {
        onShowToast?.('拨号失败', 'fail');
      }
    });
  };

  if (!showcases?.length) {
    return null;
  }

  return (
    <View className='section showcase-section'>
      <View className='section-header'>
        <Text className='section-title'>{title}</Text>
      </View>
      
      <View className='case-container'>
        {/* 主案例 */}
        <View 
          className='case-feature'
          onClick={() => handleShowcaseClick(showcases[0])}
        >
          <Image 
            src={showcases[0].imageUrl}
            width="100%"
            height="160px"
            className='case-image'
            loading={<View className="case-image-loading"></View>}
            error={<View className="case-image-error"></View>}
          />
          <View className='case-content'>
            <Text className='case-title'>{showcases[0].title}</Text>
            <Text className='case-description'>{showcases[0].description}</Text>
          </View>
        </View>
        
        {/* 次要案例网格 */}
        {showcases.length > 1 && (
          <View className='case-grid'>
            {showcases.slice(1).map(item => (
              <View 
                key={item.id} 
                className='case-item'
                onClick={() => handleShowcaseClick(item)}
              >
                <Image 
                  src={item.imageUrl}
                  width="100%"
                  height="90px"
                  className='case-image'
                  loading={<View className="case-image-loading"></View>}
                  error={<View className="case-image-error"></View>}
                />
                <View className='case-content'>
                  <Text className='case-title'>{item.title}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* 案例详情弹窗 */}
      {selectedShowcase && (
        <Popup
          visible={showShowcaseDetail}
          position="bottom"
          round
          onClose={() => setShowShowcaseDetail(false)}
          style={{ height: '70%' }}
        >
          <View className='case-detail-popup'>
            <View className='popup-header'>
              <Text className='popup-title'>{selectedShowcase.title}</Text>
              <View 
                className='popup-close'
                onClick={() => setShowShowcaseDetail(false)}
              >
                ×
              </View>
            </View>
            <View className='popup-content'>
              <Image 
                src={selectedShowcase.imageUrl}
                width="100%"
                height="160px"
                className='case-detail-image'
                loading={<View className="case-image-loading"></View>}
                error={<View className="case-image-error"></View>}
              />
              <Text className='case-detail-description'>{selectedShowcase.description}</Text>
              <Text className='case-detail-content'>{selectedShowcase.content}</Text>
              {contactPhone && (
                <View 
                  className='detail-button'
                  onClick={handleCall}
                >
                  咨询此方案
                </View>
              )}
            </View>
          </View>
        </Popup>
      )}
    </View>
  );
};

export default ShowcaseSection;