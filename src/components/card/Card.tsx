import React from 'react';

import CardBody from './components/CardBody';
import CardHeader from './components/CardHeader';

type CommonComponents = {
  Header: typeof CardHeader;
  Body: typeof CardBody;
};

const Card: React.FC & CommonComponents = (props) => {
  return <div className='border-r-4 border-2' {...props} />;
};

Card.Header = CardHeader;
Card.Body = CardBody;

export default Card;
