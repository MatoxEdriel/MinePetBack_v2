import { AsyncLocalStorage } from 'async_hooks';



//!Concepto
export const tenantStorage = new AsyncLocalStorage<string>();