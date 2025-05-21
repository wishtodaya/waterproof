// src/components/QuickContact/index.tsx
import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

interface ContactInfo {
  phone: string;
  wechat: string;
}

interface QuickContactProps {
  contactInfo: ContactInfo;
  onShowToast?: (message: string, type: 'success' | 'fail' | 'warn') => void;
}

const QuickContact: React.FC<QuickContactProps> = ({ 
  contactInfo,
  onShowToast
}) => {
  // 微信复制状态
  const [isProcessingWechat, setIsProcessingWechat] = useState(false);

  // 电话咨询
  const handleCall = () => {
    if (!contactInfo?.phone) return;
    
    Taro.makePhoneCall({
      phoneNumber: contactInfo.phone
    }).catch(err => {
      if (err.errMsg && !err.errMsg.includes('cancel')) {
        onShowToast?.('拨号失败', 'fail');
      }
    });
  };

  // 微信咨询 - 使用系统默认提示
  const handleWechat = () => {
    if (!contactInfo?.wechat || isProcessingWechat) return;
    
    setIsProcessingWechat(true);
    
    Taro.setClipboardData({
      data: contactInfo.wechat,
      success: function (res) {
        // 使用系统默认提示，不添加自定义Toast
      },
      fail: (err) => {
        if (!err.errMsg?.includes('cancel')) {
          onShowToast?.('复制失败', 'fail');
        }
      },
      complete: () => {
        setTimeout(() => {
          setIsProcessingWechat(false);
        }, 1600); // 系统提示1.5秒，稍微多等一点时间
      }
    });
  };

  return (
    <View className='quick-contact'>
      <View 
        className='contact-btn call-btn'
        onClick={handleCall}
      >
        <Text className='btn-icon'>📞</Text> 电话咨询
      </View>
      <View 
        className={`contact-btn wechat-btn ${isProcessingWechat ? 'disabled' : ''}`}
        onClick={(e) => {
          if (isProcessingWechat) return;
          e?.stopPropagation && e.stopPropagation();
          handleWechat();
        }}
      >
        <Text className='btn-icon'>💬</Text> 微信咨询
      </View>
    </View>
  );
};

export default QuickContact;