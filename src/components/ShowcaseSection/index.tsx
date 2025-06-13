// components/ShowcaseSection/index.tsx
import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import { Image } from '@nutui/nutui-react-taro'
import { Showcase } from 'src/api/index/types'
import CaseDetail from '../CaseDetail'
import './index.scss'

interface ShowcaseSectionProps {
  showcases: Showcase[];
  title?: string;
  onShowToast?: (message: string, type: 'success' | 'fail' | 'warn') => void;
}

const ShowcaseSection: React.FC<ShowcaseSectionProps> = ({
  showcases,
  title = '精选案例',
  onShowToast
}) => {
  // 状态管理
  const [showCaseDetail, setShowCaseDetail] = useState(false);
  const [selectedShowcase, setSelectedShowcase] = useState<Showcase | null>(null);

  // 查看案例详情
  const handleShowcaseClick = (showcase: Showcase) => {
    setSelectedShowcase(showcase);
    setShowCaseDetail(true);
  };

  // 关闭详情
  const handleCloseDetail = () => {
    setShowCaseDetail(false);
    setSelectedShowcase(null);
  };

  if (!showcases?.length) {
    return null;
  }

  return (
    <>
      <View className='section showcase-section'>
        <View className='section-header'>
          <Text className='section-title'>{title}</Text>
        </View>
        
        <View className='case-container'>
          {/* 主案例 - 使用封面图 */}
          <View 
            className='case-feature'
            onClick={() => handleShowcaseClick(showcases[0])}
          >
            <Image 
              src={showcases[0].coverImage}
              width="100%"
              height="160px"
              className='case-image'
              loading={<View className="case-image-loading">加载中...</View>}
              error={<View className="case-image-error">加载失败</View>}
            />
            <View className='case-content'>
              <Text className='case-title'>{showcases[0].title}</Text>
              <Text className='case-description'>{showcases[0].description}</Text>
            </View>
          </View>
          
          {/* 次要案例网格 - 使用封面图 */}
          {showcases.length > 1 && (
            <View className='case-grid'>
              {showcases.slice(1).map(item => (
                <View 
                  key={item.id} 
                  className='case-item'
                  onClick={() => handleShowcaseClick(item)}
                >
                  <Image 
                    src={item.coverImage}
                    width="100%"
                    height="90px"
                    className='case-image'
                    loading={<View className="case-image-loading">加载中...</View>}
                    error={<View className="case-image-error">加载失败</View>}
                  />
                  <View className='case-content'>
                    <Text className='case-title'>{item.title}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* 案例详情组件 */}
      {selectedShowcase && (
        <CaseDetail
          visible={showCaseDetail}
          caseData={selectedShowcase}
          onClose={handleCloseDetail}
        />
      )}
    </>
  );
};

export default ShowcaseSection;