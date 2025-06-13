import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Loading } from '@nutui/nutui-react-taro'
import { useRequest } from 'src/utils/http/hooks'
import { api } from 'src/api'
import BookingForm from 'src/components/BookingForm'
import ContactInfoCard from 'src/components/ContactInfoCard'
import { BookingFormData } from 'src/api/contact/types'
import './index.scss'

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState<Partial<BookingFormData>>({
    name: '',
    phone: '',
    serviceType: '',
    serviceTypeName: '',
    region: [],
    address: '',
    remark: ''
  })

  // 获取服务类型
  const { data: serviceTypes } = useRequest(api.contact.getServiceTypes)

  // 获取联系信息
  const { data: contactData, loading } = useRequest(api.contact.getContactInfo)

  // 提交表单
  const handleFormSubmit = async (data: BookingFormData) => {
    setSubmitting(true)

    try {
      await api.contact.submitBooking(data)

      // 成功反馈
      Taro.vibrateShort({ type: 'medium' })
      Taro.showToast({
        title: '预约成功，我们将尽快与您联系！',
        icon: 'success',
        duration: 2000
      })

      // 重置表单
      setFormData({
        name: '',
        phone: '',
        serviceType: '',
        serviceTypeName: '',
        region: [],
        address: '',
        remark: ''
      })
    } catch (error) {
      // HTTP层已经处理了错误提示
    } finally {
      setSubmitting(false)
    }
  }

  // 选择服务类型
  const handleServiceTypeSelect = (typeValue: string) => {
    const selectedType = (serviceTypes || []).find(type => type.value === typeValue)
    setFormData(prev => ({
      ...prev,
      serviceType: typeValue,
      serviceTypeName: selectedType?.text || ''
    }))
  }

  if (loading || !contactData) {
    return (
      <View className="loading-container">
        <Loading type="spinner" color="#2563EB" />
        <Text className="loading-text">加载中...</Text>
      </View>
    )
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
              // FIX: Ensure serviceTypes is always an array
              serviceTypes={serviceTypes || []}
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
            <ContactInfoCard data={contactData} />
          </View>
        </View>
      </View>
    </View>
  )
}