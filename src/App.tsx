import React from 'react';
import { ROWS } from './data';
import './App.css';
import { TablePoc } from './TablePoc';

function App() {
  return (
    <div className="App">
      <TablePoc rows={ROWS}></TablePoc>
    </div>
  );
}

export default App;
