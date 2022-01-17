import * as React from 'react';

import Header from './Header';

{
  /*  TODO : Cleanup */
}
// import Navbar from './Navbar';

export default function AuthorizedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Put Header or Footer Here
  return (
    <div className='box-border'>
      <Header></Header>

      <div className='flex flex-col'>
        {/* <Navbar logo='/images/logo.png' /> */}
        {children}
      </div>
    </div>
  );
}
