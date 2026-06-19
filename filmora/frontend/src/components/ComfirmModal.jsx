import React from 'react';

export default function ConfirmModal({ open, onConfirm, onCancel, message }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded">
        <div className="mb-4">{message}</div>
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="px-3 py-1 bg-gray-600 rounded">Cancelar</button>
          <button onClick={onConfirm} className="px-3 py-1 bg-red-700 rounded">Confirmar</button>
        </div>
      </div>
    </div>
  );
}
