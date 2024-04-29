import React, { useState } from 'react';
import './App.css';
import { Button } from './components/ui/button';
import { Link } from 'react-router-dom';

function App() {
  return (
    <>
      <h1 className='text-primary text-7xl uppercase font-semibold italic [text-shadow:_0_1px_16px_hsl(82_85%_67%_/_40%)]'>
        Showcase
      </h1>
      <p className='text-neutral-300 p-4'>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit.
      </p>
      <Button>
        <Link to='/signup'>Create Account</Link>
      </Button>
    </>
  );
}

export default App;
