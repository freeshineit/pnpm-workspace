import React from 'react';
import logo from './logo.svg';
import './App.css';
import '@ak2021/react-ui/dist/style/css.css';
import { Button } from '@ak2021/react-ui';
import Store from '@ak2021/store';

function App() {
  const store = new Store({ id: 'app-store' });

  store.on('test', (data: any) => {
    console.log('test', data);
  });

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
