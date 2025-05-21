// pages/contact/index.tsx
import { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Loading, Toast } from '@nutui/nutui-react-taro'
import BookingForm from '../../components/BookingForm'
import ContactInfoCard from '../../components/ContactInfoCard'
import './index.scss'

// 直接导入所需类型和函数
import { 
  ServiceType, 
  ContactData, 
  BookingFormData 
} from 'src/services/api/contact/types'
import { 
  getServiceTypes, 
  getContactData, 
  submitBooking, 
  handleContactError 
} from 'src/services/api/contact/contactApi'

export default function ContactPage() {
  // 页面状态
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastInfo, setToastInfo] = useState({ content: '', icon: 'success' });
  
  // 数据状态
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [contactData, setContactData] = useState<ContactData | null>(null);
  
  // 表单数据
  const [formData, setFormData] = useState<Partial<BookingFormData>>({
    name: '',
    phone: '',
    serviceType: '',
    serviceTypeName: '',
    region: [],
    address: '',
    remark: ''
  });
  
  // 加载数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 并行加载所有数据
        const [serviceTypesRes, contactDataRes] = await Promise.all([
          getServiceTypes(),
          getContactData()
        ]);
        
        // 处理服务类型数据
        if (serviceTypesRes.success && serviceTypesRes.data) {
          setServiceTypes(serviceTypesRes.data);
        } else {
          showMessage(serviceTypesRes.error || '获取服务类型失败', 'fail');
        }
        
        // 处理联系信息数据
        if (contactDataRes.success && contactDataRes.data) {
          setContactData(contactDataRes.data);
        } else {
          showMessage(contactDataRes.error || '获取联系信息失败', 'fail');
        }
      } catch (error) {
        console.error('加载数据失败:', error);
        showMessage('加载数据失败，请稍后重试', 'fail');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // 显示提示消息
  const showMessage = (content: string, icon: 'success' | 'fail' | 'loading' = 'success') => {
    setToastInfo({ content, icon });
    setShowToast(true);
  };
  
  // 处理表单提交
  const handleFormSubmit = async (data: BookingFormData) => {
    setSubmitting(true);
    
    try {
      const res = await submitBooking(data);
      
      if (res.success) {
        Taro.vibrateShort({ type: 'medium' });
        showMessage('预约成功，我们将尽快与您联系！');
        
        // 重置表单
        setFormData({
          name: '',
          phone: '',
          serviceType: '',
          serviceTypeName: '',
          region: [],
          address: '',
          remark: ''
        });
      } else {
        showMessage(res.error || '提交失败，请重试', 'fail');
      }
    } catch (error) {
      showMessage(handleContactError(error), 'fail');
    } finally {
      setSubmitting(false);
    }
  };
  
  // 处理服务类型选择
  const handleServiceTypeSelect = (typeValue: string) => {
    const selectedType = serviceTypes.find(type => type.value === typeValue);
    setFormData(prev => ({
      ...prev,
      serviceType: typeValue,
      serviceTypeName: selectedType?.text || ''
    }));
  };
  
  // 拨打电话
  const handlePhoneCall = () => {
    if (!contactData) return;
    
    Taro.makePhoneCall({
      phoneNumber: contactData.phone,
      fail: (err) => {
        // 只有当不是用户取消时才显示错误提示
        if (err.errMsg && !err.errMsg.includes('cancel')) {
          showMessage('拨打电话失败，请重试', 'fail');
        }
      }
    });
  };
  
  // 复制微信号
  const handleCopyWechat = () => {
    if (!contactData) return;
    
    Taro.setClipboardData({
      data: contactData.wechat,
      success: () => {
      },
      fail: () => {
        showMessage('复制失败，请重试', 'fail');
      }
    });
  };
  
  // 加载状态
  if (loading || !contactData) {
    return (
      <View className="loading-container">
        <Loading type="spinner" color="#2563EB" />
        <Text className="loading-text">加载中...</Text>
      </View>
    );
  }
  
  return (
    <View className="contact-page">
      <View className="contact-container">
        {/* 预约表单卡片 */}
        <View className="contact-card booking-card">
          <View className="card-header">
            <Text className="card-title">预约服务</Text>
            <Text className="card-subtitle">填写信息免费上门勘测</Text>
          </View>
          <View className="card-content">
            <BookingForm 
              serviceTypes={serviceTypes}
              loading={submitting}
              initialValues={formData}
              onSubmit={handleFormSubmit}
              onServiceTypeSelect={handleServiceTypeSelect}
            />
          </View>
        </View>
        
        {/* 关于我们卡片 */}
        <View className="contact-card about-card">
          <View className="card-header">
            <Text className="card-title">关于我们</Text>
            <Text className="card-subtitle">专业防水服务十年</Text>
          </View>
          <View className="card-content">
            <ContactInfoCard 
              data={contactData}
              onPhoneCall={handlePhoneCall}
              onCopyWechat={handleCopyWechat}
            />
          </View>
        </View>
      </View>
      
      {/* 提示信息 */}
      <Toast
        visible={showToast}
        content={toastInfo.content}
        icon={toastInfo.icon as any}
        onClose={() => setShowToast(false)}
        duration={2000}
      />
    </View>
  );
}