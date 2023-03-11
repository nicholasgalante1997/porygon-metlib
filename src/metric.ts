import { measuredTryCatch, time, timeAsync } from './node/index';

type IMetricOptions = {
    type: "pmetserver" | "httpserver" | "clouddb" | "localdb" | 'graphql';
    db: {
        DATABASE_JSON_PATH: string; // see https://db-migrate.readthedocs.io/en/latest/Getting%20Started/configuration/
    };
    server: {
        headers: Record<string, string>;
        body: Object;
    }
};

interface IMetric {
    endpoint: string;
    configuration?: IMetricOptions;
}

export class Metric<T> implements IMetric {
    constructor(public endpoint: string) {}

    time(fn: (...args: any[]) => T): T {
        const result = time<T>(this.endpoint, fn);
        return result;
    }

    async timeAsync (fn: (...args: any[]) => Promise<T>): Promise<T> {
        const result = await timeAsync<T>(this.endpoint, fn);
        return result;
    }

    measureTryCatch(){
        
    }
}