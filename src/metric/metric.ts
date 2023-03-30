import { AxiosInstance, CreateAxiosDefaults } from 'axios';
import { time, timeAsync } from './execution-timing';
import { monitor, monitorAsync } from './service-availabiity';
import { count, countAsync } from './counters';
import { configureAxiosInstance } from '../utils-isomorphic';

export interface IMetric {
  axiosInstance: AxiosInstance;
  serviceName: string;
  functionName: string;
}

export interface IMetricSync<T> extends IMetric {
  count(fn: (...args: any[]) => T, s?: Record<string, string>): T;
  time(fn: (...args: any[]) => T): T;
  monitor(fn: (...args: any[]) => T): T;
}

export interface IMetricAsync<T> extends IMetric {
  count(fn: (...args: any[]) => Promise<T>, s?: Record<string, string>): Promise<T>;
  time(fn: (...args: any[]) => Promise<T>): Promise<T>;
  monitor(fn: (...args: any[]) => Promise<T>): Promise<T>;
}

export type MetricConfig = {
  endpoint: string;
  serviceName: string;
  functionName: string;
  axiosOverrides?: CreateAxiosDefaults;
};

class BaseMetricImpl implements IMetric {
  axiosInstance: AxiosInstance;
  serviceName: string;
  functionName: string;
  constructor(metricConfig: MetricConfig) {
    const {
      endpoint,
      serviceName,
      functionName,
      axiosOverrides = {},
    } = metricConfig;
    this.axiosInstance = configureAxiosInstance({
      ...axiosOverrides,
      baseURL: endpoint,
      headers: {
        ...(axiosOverrides
          ? axiosOverrides.headers
            ? axiosOverrides.headers
            : {}
          : {}),
        'Content-Type': 'application/json',
        Accept: 'applioation/json',
        Authorization: process.env.BEARER_AUTH_HEADER,
        'User-Agent': 'porygon-metlib-node-agent',
      },
    });
    this.serviceName = serviceName;
    this.functionName = functionName;
  }
}

export class MetricSync<T> extends BaseMetricImpl implements IMetricSync<T> {
  constructor(metricConfig: MetricConfig) {
    super(metricConfig);
  }

  count(fn: (...args: any[]) => T, s?: Record<string, string>): T {
    return count<T>(
      this.axiosInstance,
      this.serviceName,
      this.functionName,
      fn,
      s
    ) as T;
  }

  time(fn: (...args: any[]) => T): T {
    return time<T>(
      this.axiosInstance,
      this.serviceName,
      this.functionName,
      fn
    ) as T;
  }

  monitor(fn: (...args: any[]) => T): T {
    return monitor<T>(
      this.axiosInstance,
      this.serviceName,
      this.functionName,
      fn
    ) as T;
  }
}

export class MetricAsync<T> extends BaseMetricImpl implements IMetricAsync<T> {
  constructor(metricConfig: MetricConfig) {
    super(metricConfig);
  }

  async count(fn: (...args: any[]) => Promise<T>, s?: Record<string, string> | undefined): Promise<T> {
    return await countAsync<T>(
      this.axiosInstance,
      this.serviceName,
      this.functionName,
      fn,
      s
    ) as T;
  }

  async time(fn: (...args: any[]) => Promise<T>): Promise<T> {
    return await timeAsync<T>(
      this.axiosInstance,
      this.serviceName,
      this.functionName,
      fn
    ) as T;
  }

  async monitor(fn: (...args: any[]) => Promise<T>): Promise<T> {
    return await monitorAsync<T>(
      this.axiosInstance,
      this.serviceName,
      this.functionName,
      fn
    ) as T;
  }
}
