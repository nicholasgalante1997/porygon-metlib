import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { TimingValue, AvailabilityValue, CountValue } from '../types';

export type EmitOptions = {
  url: string;
  axiosInstance: AxiosInstance;
  data?: {
    m_type: 'timing' | 'availabilty' | 'count';
    value: TimingValue | AvailabilityValue | CountValue;
  };
  extendAxiosConfig?: AxiosRequestConfig;
};

export async function emit({
  axiosInstance,
  url,
  data,
  extendAxiosConfig = {},
}: EmitOptions) {
  const { status } = await axiosInstance.post(url, data, {
    ...extendAxiosConfig,
  });

  if (status < 200 || status > 299) {
    return false;
  }

  return true;
}
