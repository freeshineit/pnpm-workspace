import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import UI, { Button } from '../src/index';
import MainExport from '../src/main';
import '../src/style';

describe('react-ui', () => {
  test('exports Button from index and default export', () => {
    expect(UI.Button).toBe(Button);
  });

  test('exports Button from main default export', () => {
    expect(MainExport.Button).toBe(Button);
  });

  test('renders Button with base class and children', () => {
    const html = renderToStaticMarkup(React.createElement(Button, null, 'Click Me'));

    expect(html).toContain('class="wc-btn"');
    expect(html).toContain('Click Me');
  });

  test('renders primary Button with modifier class', () => {
    const html = renderToStaticMarkup(React.createElement(Button, { type: 'primary' }, 'Primary'));

    expect(html).toContain('wc-btn-primary');
  });

  test('renders custom class and inline style', () => {
    const html = renderToStaticMarkup(
      React.createElement(
        Button,
        {
          className: 'custom-class',
          style: { color: 'red' },
        },
        'Styled',
      ),
    );

    expect(html).toContain('custom-class');
    expect(html).toContain('style="color:red"');
  });
});
