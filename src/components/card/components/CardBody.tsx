import React from 'react';

const CardBody: React.FC = (props) => (
  <div
    className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg py-4 px-4'
    {...props}
  ></div>
);

export default CardBody;
