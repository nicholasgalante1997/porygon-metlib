export function measuredTryCatch<T>(endpoint: string, fn: (...args: any[]) => T): T | void {
    let error: Error | undefined;
    let result: T | undefined;
    try {
        result = fn();
    } catch(e: any) {
        error = e as Error;
    } finally {
        if (error) {
            return;
        } else {
            return result;
        }
    }
}