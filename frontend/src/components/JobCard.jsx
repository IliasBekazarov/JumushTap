import { useState, memo } from 'react';
import {
  MessageCircle, Phone, Share2, Bookmark, BookmarkCheck,
  Star, Eye, Pencil, Trash2, ToggleLeft, ToggleRight, X, Copy,
} from 'lucide-react';
import { useAuth, api } from '../context/AuthContext';

function StarRating({ rating = 0, jobId, onRate, readonly = false }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <button key={i}
          onClick={() => !readonly && onRate?.(jobId, i)}
          className={readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition-transform'}>
          <Star size={13}
            className={i <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'} />
        </button>
      ))}
    </div>
  );
}

function ShareModal({ job, onClose }) {
  const siteUrl = window.location.origin;
  const salary = job.is_negotiable
    ? 'Договорная'
    : `${(job.salary_from || 0).toLocaleString()} - ${(job.salary_to || 0).toLocaleString()} сом`;
  const text = `👋 JumushTap'та жакшы вакансия бар!\n\n🔥 ${job.description}\n\n💰 ${salary}\n\n📍 ${job.address || ''}\n\n📱 ${job.phone || ''}\n\n🔗 ${siteUrl}`;
  const waNum = (job.whatsapp || job.phone || '').replace(/\D/g, '');

  const copy = () => navigator.clipboard.writeText(text).then(() => alert('Скопировано! 📋'));

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="dark:bg-slate-800 bg-white border dark:border-indigo-500/50 border-gray-200 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
        onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold dark:text-white text-slate-800 text-lg">Бөлүшүү</h3>
          <button onClick={onClose}><X size={18} className="dark:text-slate-400 text-gray-500 hover:text-red-400" /></button>
        </div>
        <div className="flex flex-col gap-3">
          <a href={`https://wa.me/?text=${encodeURIComponent(text)}`} target="_blank" rel="noreferrer"
            className="flex items-center gap-3 bg-green-600 hover:bg-green-500 text-white rounded-xl px-4 py-3 font-medium transition-colors">
            <MessageCircle size={18} /> WhatsApp аркылуу жөнөтүү
          </a>
          <a href={`https://t.me/share/url?url=${encodeURIComponent(siteUrl)}&text=${encodeURIComponent(text)}`} target="_blank" rel="noreferrer"
            className="flex items-center gap-3 bg-blue-500 hover:bg-blue-400 text-white rounded-xl px-4 py-3 font-medium transition-colors">
            <Share2 size={18} /> Telegram
          </a>
          <button onClick={copy}
            className="flex items-center gap-3 dark:bg-slate-700 bg-gray-100 dark:hover:bg-slate-600 hover:bg-gray-200 dark:text-white text-slate-700 rounded-xl px-4 py-3 font-medium transition-colors">
            <Copy size={18} /> Текст көчүрүү
          </button>
        </div>
      </div>
    </div>
  );
}

