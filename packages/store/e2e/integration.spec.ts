import { test, expect } from '@playwright/test';

test.describe('Store Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`file://${process.cwd()}/packages/store/public/test-demo.html`);
    await page.waitForFunction(() => (window as any).testStoreReady);
  });

  test('should create multiple independent Store instances', async ({ page }) => {
    const result = await page.evaluate(() => {
      const Store = (window as any).Store;
      const stores = [new Store({ id: 'store-1' }), new Store({ id: 'store-2' }), new Store({ id: 'store-3' })];

      return {
        store1Id: stores[0].options.id,
        store2Id: stores[1].options.id,
        store3Id: stores[2].options.id,
        allDifferent: stores[0].options.id !== stores[1].options.id && stores[1].options.id !== stores[2].options.id,
      };
    });

    expect(result.store1Id).toBe('store-1');
    expect(result.store2Id).toBe('store-2');
    expect(result.store3Id).toBe('store-3');
    expect(result.allDifferent).toBe(true);
  });

  test('should maintain instance independence', async ({ page }) => {
    const result = await page.evaluate(() => {
      const Store = (window as any).Store;
      const store1 = new Store({ id: 'independent-1' });
      const store2 = new Store({ id: 'independent-2' });

      store1.options.id = 'modified';

      return {
        store1ModifiedId: store1.options.id,
        store2OriginalId: store2.options.id,
        store2Unchanged: store2.options.id === 'independent-2',
      };
    });

    expect(result.store1ModifiedId).toBe('modified');
    expect(result.store2OriginalId).toBe('independent-2');
    expect(result.store2Unchanged).toBe(true);
  });

  test('should handle on method with multiple event types', async ({ page }) => {
    const result = await page.evaluate(() => {
      const Store = (window as any).Store;
      const store = new Store({ id: 'event-store' });

      let eventCount = 0;
      const originalLog = console.log;
      console.log = function (...args: any[]) {
        eventCount++;
      };

      store.on('load', () => {});
      store.on('save', () => {});
      store.on('delete', () => {});

      console.log = originalLog;

      return {
        eventsCalled: eventCount >= 3,
        eventsCount: eventCount,
      };
    });

    expect(result.eventsCalled).toBe(true);
    expect(result.eventsCount).toBeGreaterThanOrEqual(3);
  });

  test('should allow reusing Store instances', async ({ page }) => {
    const result = await page.evaluate(() => {
      const Store = (window as any).Store;
      const store = new Store({ id: 'reusable-store' });

      const results = [];
      for (let i = 0; i < 3; i++) {
        store.on('event-' + i, () => {});
        results.push(store.options.id === 'reusable-store');
      }

      return {
        idPersistent: store.options.id === 'reusable-store',
        allCallsSucceeded: results.every(r => r === true),
      };
    });

    expect(result.idPersistent).toBe(true);
    expect(result.allCallsSucceeded).toBe(true);
  });

  test('should support chaining Store operations', async ({ page }) => {
    const result = await page.evaluate(() => {
      const Store = (window as any).Store;
      const store = new Store({ id: 'chain-store' });

      try {
        store.on('init', () => {});
        const id1 = store.options.id;
        store.on('process', () => {});
        const id2 = store.options.id;
        store.on('complete', () => {});
        const id3 = store.options.id;

        return {
          success: true,
          idUnchanged: id1 === id2 && id2 === id3,
          allOperationsCompleted: true,
        };
      } catch (e) {
        return {
          success: false,
          error: (e as Error).message,
        };
      }
    });

    expect(result.success).toBe(true);
    expect(result.idUnchanged).toBe(true);
    expect(result.allOperationsCompleted).toBe(true);
  });

  test('should handle rapid Store creation and usage', async ({ page }) => {
    const result = await page.evaluate(() => {
      const Store = (window as any).Store;
      const stores = [];

      for (let i = 0; i < 10; i++) {
        const store = new Store({ id: `rapid-${i}` });
        store.on('event', () => {});
        stores.push(store);
      }

      const allValid = stores.every((store, index) => store.options.id === `rapid-${index}`);

      return {
        storesCreated: stores.length === 10,
        allValid: allValid,
        firstStoreId: stores[0].options.id,
        lastStoreId: stores[9].options.id,
      };
    });

    expect(result.storesCreated).toBe(true);
    expect(result.allValid).toBe(true);
    expect(result.firstStoreId).toBe('rapid-0');
    expect(result.lastStoreId).toBe('rapid-9');
  });

  test('should maintain state consistency across multiple on calls', async ({ page }) => {
    const result = await page.evaluate(() => {
      const Store = (window as any).Store;
      const store = new Store({ id: 'state-store' });

      const originalId = store.options.id;
      store.on('event1', () => {});
      const idAfterEvent1 = store.options.id;
      store.on('event2', () => {});
      const idAfterEvent2 = store.options.id;
      store.on('event3', () => {});
      const idAfterEvent3 = store.options.id;

      return {
        idPersistent: originalId === idAfterEvent1 && idAfterEvent1 === idAfterEvent2 && idAfterEvent2 === idAfterEvent3,
        idValue: store.options.id,
      };
    });

    expect(result.idPersistent).toBe(true);
    expect(result.idValue).toBe('state-store');
  });

  test('should handle Store with various callback types', async ({ page }) => {
    const result = await page.evaluate(() => {
      const Store = (window as any).Store;
      const store = new Store({ id: 'callback-store' });

      try {
        function namedCallback() {}
        store.on('named', namedCallback);
        store.on('arrow', () => {});
        store.on('anon', function () {});
        store.on('null', null as any);

        return {
          success: true,
          type: typeof store.options,
        };
      } catch (e) {
        return {
          success: false,
          error: (e as Error).message,
        };
      }
    });

    expect(result.success).toBe(true);
  });

  test('should preserve options through instance lifecycle', async ({ page }) => {
    const result = await page.evaluate(() => {
      const Store = (window as any).Store;
      const options = { id: 'lifecycle-store' };
      const store = new Store(options);

      const checkpoints = [];
      checkpoints.push(store.options.id);
      store.on('op1', () => {});
      checkpoints.push(store.options.id);
      store.on('op2', () => {});
      checkpoints.push(store.options.id);
      store.on('op3', () => {});
      checkpoints.push(store.options.id);

      return {
        allCheckpointsSame: checkpoints.every(id => id === 'lifecycle-store'),
        checkpointsCount: checkpoints.length,
        finalId: store.options.id,
      };
    });

    expect(result.allCheckpointsSame).toBe(true);
    expect(result.checkpointsCount).toBe(4);
    expect(result.finalId).toBe('lifecycle-store');
  });
});
