import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

interface ContactInfo {
  phone: string[];
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
  const [isProcessingWechat, setIsProcessingWechat] = useState(false);

  // 电话咨询 - 优先拨打第一个号码
  const handleCall = () => {
    if (!contactInfo?.phone?.length) return;
    
    // 如果有多个号码，可以弹出选择框，这里简化为直接拨打第一个
    const primaryPhone = contactInfo.phone[0];
    
    Taro.makePhoneCall({
      phoneNumber: primaryPhone
    }).catch(err => {
      if (err.errMsg && !err.errMsg.includes('cancel')) {
        onShowToast?.('拨号失败', 'fail');
      }
    });
  };

  // 微信咨询
  const handleWechat = () => {
    if (!contactInfo?.wechat || isProcessingWechat) return;
    
    setIsProcessingWechat(true);
    
    Taro.setClipboardData({
      data: contactInfo.wechat,
      success: function () {
        // 使用系统默认提示
      },
      fail: (err) => {
        if (!err.errMsg?.includes('cancel')) {
          onShowToast?.('复制失败', 'fail');
        }
      },
      complete: () => {
        setTimeout(() => {
          setIsProcessingWechat(false);
        }, 1600);
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