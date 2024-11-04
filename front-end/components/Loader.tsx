// front-end/components/Loader.tsx

import React from 'react';
import { ClipLoader } from 'react-spinners';

const Loader: React.FC = () => (
  <div className="flex justify-center items-center">
    <ClipLoader size={50} color="#2563EB" />
  </div>
);

export default Loader;
