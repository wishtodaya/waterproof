import { useState} from 'react'
import { View, Text, Picker as TaroPicker, Input, Textarea, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Toast, Picker } from '@nutui/nutui-react-taro'
import './index.scss'

export interface BookingFormData {
  name: string;
  phone: string;
  serviceType: string;
  serviceTypeName: string;
  region: string[];
  regionCode: string[];  // 新增：存储区域代码
  address: string;
  remark: string;
}

interface BookingFormProps {
  serviceTypes: { text: string; value: string }[];
  loading: boolean;
  initialValues?: Partial<BookingFormData>;
  onSubmit: (data: BookingFormData) => void;
  onServiceTypeSelect: (type: string) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ 
  serviceTypes, 
  loading,
  initialValues = {},
  onSubmit, 
  onServiceTypeSelect
}) => {
  // 表单状态
  const [formData, setFormData] = useState<Partial<BookingFormData>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showToast, setShowToast] = useState(false);
  const [toastInfo, setToastInfo] = useState({ content: '', icon: 'success' });
  
  // Picker状态
  const [showServicePicker, setShowServicePicker] = useState(false);
  
  // 直接使用serviceTypes，不做映射转换
  const pickerServiceOptions = [serviceTypes];
  
  // 显示提示消息
  const showMessage = (content, icon = 'success') => {
    setToastInfo({ content, icon });
    setShowToast(true);
  };
  
  // 更新表单字段
  const updateField = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 清除错误
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  
  // 处理服务类型确认
  const handleServiceConfirm = (selectedOptions) => {
    if (selectedOptions && selectedOptions[0]) {
      updateField('serviceType', selectedOptions[0].value);
      updateField('serviceTypeName', selectedOptions[0].text);
      onServiceTypeSelect(selectedOptions[0].value);
      
      // 添加震动反馈
      Taro.vibrateShort();
    }
  };
  
  // 处理地区选择 - 同时保存文本和代码
  const handleRegionChange = (e) => {
    // e.detail.value 是省市区名称数组
    // e.detail.code 是省市区代码数组
    updateField('region', e.detail.value);
    updateField('regionCode', e.detail.code);
  };
  
  // 表单验证
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // 验证姓名
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = '请输入联系人姓名(至少2个字符)';
    }
    
    // 验证手机号
    if (!formData.phone || !/^1[3-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = '请输入正确的手机号';
    }
    
    // 验证服务类型
    if (!formData.serviceType) {
      newErrors.serviceType = '请选择服务类型';
    }
    
    // 验证所在地区
    if (!formData.region || !formData.region.length) {
      newErrors.region = '请选择所在地区';
    }
    
    // 验证详细地址
    if (!formData.address || formData.address.trim().length < 5) {
      newErrors.address = '请输入详细地址(至少5个字符)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // 提交表单
  const handleSubmit = () => {
    if (validateForm()) {
      // 添加震动反馈
      Taro.vibrateShort();
      onSubmit(formData as BookingFormData);
    } else {
      // 提交失败震动
      Taro.vibrateShort();
      showMessage('请完善必填信息', 'fail');
    }
  };
  
  // 根据表单值获取显示文本
  const getServiceTypeText = () => {
    if (formData.serviceType) {
      const selectedType = serviceTypes.find(item => item.value === formData.serviceType);
      return selectedType?.text || '请选择服务类型';
    }
    return '请选择服务类型';
  };
  
  const getRegionText = () => {
    if (formData.region && formData.region.length > 0) {
      return formData.region.join(' ');
    }
    return '请选择所在地区';
  };
  
  return (
    <View className="booking-form">
      {/* 联系人姓名 */}
      <View className="form-item">
        <Text className="form-item-label required">联系人姓名</Text>
        <Input 
          className="form-input"
          placeholder="请输入姓名"
          value={formData.name}
          onInput={e => updateField('name', e.detail.value)}
        />
        {errors.name && <Text className="form-error-tip">{errors.name}</Text>}
      </View>
      
      {/* 联系电话 */}
      <View className="form-item">
        <Text className="form-item-label required">联系电话</Text>
        <Input
          className="form-input"
          placeholder="请输入手机号码"
          type="number"
          value={formData.phone}
          onInput={e => updateField('phone', e.detail.value)}
        />
        {errors.phone && <Text className="form-error-tip">{errors.phone}</Text>}
      </View>
      
      {/* 服务类型 */}
      <View className="form-item">
        <Text className="form-item-label required">服务类型</Text>
        <View 
          className="form-select"
          onClick={() => setShowServicePicker(true)}
        >
          <Text className={formData.serviceType ? 'select-value' : 'select-placeholder'}>
            {getServiceTypeText()}
          </Text>
          <View className="select-arrow" />
        </View>
        {errors.serviceType && <Text className="form-error-tip">{errors.serviceType}</Text>}
      </View>
      
      {/* 所在地区 */}
      <View className="form-item">
        <Text className="form-item-label required">所在地区</Text>
        <TaroPicker
          mode="region"
          onChange={handleRegionChange}
          value={formData.regionCode || []}
        >
          <View className="form-select">
            <Text className={formData.region?.length ? 'select-value' : 'select-placeholder'}>
              {getRegionText()}
            </Text>
            <View className="select-arrow" />
          </View>
        </TaroPicker>
        {errors.region && <Text className="form-error-tip">{errors.region}</Text>}
      </View>
      
      {/* 详细地址 */}
      <View className="form-item">
        <Text className="form-item-label required">详细地址</Text>
        <Input
          className="form-input"
          placeholder="请输入详细地址"
          value={formData.address}
          onInput={e => updateField('address', e.detail.value)}
        />
        {errors.address && <Text className="form-error-tip">{errors.address}</Text>}
      </View>
      
      {/* 补充说明 */}
      <View className="form-item">
        <Text className="form-item-label">补充说明</Text>
        <Textarea
          className="form-textarea"
          placeholder="请输入您的具体需求或其他说明（选填）"
          maxlength={200}
          value={formData.remark}
          onInput={e => updateField('remark', e.detail.value)}
        />
      </View>
      
      {/* 提交按钮 */}
      <View className="submit-container">
        <Button
          className={`submit-button ${loading ? 'loading' : ''}`}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? '提交中...' : '立即预约'}
        </Button>
      </View>
      
      {/* NutUI Picker 服务类型选择器 */}
      <Picker
        title="选择服务类型"
        visible={showServicePicker}
        options={pickerServiceOptions}
        defaultValue={formData.serviceType ? [formData.serviceType] : []}
        onClose={() => setShowServicePicker(false)}
        onConfirm={handleServiceConfirm}
      />
      
      {/* 提示信息 */}
      <Toast
        visible={showToast}
        content={toastInfo.content}
        icon={toastInfo.icon}
        onClose={() => setShowToast(false)}
      />
    </View>
  );
};

export default BookingForm;