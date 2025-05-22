import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Toast } from '@nutui/nutui-react-taro'
import { ContactData } from 'src/services/api/contact/types'
import './index.scss'

interface ContactInfoCardProps {
  data: ContactData;
  onCopyWechat?: () => void;
  onPhoneCall?: (phone: string) => void;
}

const ContactInfoCard: React.FC<ContactInfoCardProps> = ({ 
  data,
  onCopyWechat,
  onPhoneCall
}) => {
  const [showToast, setShowToast] = useState(false);
  const [toastContent, setToastContent] = useState('');
  const [toastIcon, setToastIcon] = useState<'success' | 'fail' | 'loading'>('success');
  const [showPhoneSelector, setShowPhoneSelector] = useState(false);
  
  const showMessage = (content: string, icon: 'success' | 'fail' | 'loading' = 'success') => {
    setToastContent(content);
    setToastIcon(icon);
    setShowToast(true);
  };
  
  const makePhoneCall = (phone: string) => {
    Taro.vibrateShort({ type: 'heavy' });
    setShowPhoneSelector(false);
    
    if (onPhoneCall) {
      onPhoneCall(phone);
    } else {
      Taro.makePhoneCall({
        phoneNumber: phone,
        fail: () => {
          showMessage('拨打失败', 'fail');
        }
      });
    }
  };
  
  const copyWechat = () => {
    Taro.vibrateShort({ type: 'heavy' });
    
    if (onCopyWechat) {
      onCopyWechat();
    } else {
      Taro.setClipboardData({
        data: data.wechat,
        success: () => {
          showMessage('已复制到剪贴板');
        },
        fail: () => {
          showMessage('复制失败', 'fail');
        }
      });
    }
  };
  
  const handleQuickCall = () => {
    if (data.phone.length === 1) {
      makePhoneCall(data.phone[0]);
    } else {
      setShowPhoneSelector(true);
    }
  };
  
  const handlePhoneSelectorClose = () => {
    setShowPhoneSelector(false);
  };
  
  return (
    <View className="contact-info">
      <View className="company-intro">
        <Text>{data.description}</Text>
      </View>
      
      <View className="actions-grid">
        <View className="action-card call-card" onClick={handleQuickCall}>
          <Text className="card-icon">📞</Text>
          <Text className="card-title">立即致电</Text>
        </View>
        
        <View className="action-card wechat-card" onClick={copyWechat}>
          <Text className="card-icon">💬</Text>
          <Text className="card-title">微信咨询</Text>
        </View>
      </View>
      
      {showPhoneSelector && (
        <View className="phone-selector" onClick={handlePhoneSelectorClose}>
          <View className="selector-content" onClick={(e) => e.stopPropagation()}>
            <View className="selector-header">
              <Text className="selector-title">选择号码拨打</Text>
            </View>
            <View className="phone-options">
              {data.phone.map((phone, index) => (
                <View 
                  key={index}
                  className="phone-option"
                  onClick={() => makePhoneCall(phone)}
                >
                  <Text className="option-number">{phone}</Text>
                  <Text className="option-icon">📞</Text>
                </View>
              ))}
            </View>
            <View className="selector-cancel" onClick={handlePhoneSelectorClose}>
              <Text className="cancel-text">取消</Text>
            </View>
          </View>
        </View>
      )}
      
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