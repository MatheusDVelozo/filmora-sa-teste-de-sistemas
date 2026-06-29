import React from 'react';

export default function Button({ children, ...props }) {
  return (
    <button className="bg-green-800 px-4 py-2 rounded" {...props}>{children}</button>
  );
}
