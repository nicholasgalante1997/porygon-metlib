import { AxiosInstance } from 'axios';
import { configureAxiosInstance } from '../../utils-isomorphic';
import { count, countAsync } from './index';

describe('node | count suite', () => {
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

  test('count, returns number value after invoking passed fn', () => {
    const mockFnReturnsNumber = jest.fn(() => 22);
    const val = count(
      mockAxiosInstance!,
      mockServiceName,
      mockFnName,
      mockFnReturnsNumber
    );
    expect(val).toBe(22);
    expect(mockFnReturnsNumber).toBeCalledTimes(1);
  });

  test('count, rethrows error if error is thrown during execution', () => {
    const mockFnThrowsError = jest.fn(() => {
      throw new Error();
    });
    expect(() =>
      count(mockAxiosInstance!, mockServiceName, mockFnName, mockFnThrowsError)
    ).toThrow();
  });

  test('countAsync, returns promisified number value', async () => {
    const mockFnReturnsNumber = jest.fn(async () => {
      return 22;
    });
    const val = await countAsync(
      mockAxiosInstance!,
      mockServiceName,
      mockFnName,
      mockFnReturnsNumber
    );
    expect(val).toBe(22);
    expect(mockFnReturnsNumber).toBeCalledTimes(1);
  });

  test('countAsync, rethrows error if error is thrown during execution', async () => {
    const mockAsyncFnThrowsError = jest.fn(async () => {
      throw new Error('mock_err_thrown');
    });
    try {
      await countAsync(
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
