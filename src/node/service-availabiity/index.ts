import { AxiosInstance } from 'axios';
import { emit, EmitOptions } from '../../utils-isomorphic';

/**
 * @function monitor
 * @param endpoint
 * @param axiosInstance
 * @param fn
 * @returns
 *
 * @summary
 *
 * this function accepts a synchronous function as an argument, a fn that is the targeted invocation function.
 * This function attempts to call the arg fn() and returns the result if the op succeeds,
 * if the op fails, it rethrows the operation error to the execution environment
 * Ideally this metric function would be used on code that has a probabilty of failing or throwing an exception.
 * This function then emits a metric (AvailabilityMetric) to DittoMetricServer to the '/availability' route
 */
export function monitor<T>(
  axiosInstance: AxiosInstance,
  serviceName: string,
  fnName: string,
  fn: (...args: any[]) => T
): T | void {
  let error: Error | undefined;
  let result: T | undefined;

  try {
    result = fn();
  } catch (e: any) {
    error = e as Error;
  } finally {
    const emitOptions: EmitOptions = {
      axiosInstance,
      url: '/availability',
      data: {
        m_type: 'availabilty',
        value: {
          availability: error ? 0 : 1,
          fn_name: fnName,
          timestamp: Date.now().toString(),
          service_name: serviceName,
        },
      },
    };

    emit(emitOptions)
      .then((r) => {
        if (r) {
          console.log('emit succcessful');
        } else {
          console.error('emit unsuccessful');
        }
      })
      .catch((e) => {
        if (process.env.NODE_ENV === 'development') {
          console.warn(JSON.stringify(e));
        }
      });

    if (error) throw error; // if the forwarded fn throws an error, we want to rethrow it back to the execution environment

    return result;
  }
}

/**
 * @function monitorAsync
 * @param endpoint
 * @param axiosInstance
 * @param fn
 * @returns
 *
 * @summary
 *
 * this function accepts an asynchronous function as an argument, a fn that is the targeted invocation function.
 * This function attempts to call the arg fn() and returns the result if the op succeeds,
 * if the op fails, it rethrows the operation error to the execution environment
 * Ideally this metric function would be used on code that has a probabilty of failing or throwing an exception.
 * This function then emits a metric (AvailabilityMetric) to DittoMetricServer to the '/availability' route
 */
export async function monitorAsync<T>(
  axiosInstance: AxiosInstance,
  serviceName: string,
  fnName: string,
  fn: (...args: any[]) => Promise<T>
): Promise<T | void> {
  let error: Error | undefined;
  let result: T | undefined;
  try {
    result = await fn();
  } catch (e: any) {
    error = e as Error;
  } finally {
    const emitOptions: EmitOptions = {
      axiosInstance,
      url: '/availability',
      data: {
        m_type: 'availabilty',
        value: {
          availability: error ? 0 : 1,
          fn_name: fnName,
          timestamp: Date.now().toString(),
          service_name: serviceName,
        },
      },
    };

    emit(emitOptions)
      .then((r) => {
        if (r) {
          console.log('emit succcessful');
        } else {
          console.error('emit unsuccessful');
        }
      })
      .catch((e) => console.warn(JSON.stringify(e)));

    if (error) throw error; // if the forwarded fn throws an error, we want to rethrow it back to the execution environment

    return result;
  }
}
