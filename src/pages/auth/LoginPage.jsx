import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import authService from '../../services/authService';
import { getApiErrorMessage } from '../../utils/apiError';

function getLoginError(error) {
  return getApiErrorMessage(error, 'ورود انجام نشد. دوباره تلاش کنید.', {
    400: 'اطلاعات ورود معتبر نیست.',
    401: 'نام کاربری یا رمز عبور نادرست است.',
    403: 'حساب شما اجازه ورود به این بخش را ندارد.',
  });
}

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { isAuthenticated, login } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to="/tickets" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const normalizedIdentifier = identifier.trim();
    if (!normalizedIdentifier || !password) {
      setError('نام کاربری و رمز عبور را وارد کنید.');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const loginResponse = await authService.login(normalizedIdentifier, password);
      login(loginResponse);
      const destination = location.state?.from?.pathname;
      navigate(destination && destination !== '/login' ? destination : '/tickets', { replace: true });
    } catch (requestError) {
      setError(getLoginError(requestError));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main dir="rtl" className="login-page relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="login-glow login-glow-accent absolute -right-32 -top-32 h-96 w-96 rounded-full blur-3xl" />
      <div className="login-glow login-glow-info absolute -bottom-40 -left-32 h-96 w-96 rounded-full blur-3xl" />

      <button
        type="button"
        className={`theme-toggle login-theme-toggle${isDark ? ' dark' : ''}`}
        onClick={toggleTheme}
        role="switch"
        aria-checked={!isDark}
        aria-label={isDark ? 'فعال کردن حالت روشن' : 'فعال کردن حالت تاریک'}
        title={isDark ? 'حالت روشن' : 'حالت تاریک'}
      >
        <i className="fas fa-sun" aria-hidden="true" />
        <i className="fas fa-moon" aria-hidden="true" />
        <span className="theme-toggle-thumb" />
      </button>

      <section className="login-card relative w-full max-w-md rounded-2xl p-7 backdrop-blur-xl sm:p-9">
        <div className="mb-8 text-center">
          <div className="login-brand-icon mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-xl text-white shadow-lg">
            <i className="fas fa-layer-group" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-extrabold">ورود به پنل مدیریت تیم</h1>
          <p className="login-subtitle mt-2 text-sm">برای ادامه، اطلاعات حساب کاربری خود را وارد کنید.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <label className="block">
            <span className="login-label mb-2 block text-sm font-semibold">ایمیل یا نام کاربری</span>
            <div className="login-field flex items-center gap-3 rounded-xl border px-4 transition">
              <i className="login-field-icon fas fa-user text-sm" aria-hidden="true" />
              <input
                className="login-input h-12 w-full bg-transparent text-sm outline-none"
                autoComplete="username"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                placeholder="manager"
                disabled={isLoading}
              />
            </div>
          </label>

          <div className="block">
            <label htmlFor="login-password" className="login-label mb-2 block text-sm font-semibold">رمز عبور</label>
            <div className="login-field flex items-center gap-3 rounded-xl border px-4 transition">
              <i className="login-field-icon fas fa-lock text-sm" aria-hidden="true" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="login-input h-12 w-full bg-transparent text-sm outline-none"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="رمز عبور"
                disabled={isLoading}
              />
              <button
                type="button"
                className="login-password-toggle flex h-9 w-9 shrink-0 items-center justify-center transition focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? 'پنهان کردن رمز عبور' : 'نمایش رمز عبور'}
                aria-pressed={showPassword}
                title={showPassword ? 'پنهان کردن رمز عبور' : 'نمایش رمز عبور'}
                disabled={isLoading}
              >
                <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'} aria-hidden="true" />
              </button>
            </div>
          </div>

          {error && (
            <div role="alert" className="login-error flex items-start gap-2 rounded-xl border px-4 py-3 text-sm">
              <i className="fas fa-circle-exclamation mt-0.5" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="login-submit flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold text-white shadow-lg transition focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            <i className={isLoading ? 'fas fa-spinner fa-spin' : 'fas fa-right-to-bracket'} aria-hidden="true" />
            {isLoading ? 'در حال ورود...' : 'ورود به پنل'}
          </button>
        </form>
      </section>
    </main>
  );
}
