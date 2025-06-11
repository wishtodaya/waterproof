import { useState, useCallback, useRef, useEffect } from 'react';
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
  const searchTimerRef = useRef<any>(null);

  // 同步外部keyword变化
  useEffect(() => {
    setSearchValue(keyword);
  }, [keyword]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, []);

  // 处理搜索输入变化
  const handleSearch = useCallback(
    (value: string) => {
      setSearchValue(value);
      
      // 清除之前的定时器
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
      
      // 设置新的定时器
      searchTimerRef.current = setTimeout(() => {
        onSearch(value);
      }, debounceTime);
    },
    [onSearch, debounceTime]
  );
  
  // 清空搜索
  const handleClear = useCallback(() => {
    setSearchValue('');
    onSearch('');
    
    // 清除定时器
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }
  }, [onSearch]);
  
  // 处理标签切换
  const handleTabChange = useCallback((value: string) => {
    if (value !== currentType) {
      onTypeChange(value);
    }
  }, [currentType, onTypeChange]);

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
            placeholderClass="search-placeholder"
          />
          {searchValue && (
            <Text className="search-clear" onClick={handleClear}>×</Text>
          )}
        </View>
      </View>
      
      {/* 标签区域 */}
      <View className="header-tabs-container">
        <ScrollView 
          scrollX 
          scrollWithAnimation
          className="tabs-container"
          showScrollbar={false}
          enhanced
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