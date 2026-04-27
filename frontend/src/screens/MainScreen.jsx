import { useState, useCallback, useEffect, useRef, memo } from 'react';
import {
  Search, Plus, Briefcase, Bookmark, User,
  Sun, Moon, LogOut, Loader2, Camera,
} from 'lucide-react';
import { useAuth, api } from '../context/AuthContext';
import JobCard from '../components/JobCard';
import EditModal from '../components/EditModal';
import Toast from '../components/Toast';

// ─── SEARCH TAB ──────────────────────────────────────────────────────────────
const SearchTab = memo(function SearchTab({ jobs, loading, onSearch, onBookmark, onRate, showToast }) {
  const [q, setQ] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(q.trim());
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="px-3 pt-3 pb-2 shrink-0">
        <div className="flex gap-2">
          <input
            className="flex-1 bg-white dark:bg-slate-800/60 border border-gray-300 dark:border-indigo-500/30 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:border-indigo-400 focus:outline-none transition-colors"
            placeholder="Вакансия издөө..."
            value={q}
            onChange={e => setQ(e.target.value)}
          />
          <button type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-4 py-2.5 transition-colors">
            <Search size={16} />
          </button>
        </div>
      </form>

      {/* Job list */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 pb-4">
        {loading
          ? <div className="flex justify-center py-16"><Loader2 size={32} className="text-indigo-400 animate-spin" /></div>
          : jobs.length === 0
            ? <div className="text-center py-16 text-slate-500 text-sm">Вакансия табылган жок</div>
            : jobs.map(job => (
              <JobCard key={job.id} job={job} mode="search"
                onBookmark={onBookmark} onRate={onRate} showToast={showToast} />
            ))
        }
      </div>
    </div>
  );
});

