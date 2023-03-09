import { add } from './node';

describe('index.node', () => { 
    test('adds one', () => {
        expect(add(5)).toBe(6);
    })
 })