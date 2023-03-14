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
  count(fn: (...args: any[]) => T | void, s?: Record<string, string>): T | void;
  time(fn: (...args: any[]) => T | void): T | void;
  monitor(fn: (...args: any[]) => T | void): T | void;
}

export interface IMetricAsync<T> extends IMetric {
  countAsync(fn: (...args: any[]) => Promise<T | void>, s?: Record<string, string>): Promise<T | void>;
  timeAsync(fn: (...args: any[]) => Promise<T | void>): Promise<T | void>;
  monitorAsync(fn: (...args: any[]) => Promise<T | void>): Promise<T | void>;
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

  count(fn: (...args: any[]) => T, s?: Record<string, string>): T | void {
    const result = count<T>(
      this.axiosInstance,
      this.serviceName,
      this.functionName,
      fn,
      s
    )
    return result;
  }

  time(fn: (...args: any[]) => T): T | void {
    const result = time<T>(
      this.axiosInstance,
      this.serviceName,
      this.functionName,
      fn
    );
    return result;
  }

  monitor(fn: (...args: any[]) => T): T | void {
    const result = monitor(
      this.axiosInstance,
      this.serviceName,
      this.functionName,
      fn
    );
    return result;
  }
}

export class MetricASync<T> extends BaseMetricImpl implements IMetricAsync<T> {
  constructor(metricConfig: MetricConfig) {
    super(metricConfig);
  }

  async countAsync(fn: (...args: any[]) => Promise<T>, s?: Record<string, string> | undefined): Promise<void | T> {
    const result = await countAsync<T>(
      this.axiosInstance,
      this.serviceName,
      this.functionName,
      fn,
      s
    );
    return result;
  }

  async timeAsync(fn: (...args: any[]) => Promise<T>): Promise<T | void> {
    const result = await timeAsync<T>(
      this.axiosInstance,
      this.serviceName,
      this.functionName,
      fn
    );
    return result;
  }

  async monitorAsync(fn: (...args: any[]) => Promise<T>): Promise<T | void> {
    const result = await monitorAsync(
      this.axiosInstance,
      this.serviceName,
      this.functionName,
      fn
    );
    return result;
  }
}
