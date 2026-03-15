import { expect, test } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const reactUiBundlePath = path.resolve(process.cwd(), 'packages/react-ui/dist/index.umd.js');
const clxsBundlePath = path.resolve(process.cwd(), 'packages/react-ui/public/clsx.min.js');
const reactPackageRoot = path.dirname(require.resolve('react/package.json'));
const reactDomPackageRoot = path.dirname(require.resolve('react-dom/package.json'));
const reactUmdBundlePath = path.resolve(reactPackageRoot, 'umd/react.production.min.js');
const reactDomUmdBundlePath = path.resolve(reactDomPackageRoot, 'umd/react-dom.production.min.js');

test.describe('React UI E2E', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!fs.existsSync(reactUiBundlePath), `Bundle not found: ${reactUiBundlePath}`);
    const umdCode = fs.readFileSync(reactUiBundlePath, 'utf-8');
    test.skip(!fs.existsSync(clxsBundlePath), `Bundle not found: ${clxsBundlePath}`);
    const clsxCode = fs.readFileSync(clxsBundlePath, 'utf-8');
    test.skip(!fs.existsSync(reactUmdBundlePath), `Bundle not found: ${reactUmdBundlePath}`);
    const reactCode = fs.readFileSync(reactUmdBundlePath, 'utf-8');
    test.skip(!fs.existsSync(reactDomUmdBundlePath), `Bundle not found: ${reactDomUmdBundlePath}`);
    const reactDomCode = fs.readFileSync(reactDomUmdBundlePath, 'utf-8');

    await page.setContent('<div id="root"></div>');
    await page.addScriptTag({
      content: `var process = { env: { NODE_ENV: 'production' } };\n${reactCode};\n${reactDomCode};\n${clsxCode};\n${umdCode};`,
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
