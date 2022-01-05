import * as React from 'react';

{
  /*  TODO : Cleanup */
}
// import Navbar from './Navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  // Put Header or Footer Here
  return (
    <div className='box-border'>
      <div className='flex flex-col'>
        {/* <Navbar logo='/images/logo.png' /> */}
        {children}
      </div>
    </div>
  );
}
