# Porygon Metlib

An isomorphic metric library for javascript applications;

## Getting Started

```bash
npm install @nickgdev/porygon-metlib
```

### QuickStart

```ts
import { MetricSync, MetricAsync } from '@nickgdev/porygon-metlib';

function syncFnThatCouldThrowErr(n: number): number {
    /** ... */
}

const metric = new MetricSync<number>({
    endpoint: 'https://porygon-metlib-server',
    serviceName: 'Service Name',
    functionName: 'syncFnThatCouldThrowErr'
});

const resultOrThrownError = metric.monitor(syncFnThatCouldThrowErr.bind({}, 22)); // invoked the passed fn, which returns the fn return value or rethrows any errors thrown during invocation;

const nextResult = metric.monitor(() => syncFnThatCouldThrowErr(23)); // can also be used with arrow functions/args

async function getData(): Promise<ComplexDataType> {
    return await fetch(/** ... */)
    .then(r => r.json())
    .catch(e => throw e);
}

const metricAsync = new MetricAsync<ComplexDataType>({
    endpoint: 'https://porygon-metlib-server',
    serviceName: 'Service Name',
    functionName: 'getData'
});

const asyncDataResult = await metricAsync.monitorAsync(getData);

```

When you utilize a MetricSync or MetricAsync class wrapper, there is an innate http emission to a porygon-met-webserver which catalogs metric data and displays it in a graphical UI. 

### Monitor & Monitor Async

Intended to monitor a fn that could fail or throw an error. Will attempt to invoke the fn and return the result. If the op succeeds, it will emit the following block to PMWS.

```json
{
    "m_type": "availability",
    "value": {
        "availability": 1,
        "fn_name": "fnName()",
        "service_name": "my-service-1.0",
        "timestamp": "0002121131211"
    }
}
```

If the op fails, monitor will rethrow the error and emit an availability 0 json block.

