import { useState, useRef } from 'react';
import { Camera, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen() {
  const { register, login } = useAuth();
  const [tab, setTab] = useState('register');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+996');
  const [avatar, setAvatar] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef();

  const handleAvatar = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setAvatarFile(f);
    setAvatar(URL.createObjectURL(f));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone || phone === '+996') { setError('Телефон номерди киргизиңиз'); return; }
    if (tab === 'register' && !name.trim()) { setError('Атыңызды киргизиңиз'); return; }
    setError('');
    setLoading(true);
    try {
      if (tab === 'register') {
        await register(phone, name, avatarFile);
      } else {
        await login(phone);
      }
    } catch (err) {
      const d = err?.response?.data;
      if (d) setError(Object.values(d).flat().join(' '));
      else setError('Сервер менен байланыш жок. Кайра аракет кылыңыз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 to-slate-950 flex flex-col items-center justify-center px-4 py-8">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-emerald-500 to-indigo-600 flex items-center justify-center">
          <Briefcase size={20} className="text-white" />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight">
          <span className="text-white">Jumush</span>
          <span className="text-emerald-400">Tap</span>
        </h1>
      </div>

      <div className="border border-slate-700 rounded-full px-4 py-1.5 mb-4">
        <span className="text-xs text-slate-400 tracking-widest font-medium">СТУДЕНТТЕР ҮЧҮН</span>
      </div>
      <p className="text-slate-400 text-sm mb-7">Бир мүнөттө подработка тап</p>

      {/* Avatar (register only) */}
      {tab === 'register' && (
        <button onClick={() => fileRef.current.click()} className="relative mb-7 group">
          <div className="w-20 h-20 rounded-full bg-linear-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-3xl overflow-hidden border-2 border-indigo-400/50 group-hover:border-indigo-300 transition-colors">
            {avatar ? <img src={avatar} className="w-full h-full object-cover" alt="" /> : '👤'}
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-slate-900">
            <Camera size={13} className="text-white" />
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
        </button>
      )}

      {/* Card */}
      <div className="w-full max-w-sm bg-slate-800/60 backdrop-blur-sm border border-indigo-500/30 rounded-3xl p-6 shadow-2xl">
        {/* Tabs */}
        <div className="flex bg-slate-900/60 rounded-2xl p-1 mb-5 gap-1">
          {['register', 'login'].map(t => (
            <button key={t} onClick={() => { setTab(t); setError(''); }}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                tab === t
                  ? 'bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-slate-200'
              }`}>
              {t === 'register' ? 'Катталуу' : 'Кируу'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {tab === 'register' && (
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">Аты-жөнү</label>
              <input
                className="w-full bg-slate-900/70 border border-indigo-500/30 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-400 focus:outline-none transition-colors"
                placeholder="Атыңыз"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
          )}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">Телефон номер</label>
            <input
              className="w-full bg-slate-900/70 border border-indigo-500/30 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-400 focus:outline-none transition-colors"
              placeholder="+996"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              type="tel"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs bg-red-500/10 rounded-xl px-3 py-2">{error}</p>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl py-3.5 font-bold text-base transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-60 mt-1">
            {loading ? 'Жүктөлүүдө...' : tab === 'register' ? 'Баштоо →' : 'Кируу →'}
          </button>
        </form>
      </div>
    </div>
  );
}
