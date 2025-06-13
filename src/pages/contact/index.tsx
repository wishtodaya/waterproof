import { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Loading, Toast } from '@nutui/nutui-react-taro'
import BookingForm from '../../components/BookingForm'
import ContactInfoCard from '../../components/ContactInfoCard'
import './index.scss'

import { 
  ServiceType, 
  ContactData, 
  BookingFormData 
} from 'src/services/api/contact/types'
import { 
  getServiceTypes, 
  getContactData, 
  submitBooking
} from 'src/services/api/contact/contactApi'

const handleContactError = (err: any): string => {
  console.error(err);
  return err instanceof Error ? err.message : '发生未知错误';
};

export default function ContactPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastInfo, setToastInfo] = useState({ content: '', icon: 'success' });
  
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [contactData, setContactData] = useState<ContactData | null>(null);
  
  const [formData, setFormData] = useState<Partial<BookingFormData>>({
    name: '',
    phone: '',
    serviceType: '',
    serviceTypeName: '',
    region: [],
    address: '',
    remark: ''
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [serviceTypesRes, contactDataRes] = await Promise.all([
          getServiceTypes(),
          getContactData()
        ]);
        
        if (serviceTypesRes.success && serviceTypesRes.data) {
          setServiceTypes(serviceTypesRes.data);
        } else {
          showMessage(serviceTypesRes.error || '获取服务类型失败', 'fail');
        }
        
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
  
  const showMessage = (content: string, icon: 'success' | 'fail' | 'loading' = 'success') => {
    setToastInfo({ content, icon });
    setShowToast(true);
  };
  
  const handleFormSubmit = async (data: BookingFormData) => {
    setSubmitting(true);
    
    try {
      const res = await submitBooking(data);
      
      if (res.success) {
        Taro.vibrateShort({ type: 'medium' });
        showMessage('预约成功，我们将尽快与您联系！');
        
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
  
  const handleServiceTypeSelect = (typeValue: string) => {
    const selectedType = serviceTypes.find(type => type.value === typeValue);
    setFormData(prev => ({
      ...prev,
      serviceType: typeValue,
      serviceTypeName: selectedType?.text || ''
    }));
  };
  
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
        
        <View className="contact-card about-card">
          <View className="card-header">
            <Text className="card-title">联系我们</Text>
            <Text className="card-subtitle">{contactData.address}</Text>
          </View>
          <View className="card-content">
            <ContactInfoCard 
              data={contactData}
            />
          </View>
        </View>
      </View>
      
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