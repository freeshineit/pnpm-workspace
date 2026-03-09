import { expect, test } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const webComponentsBundlePath = path.resolve(process.cwd(), 'packages/web-components/dist/index.umd.js');

test.describe('Web Components E2E', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!fs.existsSync(webComponentsBundlePath), `Bundle not found: ${webComponentsBundlePath}`);

    await page.setContent('<div id="app"></div>');
    await page.addScriptTag({ path: webComponentsBundlePath });
  });

  test('should register custom elements', async ({ page }) => {
    const result = await page.evaluate(() => {
      return {
        hasButton: !!customElements.get('wc-button'),
        hasPopover: !!customElements.get('wc-popover'),
      };
    });

    expect(result.hasButton).toBe(true);
    expect(result.hasPopover).toBe(true);
  });

  test('should render wc-button shadow dom', async ({ page }) => {
    const result = await page.evaluate(() => {
      document.body.innerHTML = '<wc-button>Button Text</wc-button>';
      const host = document.querySelector('wc-button') as HTMLElement;
      const shadowButton = host?.shadowRoot?.querySelector('button');
      const shadowSlot = host?.shadowRoot?.querySelector('slot');

      return {
        hasShadowButton: !!shadowButton,
        hasShadowSlot: !!shadowSlot,
        className: shadowButton?.className || '',
        hostText: host?.textContent?.trim() || '',
      };
    });

    expect(result.hasShadowButton).toBe(true);
    expect(result.hasShadowSlot).toBe(true);
    expect(result.className).toContain('vv-button');
    expect(result.hostText).toContain('Button Text');
  });

  test('should parse popover list and show when open is set', async ({ page }) => {
    const result = await page.evaluate(() => {
      document.body.innerHTML = `
        <wc-popover list='[{"value":1,"label":"Item 1"},{"value":2,"label":"Item 2"}]' open='1'>
          <wc-button>Trigger</wc-button>
        </wc-popover>
      `;

      const host = document.querySelector('wc-popover') as HTMLElement;
      const popover = host?.shadowRoot?.querySelector('.wc-popover') as HTMLElement | null;
      const listItems = host?.shadowRoot?.querySelectorAll('.wc-popover li') || [];

      return {
        hasPopover: !!popover,
        isVisible: popover?.classList.contains('wc-show') || false,
        itemCount: listItems.length,
      };
    });

    expect(result.hasPopover).toBe(true);
    expect(result.isVisible).toBe(true);
    expect(result.itemCount).toBe(2);
  });
});
