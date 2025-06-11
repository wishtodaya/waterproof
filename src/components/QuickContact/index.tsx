import { useState, useMemo } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Overlay } from '@nutui/nutui-react-taro'
import phoneIcon from 'src/assets/phone.svg'
import wechatIcon from 'src/assets/wechat.svg'
import './index.scss'

interface ContactInfo {
  phone: string[]
  phoneLabels?: string[]
  wechat: string
}

interface QuickContactProps {
  contactInfo: ContactInfo
  onShowToast?: (msg: string, type: 'success' | 'fail' | 'warn') => void
}

const QuickContact: React.FC<QuickContactProps> = ({
  contactInfo,
  onShowToast
}) => {
  const [busyCopy, setBusyCopy] = useState(false)
  const [showSheet, setShowSheet] = useState(false)

  /* 电话数组整理 */
  const phoneOptions = useMemo(
    () =>
      (contactInfo.phone ?? []).map((p, i) => ({
        phone: p,
        label: contactInfo.phoneLabels?.[i] || `电话${i + 1}`
      })),
    [contactInfo.phone, contactInfo.phoneLabels]
  )

  /* 拨号 */
  const makeCall = (phone: string) => {
    setShowSheet(false)
    Taro.makePhoneCall({ phoneNumber: phone }).catch(err => {
      if (!err.errMsg?.includes('cancel')) onShowToast?.('拨号失败', 'fail')
    })
  }

  /* 电话按钮 */
  const handleCall = () => {
    if (!phoneOptions.length) return onShowToast?.('暂无可用电话号码', 'warn')
    if (phoneOptions.length === 1) return makeCall(phoneOptions[0].phone)
    setShowSheet(true)
  }

  /* 微信复制 */
  const handleWechat = () => {
    if (!contactInfo.wechat || busyCopy) return
    setBusyCopy(true)
    Taro.setClipboardData({ data: contactInfo.wechat })
      .catch(e => {
        if (!e.errMsg?.includes('cancel')) onShowToast?.('复制失败', 'fail')
      })
      .finally(() => setTimeout(() => setBusyCopy(false), 1500))
  }

  return (
    <>
      {/* 顶部快捷按钮 */}
      <View className='quick-contact'>
        <View className='contact-btn call-btn' onClick={handleCall}>
          <Image src={phoneIcon} className='icon-img' mode='widthFix' />
          <Text className='btn-text'>电话咨询</Text>
        </View>
        <View
          className={`contact-btn wechat-btn ${busyCopy ? 'disabled' : ''}`}
          onClick={handleWechat}
        >
          <Image src={wechatIcon} className='icon-img' mode='widthFix' />
          <Text className='btn-text'>微信咨询</Text>
        </View>
      </View>

      {/* 电话选择底部弹窗 */}
      <Overlay
        visible={showSheet}
        onClick={() => setShowSheet(false)}
        closeOnOverlayClick
      >
        <View className='phone-selector-wrapper'>
          <View className='phone-selector' onClick={e => e.stopPropagation()}>
            <View className='selector-header'>
              <Text className='selector-title'>选择拨打电话</Text>
              <View
                className='selector-close'
                onClick={() => setShowSheet(false)}
              >
                <Text className='close-icon'>×</Text>
              </View>
            </View>

            <View className='phone-list'>
              {phoneOptions.map(opt => (
                <View
                  key={opt.phone}
                  className='phone-item'
                  onClick={() => makeCall(opt.phone)}
                >
                  <View className='phone-icon-wrapper'>
                    <Image src={phoneIcon} className='icon-img' mode='widthFix' />
                  </View>
                  <View className='phone-info'>
                    <Text className='phone-label'>{opt.label}</Text>
                    <Text className='phone-number'>{opt.phone}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </Overlay>
    </>
  )
}

export default QuickContact