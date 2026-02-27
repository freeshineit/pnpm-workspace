import { test, expect } from '@playwright/test';

test.describe('Store Unit Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Use file:// protocol to load the HTML file directly
    await page.goto(`file://${process.cwd()}/packages/store/public/test-demo.html`);
    // Wait for Store to be ready
    await page.waitForFunction(() => (window as any).testStoreReady);
  });

  test('should create Store with default options', async ({ page }) => {
    const result = await page.evaluate(() => {
      const Store = (window as any).Store;
      const store = new Store();
      return {
        hasOptions: store.options !== undefined,
        optionsIsObject: typeof store.options === 'object',
        optionsIsEmpty: Object.keys(store.options).length === 0,
      };
    });

    expect(result.hasOptions).toBe(true);
    expect(result.optionsIsObject).toBe(true);
    expect(result.optionsIsEmpty).toBe(true);
  });

  test('should create Store with provided options', async ({ page }) => {
    const result = await page.evaluate(() => {
      const Store = (window as any).Store;
      const store = new Store({ id: 'test-store-01' });
      return {
        id: store.options.id,
        hasOptions: store.options !== undefined,
      };
    });

    expect(result.id).toBe('test-store-01');
    expect(result.hasOptions).toBe(true);
  });

  test('should store multiple option types', async ({ page }) => {
    const result = await page.evaluate(() => {
      const Store = (window as any).Store;
      const store = new Store({
        id: 'store-123',
      });
      return {
        id: store.options.id,
        optionsLength: Object.keys(store.options).length,
      };
    });

    expect(result.id).toBe('store-123');
    expect(result.optionsLength).toBeGreaterThan(0);
  });

  test('should have on method', async ({ page }) => {
    const result = await page.evaluate(() => {
      const Store = (window as any).Store;
      const store = new Store();
      return {
        hasOnMethod: typeof store.on === 'function',
      };
    });

    expect(result.hasOnMethod).toBe(true);
  });

  test('should call on method without errors', async ({ page }) => {
    const result = await page.evaluate(() => {
      const Store = (window as any).Store;
      const store = new Store({ id: 'test' });
      try {
        store.on('test-event', () => {});
        return { success: true };
      } catch (e) {
        return { success: false, error: (e as Error).message };
      }
    });

    expect(result.success).toBe(true);
  });

  test('should accept event types and callbacks in on', async ({ page }) => {
    const result = await page.evaluate(() => {
      const Store = (window as any).Store;
      const store = new Store();
      try {
        const callback = () => console.log('test');
        store.on('custom-event', callback);
        return { success: true };
      } catch (e) {
        return { success: false, error: (e as Error).message };
      }
    });

    expect(result.success).toBe(true);
  });

  test('should maintain options after constructor', async ({ page }) => {
    const result = await page.evaluate(() => {
      const Store = (window as any).Store;
      const initialOptions = { id: 'persistent-store' };
      const store = new Store(initialOptions);
      return {
        originalId: initialOptions.id,
        storeId: store.options.id,
        isEqual: store.options.id === initialOptions.id,
      };
    });

    expect(result.isEqual).toBe(true);
    expect(result.storeId).toBe('persistent-store');
  });

  test('should handle empty string id', async ({ page }) => {
    const result = await page.evaluate(() => {
      const Store = (window as any).Store;
      const store = new Store({ id: '' });
      return {
        id: store.options.id,
        isEmptyString: store.options.id === '',
      };
    });

    expect(result.isEmptyString).toBe(true);
  });

  test('should handle numeric id', async ({ page }) => {
    const result = await page.evaluate(() => {
      const Store = (window as any).Store;
      const store = new Store({ id: 12345 } as any);
      return {
        id: store.options.id,
      };
    });

    expect(result.id).toBe(12345);
  });
});