const JobCard = memo(function JobCard({ job, mode = 'search', onBookmark, onDelete, onEdit, onToggleActive, onRate, showToast }) {
  const { BASE_URL } = useAuth();
  const [shareOpen, setShareOpen] = useState(false);

  const waNum = (job.whatsapp || '').replace(/\D/g, '');
  const phNum = (job.phone || '').replace(/\D/g, '');
  const avatarUrl = job.user?.avatar
    ? (job.user.avatar.startsWith('http') ? job.user.avatar : `${BASE_URL}${job.user.avatar}`)
    : null;
  const isInactive = job.active === false;

  const handleView = async () => {
    try { await api.get(`/jobs/${job.id}/`); } catch {}
  };

  return (
    <>
      <div
        onClick={handleView}
        className={`card-enter dark:bg-slate-800/60 bg-white border-2 ${
          isInactive
            ? 'dark:border-slate-600/40 border-gray-200 opacity-60'
            : 'dark:border-indigo-400/50 border-indigo-200 hover:dark:border-indigo-300/70 hover:border-indigo-400'
        } rounded-3xl p-3 sm:p-5 hover:shadow-2xl hover:dark:shadow-indigo-500/15 hover:shadow-indigo-200/50 transition-all`}
      >
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0 overflow-hidden">
            {avatarUrl
              ? <img src={avatarUrl} className="w-full h-full object-cover" alt="" />
              : (job.user?.name?.[0]?.toUpperCase() || '?')}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold dark:text-white text-slate-800 text-sm">
                {job.user?.name || job.user_name}
              </span>
              <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full">
                {(job.profile_type === 'employer' || job.user_role === 'employer')
                  ? '🏢 Иш берүүчү' : '🔍 Иш издейт'}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-0.5 text-xs dark:text-slate-400 text-slate-500 flex-wrap">
              {job.address && <span>📍 {job.address}</span>}
              {job.expires_at && <span>📅 {job.expires_at}</span>}
            </div>
          </div>

          {/* Bookmark */}
          {(mode === 'search' || mode === 'saved') && (
            <button onClick={e => { e.stopPropagation(); onBookmark?.(job); }}
              className="dark:text-slate-400 text-gray-400 hover:text-indigo-400 transition-colors shrink-0">
              {job.is_bookmarked
                ? <BookmarkCheck size={18} className="text-indigo-400" />
                : <Bookmark size={18} />}
            </button>
          )}

          {/* My jobs controls */}
          {mode === 'my' && (
            <div className="flex items-center gap-1.5 shrink-0">
              <button onClick={e => { e.stopPropagation(); onToggleActive?.(job); }}
                className="dark:text-slate-400 text-gray-400 hover:text-green-400 transition-colors"
                title={isInactive ? 'Активдештирүү' : 'Жашыруу'}>
                {isInactive
                  ? <ToggleLeft size={18} />
                  : <ToggleRight size={18} className="text-green-400" />}
              </button>
              <button onClick={e => { e.stopPropagation(); onEdit?.(job); }}
                className="dark:text-slate-400 text-gray-400 hover:text-indigo-400 transition-colors">
                <Pencil size={16} />
              </button>
              <button onClick={e => { e.stopPropagation(); onDelete?.(job); }}
                className="dark:text-slate-400 text-gray-400 hover:text-red-400 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="dark:text-slate-200 text-slate-700 text-sm leading-relaxed mb-3 line-clamp-3">
          {job.description}
        </p>

        {/* Salary */}
        <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-400/20 rounded-xl px-3 py-1.5 mb-3">
          <span className="text-xs dark:text-slate-400 text-slate-500">Маяна:</span>
          <span className="text-sm font-semibold text-indigo-400">
            {(job.is_negotiable || job.price_negotiable)
              ? 'Договорная'
              : `${(job.salary_from || job.price_from || 0).toLocaleString()} – ${(job.salary_to || job.price_to || 0).toLocaleString()} сом`}
          </span>
        </div>

        {/* Rating & views */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs dark:text-slate-500 text-gray-400">Баа:</span>
            <StarRating rating={job.avg_rating || job.rating || 0} jobId={job.id}
              onRate={onRate} readonly={mode !== 'search'} />
          </div>
          <div className="flex items-center gap-1 text-xs dark:text-slate-500 text-gray-400">
            <Eye size={12} />
            <span>{job.views_count || job.views || 0} көрүлдү</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {waNum && (
            <a href={`https://wa.me/${waNum}`} target="_blank" rel="noreferrer"
              onClick={e => e.stopPropagation()}
              className="flex items-center gap-1.5 bg-green-600/80 hover:bg-green-500 text-white text-xs font-medium px-3 py-2 rounded-xl transition-colors">
              <MessageCircle size={14} /> WA
            </a>
          )}
          {phNum && (
            <a href={`tel:${job.phone}`} onClick={e => e.stopPropagation()}
              className="flex items-center gap-1.5 bg-blue-600/80 hover:bg-blue-500 text-white text-xs font-medium px-3 py-2 rounded-xl transition-colors">
              <Phone size={14} /> Чалуу
            </a>
          )}
          <button onClick={e => { e.stopPropagation(); setShareOpen(true); }}
            className="flex items-center gap-1.5 bg-purple-600/80 hover:bg-purple-500 text-white text-xs font-medium px-3 py-2 rounded-xl transition-colors">
            <Share2 size={14} /> Бөлүшүү
          </button>
        </div>
      </div>

      {shareOpen && <ShareModal job={job} onClose={() => setShareOpen(false)} />}
    </>
  );
});

export default JobCard;
