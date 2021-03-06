import React from 'react';

import THeadTH from './THeadTH';
import THeadTR from './THeadTR';

type CommonComponents = {
  TH: typeof THeadTH;
  TR: typeof THeadTR;
};

const THead: React.FC & CommonComponents = ({ children }) => (
  <thead className='bg-gray-100'>{children}</thead>
);

THead.TH = THeadTH;
THead.TR = THeadTR;

export default THead;
