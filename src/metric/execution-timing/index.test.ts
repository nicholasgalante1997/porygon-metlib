import { AxiosInstance } from 'axios';
import { configureAxiosInstance } from '../../utils-isomorphic';
import { time, timeAsync } from './index';

describe('node | time suite', () => {
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

  test('time, sync, returns number after invoking passed fn', () => {
    const mockFnReturnsNumber = jest.fn(() => 22);
    const val = time(
      mockAxiosInstance!,
      mockServiceName,
      mockFnName,
      mockFnReturnsNumber
    );
    expect(val).toBe(22);
    expect(mockFnReturnsNumber).toBeCalledTimes(1);
  });

  test('time, sync, throws error if error is thrown during execution', () => {
    const mockFnThrowsError = jest.fn(() => {
      throw new Error();
    });
    expect(() =>
      time(mockAxiosInstance!, mockServiceName, mockFnName, mockFnThrowsError)
    ).toThrow();
  });

  test('timeAsync, async, returns number value', async () => {
    const mockFnReturnsNumber = jest.fn(async () => {
      return 22;
    });
    const val = await timeAsync(
      mockAxiosInstance!,
      mockServiceName,
      mockFnName,
      mockFnReturnsNumber
    );
    expect(val).toBe(22);
    expect(mockFnReturnsNumber).toBeCalledTimes(1);
  });

  test('timeAsync, async, throws error if error is thrown during execution', async () => {
    const mockAsyncFnThrowsError = jest.fn(async () => {
      throw new Error('mock_err_thrown');
    });
    try {
      await timeAsync(
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