// ─── POST TAB ─────────────────────────────────────────────────────────────────
const PostTab = memo(function PostTab({ showToast, onPosted }) {
  const [form, setForm] = useState({
    description: '', whatsapp: '', phone: '',
    address: '', is_negotiable: false, salary_from: '', salary_to: '',
    profile_type: 'employer',
  });
  const [saving, setSaving] = useState(false);

  const up = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const inp = "w-full bg-slate-900/60 dark:bg-slate-900/60 bg-gray-50 border border-indigo-500/30 dark:border-indigo-500/30 border-gray-300 rounded-xl px-4 py-2.5 text-sm text-white dark:text-white text-slate-800 placeholder-slate-500 dark:placeholder-slate-500 placeholder-gray-400 focus:border-indigo-400 focus:outline-none transition-colors outline-none";
  const lbl = "block text-xs font-medium text-indigo-300 dark:text-indigo-300 text-indigo-700 mb-1.5 uppercase tracking-wide";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.description.trim()) { showToast('Сүрөттөмө киргизиңиз'); return; }
    setSaving(true);
    try {
      await api.post('/jobs/', {
        ...form,
        salary_from: form.is_negotiable ? null : parseInt(form.salary_from) || 0,
        salary_to: form.is_negotiable ? null : parseInt(form.salary_to) || 0,
      });
      showToast('Вакансия жарыяланды! 🎉');
      setForm({ description: '', whatsapp: '', phone: '', address: '', is_negotiable: false, salary_from: '', salary_to: '', profile_type: 'employer' });
      onPosted();
    } catch {
      showToast('Ката болду. Кайра аракет кылыңыз.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 pb-8">
      <h2 className="text-white dark:text-white text-slate-800 font-bold text-xl mb-5">Вакансия жарыялоо</h2>
      <div className="bg-slate-800/60 dark:bg-slate-800/60 bg-white border border-indigo-500/30 dark:border-indigo-500/30 border-gray-200 rounded-3xl p-5 shadow-xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Role selector */}
          <div>
            <label className={lbl}>Ролуңуз</label>
            <div className="flex gap-2">
              {[['employer', '🏢 Иш берүүчү'], ['worker', '🔍 Иш издеген']].map(([v, l]) => (
                <button key={v} type="button" onClick={() => up('profile_type', v)}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all border ${
                    form.profile_type === v
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'border-slate-600 dark:border-slate-600 border-gray-300 text-slate-400 dark:text-slate-400 text-slate-600 hover:border-indigo-400'
                  }`}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={lbl}>Сүрөттөмө</label>
            <textarea className={`${inp} h-24 resize-none`} value={form.description}
              onChange={e => up('description', e.target.value)} placeholder="Вакансияны сүрөттөңүз..." required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={lbl}>WhatsApp</label><input className={inp} value={form.whatsapp} onChange={e => up('whatsapp', e.target.value)} placeholder="+996" /></div>
            <div><label className={lbl}>Телефон</label><input className={inp} value={form.phone} onChange={e => up('phone', e.target.value)} placeholder="+996" /></div>
          </div>
          <div><label className={lbl}>Дарек</label><input className={inp} value={form.address} onChange={e => up('address', e.target.value)} placeholder="Бишкек, Чүй проспектиси" /></div>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" checked={form.is_negotiable} onChange={e => up('is_negotiable', e.target.checked)} className="w-4 h-4 accent-indigo-500" />
            <span className="text-slate-300 dark:text-slate-300 text-slate-600 text-sm">Келишим боюнча</span>
          </label>
          {!form.is_negotiable && (
            <div className="grid grid-cols-2 gap-3">
              <div><label className={lbl}>Баадан</label><input type="number" className={inp} value={form.salary_from} onChange={e => up('salary_from', e.target.value)} placeholder="5000" /></div>
              <div><label className={lbl}>Баага чейин</label><input type="number" className={inp} value={form.salary_to} onChange={e => up('salary_to', e.target.value)} placeholder="15000" /></div>
            </div>
          )}
          <button type="submit" disabled={saving}
            className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl py-3.5 font-bold text-base transition-all shadow-lg disabled:opacity-60 mt-1">
            {saving ? 'Жарыяланууда...' : 'Жарыялоо →'}
          </button>
        </form>
      </div>
    </div>
  );
});

// ─── MY JOBS TAB ──────────────────────────────────────────────────────────────
function MyJobsTab({ showToast }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editJob, setEditJob] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const r = await api.get('/jobs/my/');
      setJobs(r.data);
    } catch { setJobs([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const handleDelete = async (job) => {
    if (!confirm('Вакансияны жок кылуу?')) return;
    try {
      await api.delete(`/jobs/${job.id}/`);
      showToast('Жок кылынды 🗑️');
      fetch();
    } catch { showToast('Ката болду'); }
  };

  const handleToggleActive = async (job) => {
    try {
      await api.patch(`/jobs/${job.id}/`, { active: !job.active });
      showToast(job.active ? 'Вакансия жашырылды 🙈' : 'Вакансия активдүү! 🟢');
      fetch();
    } catch { showToast('Ката болду'); }
  };

  return (
    <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 pb-4">
      {loading
        ? <div className="flex justify-center py-16"><Loader2 size={32} className="text-indigo-400 animate-spin" /></div>
        : jobs.length === 0
          ? <div className="text-center py-16 text-slate-500 text-sm">Вакансияңыз жок</div>
          : jobs.map(job => (
            <JobCard key={job.id} job={job} mode="my"
              onEdit={setEditJob} onDelete={handleDelete}
              onToggleActive={handleToggleActive} showToast={showToast} />
          ))
      }
      {editJob && (
        <EditModal job={editJob} onClose={() => setEditJob(null)} onSaved={fetch} showToast={showToast} />
      )}
    </div>
  );
}

// ─── SAVED TAB ────────────────────────────────────────────────────────────────
function SavedTab({ showToast }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const r = await api.get('/jobs/bookmarks/');
      setJobs(r.data.map(j => ({ ...j, is_bookmarked: true })));
    } catch { setJobs([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const handleBookmark = async (job) => {
    try {
      await api.post(`/jobs/${job.id}/bookmark/`);
      fetch();
      showToast('Сакталгандан өчүрүлдү');
    } catch {}
  };

  return (
    <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 pb-4">
      {loading
        ? <div className="flex justify-center py-16"><Loader2 size={32} className="text-indigo-400 animate-spin" /></div>
        : jobs.length === 0
          ? <div className="text-center py-16 text-slate-500 text-sm">Сакталган вакансия жок</div>
          : jobs.map(job => (
            <JobCard key={job.id} job={job} mode="saved" onBookmark={handleBookmark} showToast={showToast} />
          ))
      }
    </div>
  );
}

// ─── PROFILE TAB ──────────────────────────────────────────────────────────────
function ProfileTab({ showToast }) {
  const { user, logout, refreshUser, BASE_URL } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  const avatarUrl = user?.avatar
    ? (user.avatar.startsWith('http') ? user.avatar : `${BASE_URL}${user.avatar}`)
    : null;

  const handleAvatar = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const fd = new FormData();
    fd.append('avatar', f);
    try {
      await api.patch('/users/profile/', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      await refreshUser();
      showToast('Сүрөт жаңыланды! 📸');
    } catch { showToast('Ката болду'); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch('/users/profile/', { name, phone });
      await refreshUser();
      showToast('Сакталды ✅');
    } catch { showToast('Ката болду'); }
    finally { setSaving(false); }
  };

  const inp = "w-full bg-slate-900/60 dark:bg-slate-900/60 bg-gray-50 border border-indigo-500/30 dark:border-indigo-500/30 border-gray-200 rounded-xl px-4 py-2.5 text-white dark:text-white text-slate-800 focus:border-indigo-400 focus:outline-none transition-colors text-sm outline-none";

  return (
    <div className="overflow-y-auto p-4 pb-8">
      <h2 className="text-white dark:text-white text-slate-800 font-bold text-xl mb-5">Профиль</h2>
      <div className="bg-slate-800/60 dark:bg-slate-800/60 bg-white border border-indigo-500/30 dark:border-indigo-500/30 border-gray-200 rounded-3xl p-5 shadow-xl">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <button onClick={() => fileRef.current.click()} className="relative group">
            <div className="w-24 h-24 rounded-full bg-linear-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-4xl overflow-hidden border-2 border-indigo-400/50">
              {avatarUrl
                ? <img src={avatarUrl} className="w-full h-full object-cover" alt="" />
                : '👤'}
            </div>
            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Camera size={20} className="text-white" />
            </div>
          </button>
          <p className="text-slate-400 dark:text-slate-400 text-gray-500 text-xs mt-2">Сүрөтүңүздү өзгөртүү</p>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-3 mb-5">
          <div>
            <label className="block text-xs text-indigo-300 dark:text-indigo-300 text-indigo-700 mb-1.5 uppercase tracking-wide">Аты-жөнү</label>
            <input className={inp} value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-indigo-300 dark:text-indigo-300 text-indigo-700 mb-1.5 uppercase tracking-wide">Телефон</label>
            <input className={inp} value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[['Вакансиялар', user?.jobs_count || 0], ['Сакталган', user?.bookmarks_count || 0]].map(([label, count]) => (
            <div key={label} className="bg-slate-900/60 dark:bg-slate-900/60 bg-gray-50 rounded-2xl p-3 text-center border border-slate-700/50 dark:border-slate-700/50 border-gray-200">
              <div className="text-2xl font-bold text-indigo-400">{count}</div>
              <div className="text-xs text-slate-500 mt-1">{label}</div>
            </div>
          ))}
        </div>

        <button onClick={handleSave} disabled={saving}
          className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl py-3 font-bold transition-all disabled:opacity-60 mb-3">
          {saving ? 'Сакталуда...' : 'Сактоо'}
        </button>

        <button onClick={() => { if (confirm('Чыгышыңызды ырастайсызбы?')) logout(); }}
          className="w-full flex items-center justify-center gap-2 border border-red-500/50 hover:bg-red-500/10 text-red-400 rounded-xl py-3 font-medium transition-all">
          <LogOut size={16} /> Чыгуу
        </button>
      </div>
    </div>
  );
}

// ─── MAIN SCREEN ──────────────────────────────────────────────────────────────
export default function MainScreen() {
  const { user, logout, darkMode, toggleTheme } = useAuth();
  const [tab, setTab] = useState('search');
  const [toast, setToast] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  const showToast = useCallback((msg) => setToast(msg), []);

  const fetchJobs = useCallback(async (q = '') => {
    setLoadingJobs(true);
    try {
      const r = await api.get('/jobs/', q ? { params: { q } } : {});
      setJobs(r.data);
    } catch { setJobs([]); }
    finally { setLoadingJobs(false); }
  }, []);

  useEffect(() => {
    if (tab === 'search') fetchJobs();
  }, [tab, fetchJobs]);

  const handleBookmark = useCallback(async (job) => {
    try {
      const r = await api.post(`/jobs/${job.id}/bookmark/`);
      setJobs(prev => prev.map(j =>
        j.id === job.id ? { ...j, is_bookmarked: r.data.bookmarked } : j
      ));
      showToast(r.data.bookmarked ? 'Сакталды ⭐' : 'Сакталгандан өчүрүлдү');
    } catch { showToast('Катталыңыз'); }
  }, [showToast]);

  const handleRate = useCallback(async (id, score) => {
    try {
      await api.post(`/jobs/${id}/rate/`, { score });
      showToast(`Баа берилди: ${score}/5 ⭐`);
      fetchJobs();
    } catch { showToast('Катталыңыз'); }
  }, [showToast, fetchJobs]);

  const TABS = [
    { id: 'search', icon: Search, label: 'Издөө' },
    { id: 'post', icon: Plus, label: 'Жарыялоо' },
    { id: 'my', icon: Briefcase, label: 'Менин' },
    { id: 'saved', icon: Bookmark, label: 'Сакталган' },
    { id: 'profile', icon: User, label: 'Профиль' },
  ];

  return (
    <div className="h-screen flex flex-col bg-linear-to-br dark:from-slate-950 dark:via-indigo-950 dark:to-slate-900 from-gray-50 via-white to-gray-100 transition-colors duration-300">
      <Toast message={toast} onHide={() => setToast('')} />

      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b dark:border-indigo-500/20 border-gray-200 dark:bg-slate-900/80 bg-white/90 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-2">
          <Briefcase size={20} className="text-emerald-400" />
          <span className="font-extrabold text-lg">
            <span className="dark:text-white text-slate-800">Jumush</span>
            <span className="text-emerald-400">Tap</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium dark:text-slate-300 text-slate-600 hidden sm:block">{user?.name}</span>
          <button onClick={toggleTheme}
            className="p-2 rounded-xl dark:bg-slate-800 bg-gray-100 dark:text-slate-300 text-slate-600 hover:text-indigo-500 transition-colors"
            title={darkMode ? 'Жарык режим' : 'Караңгы режим'}>
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button onClick={() => { if (confirm('Чыгуу?')) logout(); }}
            className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Tab bar */}
      <div className="flex items-center justify-around px-1 py-1.5 border-b dark:border-indigo-500/20 border-gray-200 dark:bg-slate-900/60 bg-white shrink-0">
        {TABS.map(({ id, icon: Icon, label }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex flex-col items-center gap-0.5 flex-1 py-1.5 rounded-xl transition-all ${
              tab === id
                ? 'text-indigo-400'
                : 'dark:text-slate-500 text-slate-400 dark:hover:text-slate-300 hover:text-slate-600'
            }`}>
            <div className={`p-1.5 rounded-xl transition-all ${
              tab === id
                ? 'bg-indigo-500/20'
                : 'bg-transparent'
            }`}>
              <Icon size={18} strokeWidth={tab === id ? 2.5 : 1.8} />
            </div>
            <span className="text-[10px] font-medium leading-none">{label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col fade-in">
        {tab === 'search' && (
          <SearchTab jobs={jobs} loading={loadingJobs} onSearch={fetchJobs}
            onBookmark={handleBookmark} onRate={handleRate} showToast={showToast} />
        )}
        {tab === 'post' && (
          <PostTab showToast={showToast} onPosted={() => { setTab('search'); fetchJobs(); }} />
        )}
        {tab === 'my' && <MyJobsTab showToast={showToast} />}
        {tab === 'saved' && <SavedTab showToast={showToast} />}
        {tab === 'profile' && <ProfileTab showToast={showToast} />}
      </div>
    </div>
  );
}
