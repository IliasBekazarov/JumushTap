import { useState } from 'react';
import { X } from 'lucide-react';
import { api } from '../context/AuthContext';
import { useLang } from '../context/LangContext';

export default function EditModal({ job, onClose, onSaved, showToast }) {
  const { t } = useLang();
  const [form, setForm] = useState({
    description: job.description || '',
    whatsapp: job.whatsapp || '',
    phone: job.phone || '',
    address: job.address || '',
    is_negotiable: job.is_negotiable || false,
    salary_from: job.salary_from || '',
    salary_to: job.salary_to || '',
  });
  const [saving, setSaving] = useState(false);

  const up = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/jobs/${job.id}/`, {
        ...form,
        salary_from: form.is_negotiable ? null : parseInt(form.salary_from) || 0,
        salary_to: form.is_negotiable ? null : parseInt(form.salary_to) || 0,
      });
      showToast(t.editSaved);
      onSaved();
      onClose();
    } catch {
      showToast(t.error);
    } finally {
      setSaving(false);
    }
  };

  const inp = "w-full bg-slate-900/70 border border-indigo-500/30 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 transition-colors text-sm outline-none";
  const lbl = "block text-xs font-medium text-indigo-300 mb-1.5 uppercase tracking-wide";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-slate-800 border border-indigo-500/40 rounded-2xl p-6 w-full max-w-lg shadow-2xl my-4" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-white font-bold text-lg">{t.editTitle}</h2>
          <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-white" /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className={lbl}>{t.description}</label>
            <textarea className={`${inp} h-24 resize-none`} value={form.description} onChange={e => up('description', e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={lbl}>WhatsApp</label><input className={inp} value={form.whatsapp} onChange={e => up('whatsapp', e.target.value)} /></div>
            <div><label className={lbl}>Телефон</label><input className={inp} value={form.phone} onChange={e => up('phone', e.target.value)} /></div>
          </div>
          <div><label className={lbl}>{t.address}</label><input className={inp} value={form.address} onChange={e => up('address', e.target.value)} /></div>
          <div>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={form.is_negotiable} onChange={e => up('is_negotiable', e.target.checked)} className="w-4 h-4 accent-indigo-500" />
              <span className="text-slate-300 text-sm">{t.salaryNego}</span>
            </label>
          </div>
          {!form.is_negotiable && (
            <div className="grid grid-cols-2 gap-3">
              <div><label className={lbl}>{t.priceFrom}</label><input type="number" className={inp} value={form.salary_from} onChange={e => up('salary_from', e.target.value)} /></div>
              <div><label className={lbl}>{t.priceTo}</label><input type="number" className={inp} value={form.salary_to} onChange={e => up('salary_to', e.target.value)} /></div>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white rounded-xl py-2.5 font-medium transition-colors text-sm">{t.cancel}</button>
            <button type="submit" disabled={saving} className="flex-1 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl py-2.5 font-medium transition-all text-sm disabled:opacity-60">
              {saving ? t.saving : t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
