import { useCallback, useRef } from 'react';

interface RetryConfig {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffMultiplier?: number;
}

/**
 * Hook for implementing exponential backoff retry logic
 * Prevents error spam and allows graceful recovery
 */
export function useRetry(config: RetryConfig = {}) {
  const {
    maxRetries = 3,
    initialDelayMs = 1000,
    maxDelayMs = 10000,
    backoffMultiplier = 2,
  } = config;

  const attemptsRef = useRef(0);

  const calculateDelay = (attemptNumber: number): number => {
    const exponentialDelay = initialDelayMs * Math.pow(backoffMultiplier, attemptNumber);
    return Math.min(exponentialDelay, maxDelayMs);
  };

  const retry = useCallback(
    async <T,>(
      fn: () => Promise<T>,
      onRetry?: (attempt: number, delay: number) => void
    ): Promise<T> => {
      let lastError: Error | null = null;

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          return await fn();
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error));
          
          if (attempt < maxRetries) {
            const delay = calculateDelay(attempt);
            onRetry?.(attempt + 1, delay);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }

      throw lastError || new Error('Max retries exceeded');
    },
    [maxRetries, initialDelayMs, maxDelayMs, backoffMultiplier]
  );

  return { retry, calculateDelay };
}

/**
 * Utility function to get user-friendly error messages
 */
export function getErrorMessage(error: any): string {
  if (error?.response?.status === 404) {
    return 'Resource not found. Please check your connection and try again.';
  }
  if (error?.response?.status === 401) {
    return 'Session expired. Please login again.';
  }
  if (error?.response?.status === 403) {
    return 'You do not have permission to access this resource.';
  }
  if (error?.response?.status === 500) {
    return 'Server error. Please try again later.';
  }
  if (error?.response?.status >= 400 && error?.response?.status < 500) {
    return error?.response?.data?.message || 'Request failed. Please try again.';
  }
  if (error?.message === 'Network Error') {
    return 'Network connection failed. Please check your internet.';
  }
  
  return error?.message || 'An unexpected error occurred. Please try again.';
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: any): boolean {
  const status = error?.response?.status;
  
  // Don't retry 4xx errors (except 408 timeout and 429 rate limit)
  if (status && status >= 400 && status < 500) {
    return status === 408 || status === 429;
  }
  
  // Retry 5xx errors and network errors
  return status >= 500 || error?.message === 'Network Error';
}
