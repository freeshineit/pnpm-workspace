import './App.css';
import '@ak2021/react-ui/dist/style/css.css';
import React, { useEffect } from 'react';
import logo from './logo.svg';
import { Button } from '@ak2021/react-ui';
import Store from '@ak2021/store';

function App() {
  const storeRef = React.useRef<Store | null>(null);

  useEffect(() => {
    if (storeRef.current) return;
    storeRef.current = new Store({ id: 'app-store' });
    storeRef.current.on('test', (data: any) => {
      console.log('test', data);
    });
    console.log('store App', storeRef.current);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
        <Button>Button</Button>
      </header>
    </div>
  );
}

export default App;
