import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authenticateUser, validateRegistrationCode } from '../services/auth';
import { useAuthStore } from '../stores/authStore';
import { Lock, Mail, AlertCircle, KeyRound } from 'lucide-react';
import Logo from '../components/layout/Logo';

const Login = () => {
  const [mode, setMode] = useState<'login' | 'code'>('login');
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [registrationCode, setRegistrationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await authenticateUser(credentials);
      if (user) {
        login(user);
        navigate('/dashboard');
      } else {
        setError('Credenciales inválidas');
      }
    } catch (err) {
      setError('Error al intentar acceder');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await validateRegistrationCode(registrationCode);
      if (result.valid) {
        navigate('/register', { 
          state: { 
            code: registrationCode,
            role: result.role,
            network: result.network,
            center: result.center
          } 
        });
      } else {
        setError('Código de registro inválido o expirado');
      }
    } catch (err) {
      setError('Error al validar el código');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <Logo className="mx-auto h-20 w-auto" />
              <h2 className="mt-4 text-2xl font-bold text-gray-900">
              Red de Innovación FP
              </h2>
              <p className="mt-2 text-sm text-gray-600">
              Accede a tu cuenta o regístrate
              </p>
            </div>

          {mode === 'login' ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      value={credentials.email}
                      onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                      className="pl-10 appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder="Email"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      id="password"
                      type="password"
                      value={credentials.password}
                      onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                      className="pl-10 appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder="Contraseña"
                      required
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {loading ? 'Accediendo...' : 'Acceder'}
                </button>
              </div>
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => setMode('code')}
                  className="inline-flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-500 hover:underline"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>¿Tienes un código de registro?</span>
                </button>
              </div>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleCodeSubmit}>
              <div>
                <label htmlFor="code" className="sr-only">
                  Código de Registro
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="code"
                    type="text"
                    value={registrationCode}
                    onChange={(e) => setRegistrationCode(e.target.value)}
                    className="pl-10 appearance-none block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Introduce tu código de registro"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {loading ? 'Validando...' : 'Validar Código'}
                </button>
              </div>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-sm text-blue-600 hover:text-blue-500 hover:underline"
                >
                  Volver al inicio de sesión
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      
      {/* Right side - Image */}
      <div className="hidden lg:block lg:w-1/2 bg-cover bg-center" style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070")'
      }}>
        <div className="h-full w-full bg-blue-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-12">
          <div className="text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Únete a la Red</h2>
            <p className="text-lg">
              Forma parte de la comunidad de innovación en formación profesional
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;