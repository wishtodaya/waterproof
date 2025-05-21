import { useState, useCallback } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import './index.scss';

export interface TabItem {
  title: string;
  value: string;
}

interface PageHeaderProps {
  keyword: string;
  onSearch: (value: string) => void;
  searchPlaceholder?: string;
  currentType: string;
  onTypeChange: (value: string) => void;
  tabs: TabItem[];
  debounceTime?: number;
}

export default function PageHeader({
  keyword,
  onSearch,
  searchPlaceholder = '搜索',
  currentType,
  onTypeChange,
  tabs,
  debounceTime = 500
}: PageHeaderProps) {
  const [searchValue, setSearchValue] = useState(keyword);
  const [searchTimer, setSearchTimer] = useState<any>(null);

  // 处理搜索输入变化
  const handleSearch = useCallback(
    (value: string) => {
      setSearchValue(value);
      if (searchTimer) {
        clearTimeout(searchTimer);
      }
      
      const timer = setTimeout(() => {
        onSearch(value);
      }, debounceTime);
      
      setSearchTimer(timer);
    },
    [onSearch, debounceTime, searchTimer]
  );
  
  // 清空搜索
  const handleClear = () => {
    setSearchValue('');
    onSearch('');
  };
  
  // 处理标签切换
  const handleTabChange = (value: string) => {
    onTypeChange(value);
  };

  return (
    <View className="unified-header">
      {/* 搜索区域 */}
      <View className="header-search">
        <View className="custom-searchbar">
          <Text className="search-icon">🔍</Text>
          <Input
            className="search-input"
            value={searchValue}
            placeholder={searchPlaceholder}
            onInput={(e) => handleSearch(e.detail.value)}
            confirmType="search"
            onConfirm={(e) => onSearch(e.detail.value)}
          />
          {searchValue && (
            <Text className="search-clear" onClick={handleClear}>×</Text>
          )}
        </View>
      </View>
      
      {/* 标签区域 - 使用ScrollView但不尝试手动控制滚动 */}
      <View className="header-tabs-container">
        <ScrollView 
          scrollX 
          scrollWithAnimation
          className="tabs-container"
          showScrollbar={false}
        >
          <View className="tabs-list">
            {tabs.map((tab) => (
              <View
                key={tab.value}
                className={`tab-item ${currentType === tab.value ? 'active' : ''}`}
                onClick={() => handleTabChange(tab.value)}
              >
                <Text>{tab.title}</Text>
                <View className="tab-line" />
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}