import { AxiosInstance } from 'axios';
import { emit, EmitOptions } from '../../utils-isomorphic/emit';

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await

export function time<T>(
  axiosInstance: AxiosInstance,
  serviceName: string,
  fnName: string,
  fn: (...args: any[]) => T
): T {
  let executionStartTime: number;
  let executionStopTime: number;
  let returnValue: T;
  let error: Error | undefined;

  try {
    executionStartTime = performance.now();
    returnValue = fn();
    executionStopTime = performance.now();

    const totalFnDurationInMs = executionStopTime - executionStartTime;

    const emitOptions: EmitOptions = {
      axiosInstance,
      url: '/timing',
      data: {
        m_type: 'timing',
        value: {
          duration: totalFnDurationInMs,
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
          console.error(JSON.stringify(e));
        }
      });

    return returnValue;
  } catch (e: any) {
    error = e as Error;
    throw error;
  }
}

export async function timeAsync<T>(
  axiosInstance: AxiosInstance,
  serviceName: string,
  fnName: string,
  fn: (...args: any[]) => Promise<T>
): Promise<T> {
  let executionStartTime: number;
  let executionStopTime: number;
  let returnValue: T | undefined;
  let error: Error | undefined;

  try {
    executionStartTime = performance.now();
    returnValue = await fn();
    executionStopTime = performance.now();

    const totalFnDurationInMs = executionStopTime - executionStartTime;

    const emitOptions: EmitOptions = {
      axiosInstance,
      url: '/timing',
      data: {
        m_type: 'timing',
        value: {
          duration: totalFnDurationInMs,
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
          console.error(JSON.stringify(e));
        }
      });

    return returnValue;
  } catch (e: any) {
    error = e as Error;
    throw error;
  }
}
