import { useState, useEffect, useCallback } from 'react';
import { api } from '../context/AuthContext';

export function useJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = useCallback(async (q = '') => {
    try {
      const r = await api.get('/jobs/', q ? { params: { q } } : {});
      setJobs(r.data);
    } catch {
      // Fallback to localStorage jobs
      const local = JSON.parse(localStorage.getItem('sw_jobs') || '[]');
      setJobs(local);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchJobs(); }, []);

  return { jobs, setJobs, loading, fetchJobs };
}
