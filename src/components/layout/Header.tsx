import * as React from 'react';

export default function Header() {
  return (
    <header className='sticky top-0 z-50 bg-white'>
      <div className='min-w-full flex items-center justify-center h-14 border-2 '>
        <span className='font-extrabold font-serif text-xl text-orange-500'>
          Food App
        </span>
      </div>
    </header>
  );
}
