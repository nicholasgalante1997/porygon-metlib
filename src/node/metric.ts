import { time, timeAsync } from './execution-timing';
import { monitor, monitorAsync } from './service-availabiity';
import { configureAxiosInstance } from '../utils-isomorphic';
import { AxiosInstance, CreateAxiosDefaults } from 'axios';

export interface IMetric {
  axiosInstance: AxiosInstance;
  serviceName: string;
  functionName: string;
}

export interface IMetricSync<T> extends IMetric {
  time(fn: (...args: any[]) => T | void): T | void;
  monitor(fn: (...args: any[]) => T | void): T | void;
}

export interface IMetricAsync<T> extends IMetric {
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
    const { endpoint, serviceName, functionName, axiosOverrides = {} } = metricConfig;
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

  time(fn: (...args: any[]) => T): T {
    const result = time<T>(this.axiosInstance, this.serviceName, this.functionName, fn);
    return result;
  }

  monitor(fn: (...args: any[]) => T): T | void {
    const result = monitor(this.axiosInstance, this.serviceName, this.functionName, fn);
    return result;
  }
}

export class MetricASync<T> extends BaseMetricImpl implements IMetricAsync<T> {

  constructor(metricConfig: MetricConfig) {
    super(metricConfig);
  }

  async timeAsync(fn: (...args: any[]) => Promise<T>): Promise<T> {
    const result = await timeAsync<T>(this.axiosInstance, this.serviceName, this.functionName, fn);
    return result;
  }

  async monitorAsync(fn: (...args: any[]) => Promise<T>): Promise<T | void> {
    const result = await monitorAsync(this.axiosInstance, this.serviceName, this.functionName, fn);
    return result;
  }
}