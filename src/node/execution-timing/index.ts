import { AxiosInstance } from 'axios';
import { emit, EmitOptions } from '../../utils-isomorphic/emit';

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await

export function time<T>(
  axiosInstance: AxiosInstance,
  serviceName: string,
  fnName: string,
  fn: (...args: any[]) => T
): T | void {
  let executionStartTime: number | null = null;
  let executionStopTime: number | null = null;
  let returnValue: T | null = null;
  let error: Error | undefined;

  try {
    executionStartTime = performance.now();
    returnValue = fn();
    executionStopTime = performance.now();
  } catch (e: any) {
    error = e as Error;
  } finally {
    if (error) {
      throw error;
    }

    let emitOptions: EmitOptions | null = null;

    if (executionStartTime && executionStopTime) {
      const totalFnDurationInMs = executionStopTime - executionStartTime;

      emitOptions = {
        axiosInstance,
        url: '/timing',
        data: {
          m_type: 'timing',
          value: {
            duration: 't_' + totalFnDurationInMs.toString(10),
            fn_name: fnName,
            timestamp: Date.now().toString(),
            service_name: serviceName,
          },
        },
      } as EmitOptions;

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
    }

    if (returnValue) {
      return returnValue;
    }
  }
}

export async function timeAsync<T>(
  axiosInstance: AxiosInstance,
  serviceName: string,
  fnName: string,
  fn: (...args: any[]) => Promise<T>
): Promise<T | void> {
  let executionStartTime: number | null = null;
  let executionStopTime: number | null = null;
  let returnValue: T | null = null;
  let error: Error | undefined;

  try {
    executionStartTime = performance.now();
    returnValue = await fn();
    executionStopTime = performance.now();
  } catch (e: any) {
    error = e as Error;
  } finally {
    if (error) {
      throw error;
    }

    if (executionStartTime && executionStopTime) {
      const totalFnDurationInMs = executionStopTime - executionStartTime;

      const emitOptions: EmitOptions = {
        axiosInstance,
        url: '/timing',
        data: {
          m_type: 'timing',
          value: {
            duration: 't_' + totalFnDurationInMs.toString(10),
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
    }

    if (returnValue) {
      return returnValue;
    }
  }
}
