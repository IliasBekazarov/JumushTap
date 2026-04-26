import { useEffect } from 'react';

export default function Toast({ message, onHide }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onHide, 2200);
    return () => clearTimeout(t);
  }, [message]);

  if (!message) return null;
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 toast-anim">
      <div className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl shadow-2xl text-sm font-medium">
        {message}
      </div>
    </div>
  );
}
