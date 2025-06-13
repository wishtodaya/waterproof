import { useState, useEffect, useCallback, useRef } from 'react';
import http from './index';
import type { RequestConfig } from './index';

// useRequest Hook
export function useRequest<T = any>(
  requestFn: () => Promise<T>,
  options?: {
    immediate?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
  }
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const { immediate = true, onSuccess, onError } = options || {};

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await requestFn();
      setData(result);
      onSuccess?.(result);
      return result;
    } catch (err: any) {
      const error = err instanceof Error ? err : new Error(err.message || '请求失败');
      setError(error);
      onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [requestFn, onSuccess, onError]);

  useEffect(() => {
    if (immediate) {
      run();
    }
  }, []);

  return {
    data,
    loading,
    error,
    run,
    refresh: run,
  };
}

// usePagination Hook
export function usePagination<T = any>(
  requestFn: (params: { pageNo: number; pageSize: number }) => Promise<{
    records: T[];
    total: number;
    size: number;
    current: number;
  }>,
  options?: {
    defaultPageSize?: number;
    onSuccess?: (data: T[]) => void;
  }
) {
  const [list, setList] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize] = useState(options?.defaultPageSize || 10);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadMore = useCallback(async (isRefresh = false) => {
    if (loading || (!hasMore && !isRefresh)) return;

    const currentPage = isRefresh ? 1 : pageNo;
    
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const result = await requestFn({
        pageNo: currentPage,
        pageSize,
      });

      const newList = isRefresh ? result.records : [...list, ...result.records];
      
      setList(newList);
      setTotal(result.total);
      setPageNo(currentPage + 1);
      setHasMore(newList.length < result.total);
      
      options?.onSuccess?.(result.records);
    } catch (error) {
      console.error('加载失败:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [pageNo, pageSize, list, loading, hasMore, requestFn, options]);

  const refresh = useCallback(() => {
    setPageNo(1);
    setHasMore(true);
    return loadMore(true);
  }, [loadMore]);

  useEffect(() => {
    loadMore();
  }, []);

  return {
    list,
    total,
    loading,
    refreshing,
    hasMore,
    loadMore,
    refresh,
  };
}