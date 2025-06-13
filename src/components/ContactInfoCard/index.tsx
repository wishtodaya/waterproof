import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { ContactData } from 'src/api/contact/types'
import './index.scss'

interface ContactInfoCardProps {
  data: ContactData;
}

const ContactInfoCard: React.FC<ContactInfoCardProps> = ({ data }) => {
  const [showPhoneSelector, setShowPhoneSelector] = useState(false);
  
  const makePhoneCall = (phone: string) => {
    Taro.vibrateShort({ type: 'heavy' });
    setShowPhoneSelector(false);
    
    Taro.makePhoneCall({
      phoneNumber: phone
    });
  };
  
  const copyWechat = () => {
    Taro.vibrateShort({ type: 'medium' });
    Taro.setClipboardData({
      data: data.wechat
    });
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
    </View>
  );
};

export default ContactInfoCard;