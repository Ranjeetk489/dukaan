"use client"
import { ResponseObject } from '@/types/client/types';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

type ApiResponse<T> = {
    data: T | null;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    revalidate: () => void;
};

type ApiArgs<T> = {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any;
    headers?: any;
    params?: any;
    timeout?: number;
    responseType?: 'json' | 'text';
    cache?: 'default' | 'no-store' | 'reload' | 'no-cache' | 'force-cache';
    mapFn?: (data: T) => ResponseObject<T>;
    fetchOnInit?: boolean;
};

function useApi<T>({url, method = 'GET', body, headers, params, timeout, responseType, cache, mapFn, fetchOnInit=true}: ApiArgs<T>): ApiResponse<T> {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const controller = new AbortController();
            const signal = controller.signal;
            
            // cleanup function
            const cleanup = () => controller.abort();
            // call cleanup on component unmount
            useEffect(() => cleanup, []);

    const fetchData = async () => {
        setIsLoading(true);
        setIsError(false);
        try {
            const response = await fetch(url, {
                method,
                body,
                headers,
                signal,
            })
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            let result: ResponseObject<T> = await response.json();
            if (mapFn && result.response.data) {
                    result = mapFn(result.response.data);
            }
            toast.success(result.response.message);
            setData(data);
            setData(result.response.data);
            setError(error as Error);
            setIsError(true);
            toast.error((error as Error).message);
        } catch {
            toast.error((error as Error).message);
            setError(error as Error);
        } finally {
            setIsLoading(false)
        }
    };

    useEffect(() => {
        if (fetchOnInit) {
            fetchData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url]);

    const revalidate = () => {
        fetchData();
    };

    return { data, isLoading, isError, error, revalidate };
}

export default useApi;

