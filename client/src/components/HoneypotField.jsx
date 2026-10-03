import React from 'react';

const HoneypotField = ({ register }) => {
  return (
    <input
      type="text"
      name="_honey"
      style={{ display: 'none' }}
      tabIndex={-1}
      autoComplete="off"
      {...register('_honey')}
    />
  );
};

export default HoneypotField;
