import Taro from '@tarojs/taro';
import type { CacheData } from './types';

// 缓存键前缀
const CACHE_PREFIX = 'http_cache_';

/**
 * 生成缓存键
 */
export function generateCacheKey(url: string, data?: any): string {
  return `${CACHE_PREFIX}${url}_${JSON.stringify(data || {})}`;
}

/**
 * 获取缓存数据
 */
export function getCacheData<T>(key: string): CacheData<T> | null {
  try {
    const cacheData = Taro.getStorageSync(key);
    return cacheData ? JSON.parse(cacheData) : null;
  } catch (error) {
    console.error('获取缓存数据失败', error);
    return null;
  }
}

/**
 * 设置缓存数据
 */
export function setCacheData<T>(key: string, data: T): void {
    try {
      const cacheData: CacheData<T> = {
        data,
        timestamp: Date.now()
      };
      
      Taro.setStorageSync(key, JSON.stringify(cacheData));
    } catch (error) {
      console.error('设置缓存数据失败', error);
    }
  }

/**
 * 清除缓存数据
 */
export function clearCacheData(key: string): void {
  try {
    Taro.removeStorageSync(key);
  } catch (error) {
    console.error('清除缓存数据失败', error);
  }
}

/**
 * 清除所有HTTP缓存
 */
export function clearAllCache(): void {
  try {
    const storageInfo = Taro.getStorageInfoSync();
    const keys = storageInfo.keys || [];
    
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        Taro.removeStorageSync(key);
      }
    });
  } catch (error) {
    console.error('清除所有缓存失败', error);
  }
}

/**
 * 检查缓存是否有效
 */
export function isCacheValid<T>(cache: CacheData<T>, cacheTime: number): boolean {
  if (!cache || !cache.timestamp) return false;
  
  return Date.now() - cache.timestamp < cacheTime;
}