import { AxiosInstance } from 'axios';
import { emit, EmitOptions } from '../../utils-isomorphic/emit';

export function count<T>(
  axiosInstance: AxiosInstance,
  serviceName: string,
  fnName: string,
  fn: (...args: any[]) => T,
  s?: Record<any, any> // supplementary metadata
): T | void {
  let returnValue: T | null = null;
  let error: Error | undefined;

  try {
    returnValue = fn();
  } catch (e: any) {
    error = e as Error;
  } finally {
    if (error) {
      throw error;
    }

    let emitOptions: EmitOptions | null = null;

    emitOptions = {
    axiosInstance,
    url: '/count',
    data: {
        m_type: 'count',
        value: {
            fn_name: fnName,
            timestamp: Date.now().toString(),
            service_name: serviceName,
            count_adjustment: 1,
            s: s ? JSON.stringify(s) : ''
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

    if (returnValue) {
      return returnValue;
    }
  }
}

export async function countAsync<T>(
  axiosInstance: AxiosInstance,
  serviceName: string,
  fnName: string,
  fn: (...args: any[]) => Promise<T>,
  s?: Record<string, string>
): Promise<T | void> {
    let returnValue: T | null = null;
    let error: Error | undefined;
  
    try {
      returnValue = await fn();
    } catch (e: any) {
      error = e as Error;
    } finally {
      if (error) {
        throw error;
      }
  
      let emitOptions: EmitOptions | null = null;
  
      emitOptions = {
      axiosInstance,
      url: '/count',
      data: {
          m_type: 'count',
          value: {
              fn_name: fnName,
              timestamp: Date.now().toString(),
              service_name: serviceName,
              count_adjustment: 1,
              s: s ? JSON.stringify(s) : ''
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
  
      if (returnValue) {
        return returnValue;
      }
    }
}
