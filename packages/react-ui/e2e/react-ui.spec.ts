import { expect, test } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const reactUiBundlePath = path.resolve(process.cwd(), 'packages/react-ui/dist/index.umd.js');

test.describe('React UI E2E', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!fs.existsSync(reactUiBundlePath), `Bundle not found: ${reactUiBundlePath}`);
    const umdCode = fs.readFileSync(reactUiBundlePath, 'utf-8');

    await page.setContent('<div id="root"></div>');
    await page.addScriptTag({
      content: `var process = { env: { NODE_ENV: 'production' } };\n${umdCode}`,
    });
  });

  test('should expose ReactUi global and Button component', async ({ page }) => {
    const result = await page.evaluate(() => {
      const lib = (window as any).ReactUi;
      return {
        hasLibrary: !!lib,
        hasButton: typeof lib?.Button === 'function',
      };
    });

    expect(result.hasLibrary).toBe(true);
    expect(result.hasButton).toBe(true);
  });

  test('should build button element props correctly', async ({ page }) => {
    const result = await page.evaluate(() => {
      const Button = (window as any).ReactUi.Button;
      const vnode = Button({ children: 'Playwright Button', type: 'primary' });

      return {
        tagName: vnode?.type,
        className: vnode?.props?.className,
        children: vnode?.props?.children,
      };
    });

    expect(result.tagName).toBe('button');
    expect(result.className).toContain('wc-btn');
    expect(result.className).toContain('wc-btn-primary');
    expect(result.children).toBe('Playwright Button');
  });
});
