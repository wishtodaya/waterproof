// components/ContactInfoCard/index.tsx
import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Toast } from '@nutui/nutui-react-taro'
// 直接导入类型
import { ContactData } from 'src/services/api/contact/types'
import './index.scss'

interface ContactInfoCardProps {
  data: ContactData;
  onCopyWechat?: () => void;
  onPhoneCall?: () => void;
}

const ContactInfoCard: React.FC<ContactInfoCardProps> = ({ 
  data,
  onCopyWechat,
  onPhoneCall
}) => {
  const [showToast, setShowToast] = useState(false);
  const [toastContent, setToastContent] = useState('');
  const [toastIcon, setToastIcon] = useState<'success' | 'fail' | 'loading'>('success');
  
  // 显示提示消息
  const showMessage = (content: string, icon: 'success' | 'fail' | 'loading' = 'success') => {
    setToastContent(content);
    setToastIcon(icon);
    setShowToast(true);
  };
  
  // 拨打电话
  const makePhoneCall = () => {
    // 添加震动反馈
    Taro.vibrateShort({ type: 'medium' });
    
    if (onPhoneCall) {
      onPhoneCall();
    } else {
      Taro.makePhoneCall({
        phoneNumber: data.phone,
        fail: () => {
          showMessage('拨打电话失败，请重试', 'fail');
        }
      });
    }
  };
  
  // 复制微信号
  const copyWechat = () => {
    // 添加震动反馈
    Taro.vibrateShort({ type: 'medium' });
    
    if (onCopyWechat) {
      onCopyWechat();
    } else {
      Taro.setClipboardData({
        data: data.wechat,
        success: () => {
          showMessage('微信号已复制，快去添加吧');
        },
        fail: () => {
          showMessage('复制失败，请重试', 'fail');
        }
      });
    }
  };
  
  // 渲染联系信息单元格
  const renderInfoCell = (type: 'phone' | 'wechat' | 'time' | 'address', label: string, value: string, onClick?: () => void) => {
    const isAddress = type === 'address';
    const isClickable = Boolean(onClick);
    
    return (
      <View 
        className={`info-cell ${isAddress ? 'info-cell-address' : ''} ${isClickable ? 'info-cell-clickable' : ''}`} 
        onClick={onClick}
      >
        <View className="info-cell-content">
          <View className={`info-icon ${type}-icon`}></View>
          <View className="info-text">
            <Text className="info-label">{label}</Text>
            <Text className="info-value">{value}</Text>
          </View>
        </View>
      </View>
    );
  };
  
  return (
    <View className="contact-info">
      <View className="about-description">
        <Text>{data.description}</Text>
      </View>
      
      <View className="info-divider"></View>
      
      <View className="info-cells">
        {renderInfoCell('phone', '电话咨询', data.phone, makePhoneCall)}
        {renderInfoCell('wechat', '微信咨询', data.wechat, copyWechat)}
        {renderInfoCell('time', '营业时间', data.businessHours)}
        {renderInfoCell('address', '公司地址', data.address)}
      </View>
      
      {/* 提示信息 */}
      <Toast
        visible={showToast}
        content={toastContent}
        icon={toastIcon}
        onClose={() => setShowToast(false)}
        duration={2000}
      />
    </View>
  );
};

export default ContactInfoCard;