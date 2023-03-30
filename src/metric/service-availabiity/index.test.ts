import { AxiosInstance } from 'axios';
import { configureAxiosInstance } from '../../utils-isomorphic';
import { monitor, monitorAsync } from './index';

describe('node | monitor suite', () => {
  let mockAxiosInstance: AxiosInstance | null = configureAxiosInstance({
    baseURL: 'http://localhost:7100',
  });

  let mockServiceName = 'jest_npm_pkg_suite';
  let mockFnName = 'mockFnInv()';

  beforeEach(() => {
    mockAxiosInstance = null;
    mockAxiosInstance = configureAxiosInstance({
      baseURL: 'http://localhost:7100',
    });
  });

  console.log(mockAxiosInstance.getUri({
    baseURL: 'http://localhost:7100',
  }))

  test('monitor, sync, returns number value', () => {
    const mockFnReturnsNumber = jest.fn(() => 22);
    const val = monitor(
      mockAxiosInstance!,
      mockServiceName,
      mockFnName,
      mockFnReturnsNumber
    );
    expect(val).toBe(22);
    expect(mockFnReturnsNumber).toBeCalledTimes(1);
  });

  test('monitor, sync, throws error if error is thrown during execution', () => {
    const mockFnThrowsError = jest.fn(() => {
      throw new Error();
    });
    expect(() =>
      monitor(
        mockAxiosInstance!,
        mockServiceName,
        mockFnName,
        mockFnThrowsError
      )
    ).toThrow();
  });

  test('monitorAsync, async, returns number value', async () => {
    const mockFnReturnsNumber = jest.fn(async () => {
      return 22;
    });
    const val = await monitorAsync(
      mockAxiosInstance!,
      mockServiceName,
      mockFnName,
      mockFnReturnsNumber
    );
    expect(val).toBe(22);
    expect(mockFnReturnsNumber).toBeCalledTimes(1);
  });

  test('monitorAsync, async, throws error if error is thrown during execution', async () => {
    const mockAsyncFnThrowsError = jest.fn(async () => {
      throw new Error('mock_err_thrown');
    });
    try {
      await monitorAsync(
        mockAxiosInstance!,
        mockServiceName,
        mockFnName,
        mockAsyncFnThrowsError
      );
    } catch (e: any) {
      expect(e.message).toEqual('mock_err_thrown');
    }
  });
});
