import { expect, test } from "@playwright/test";
import path from "path";
import fs from "fs";

const cwd = process.cwd();

const reactUiBundlePath = path.resolve(cwd, "packages/react-ui/dist/index.umd.js");
const clxsBundlePath = path.resolve(cwd, "packages/react-ui/public/clsx.min.js");

function findUmdBundle(packageName: string, bundleName: string): string | null {
  // Search in pnpm's .pnpm directory structure first
  const pnpmDir = path.resolve(cwd, "node_modules/.pnpm");
  if (fs.existsSync(pnpmDir)) {
    const entries = fs.readdirSync(pnpmDir);
    const match = entries.find((e) => e.startsWith(`${packageName}@`));
    if (match) {
      const bundlePath = path.resolve(pnpmDir, match, "node_modules", packageName, "umd", bundleName);
      if (fs.existsSync(bundlePath)) return bundlePath;
    }
  }
  // Fallback to regular node_modules
  const fallback = path.resolve(cwd, "node_modules", packageName, "umd", bundleName);
  if (fs.existsSync(fallback)) return fallback;
  return null;
}

const reactUmdBundlePath = findUmdBundle("react", "react.production.min.js");
const reactDomUmdBundlePath = findUmdBundle("react-dom", "react-dom.production.min.js");

test.describe("React UI E2E", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!fs.existsSync(reactUiBundlePath), `Bundle not found: ${reactUiBundlePath}`);
    const umdCode = fs.readFileSync(reactUiBundlePath, "utf-8");
    test.skip(!reactUmdBundlePath, `React UMD bundle not found`);
    const reactCode = fs.readFileSync(reactUmdBundlePath!, "utf-8");
    test.skip(!reactDomUmdBundlePath, `ReactDOM UMD bundle not found`);
    const reactDomCode = fs.readFileSync(reactDomUmdBundlePath!, "utf-8");
    test.skip(!fs.existsSync(clxsBundlePath), `Bundle not found: ${clxsBundlePath}`);
    const clsxCode = fs.readFileSync(clxsBundlePath, "utf-8");

    await page.setContent('<div id="root"></div>');
    await page.addScriptTag({
      content: `var process = { env: { NODE_ENV: 'production' } };\n${reactCode};\n${reactDomCode};\n${clsxCode};\n${umdCode};`,
    });
  });

  test("should expose ReactUi global and Button component", async ({ page }) => {
    const result = await page.evaluate(() => {
      const lib = (window as any).ReactUi;
      return {
        hasLibrary: !!lib,
        hasButton: typeof lib?.Button === "function",
      };
    });

    expect(result.hasLibrary).toBe(true);
    expect(result.hasButton).toBe(true);
  });

  test("should render Button with correct className via ReactDOM", async ({ page }) => {
    // Render the Button component through ReactDOM so hooks work properly
    await page.evaluate(() => {
      const Button = (window as any).ReactUi.Button;
      const root = (window as any).ReactDOM.createRoot(document.getElementById("root"));
      root.render((window as any).React.createElement(Button, { children: "Playwright Button", type: "primary" }));
    });

    // Wait for React to commit the render
    await page.waitForSelector("button.wc-btn");

    // Check the rendered button element
    const buttonClass = await page.getAttribute("button", "class");
    expect(buttonClass).toContain("wc-btn");
    expect(buttonClass).toContain("wc-btn-primary");

    const buttonText = await page.textContent("button");
    expect(buttonText).toBe("Playwright Button");
  });
});
