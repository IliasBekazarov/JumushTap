import { AuthProvider, useAuth } from './context/AuthContext';
import RegisterScreen from './screens/RegisterScreen';
import MainScreen from './screens/MainScreen';
import { Loader2 } from 'lucide-react';

function Root() {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="h-screen bg-slate-950 flex items-center justify-center">
      <Loader2 size={40} className="text-indigo-400 animate-spin" />
    </div>
  );
  return user ? <MainScreen /> : <RegisterScreen />;
}

export default function App() {
  return (
    <AuthProvider>
      <Root />
    </AuthProvider>
  );
}
