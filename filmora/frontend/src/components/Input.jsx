import React from 'react';

export default function Input({ label, ...props }) {
  return (
    <label className="block">
      {label && <div className="text-sm text-gray-300 mb-1">{label}</div>}
      <input className="w-full px-3 py-2 rounded bg-gray-800 text-white" {...props} />
    </label>
  );
}
