import React from 'react';
import {Image} from '../image.svg';

const DisplaySVG = ({ svgUrl }) => {
  return (
    <div>
      <h2>Preview Your SVG</h2>
      <object data={svgUrl} type="image/svg+xml">
        Your browser does not support SVG.
      </object>
    </div>
  );
};

export default DisplaySVG;
