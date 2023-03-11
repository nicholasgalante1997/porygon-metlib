export function time<T>(endpoint: string, fn: (...args: any[]) => T): T {
    const executionStartTime = performance.now();
    const returnValue = fn();
    const executionStopTime = performance.now();

    const totalFnDurationInMs = executionStopTime - executionStartTime;

    /** What to do with the time metric??? */


    return returnValue;
}

export async function timeAsync<T>(endpoint: string, fn: (...args: any[]) => Promise<T>): Promise<T> {
    const executionStartTime = performance.now();
    const returnValue = await fn();
    const executionStopTime = performance.now();

    const totalFnDurationInMs = executionStopTime - executionStartTime;

    /** What to do with the time metric??? */

    return returnValue;
}