import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  FaLock, FaEnvelope, FaEye, FaEyeSlash,
  FaExclamationCircle, FaSpinner, FaShieldAlt, FaArrowLeft, FaCheckCircle,
} from 'react-icons/fa';

interface FormErrors {
  email?: string;
  password?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AdminLogin() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState('');
  const [focused, setFocused] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/admin/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!email.trim()) errs.email = 'Email is required';
    else if (!EMAIL_REGEX.test(email)) errs.email = 'Enter a valid email address';

    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin/dashboard', { replace: true });
    } catch (err: any) {
      setServerError(
        err.response?.data?.error || 'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: keyof FormErrors) =>
    `w-full pl-11 pr-11 py-3 rounded-xl border bg-white/5 text-white placeholder-gray-500 focus:outline-none transition-all duration-200 ${
      errors[field]
        ? 'border-red-500 ring-2 ring-red-500/20'
        : focused === field
        ? 'border-[#ff0000] ring-2 ring-[#ff0000]/20'
        : 'border-white/10 hover:border-white/20'
    }`;

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-20">
      {/* Animated background orbs */}
      <motion.div
        className="pointer-events-none absolute top-1/4 -left-40 w-[26rem] h-[26rem] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,0,0,0.15) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        animate={{ x: [0, 60, -40, 0], y: [0, -40, 50, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-1/4 -right-40 w-[26rem] h-[26rem] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,80,80,0.12) 0%, transparent 70%)',
          filter: 'blur(90px)',
        }}
        animate={{ x: [0, -50, 40, 0], y: [0, 40, -30, 0] }}
        transition={{ duration: 26, delay: 1, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#ff0000]/30 bg-[#ff0000]/5 backdrop-blur-sm">
            <FaShieldAlt className="text-[#ff0000] text-xs" />
            <span className="text-xs font-medium text-gray-300 tracking-wide">
              Secure Admin Access
            </span>
          </div>
        </motion.div>

        {/* Card */}
        <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 sm:p-10 shadow-2xl overflow-hidden">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff0000] to-transparent" />

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Welcome <span className="text-[#ff0000]">Back</span>
            </h1>
            <p className="text-sm text-gray-400">
              Sign in to manage your portfolio
            </p>
          </div>

          {/* Server error */}
          {serverError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-start gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30"
            >
              <FaExclamationCircle className="text-red-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-300">{serverError}</div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: undefined });
                    if (serverError) setServerError('');
                  }}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={inputClass('email')}
                />
                {email && !errors.email && EMAIL_REGEX.test(email) && (
                  <FaCheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 text-sm" />
                )}
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-xs mt-1.5 flex items-center gap-1"
                >
                  <FaExclamationCircle className="text-[10px]" /> {errors.email}
                </motion.p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: undefined });
                    if (serverError) setServerError('');
                  }}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={inputClass('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                </button>
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-xs mt-1.5 flex items-center gap-1"
                >
                  <FaExclamationCircle className="text-[10px]" /> {errors.password}
                </motion.p>
              )}
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.99 }}
              className={`w-full py-3.5 mt-2 bg-gradient-to-r from-[#ff0000] to-[#cc0000] text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2.5 shadow-lg shadow-transparent ${
                loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-[#ff0000]/40'
              }`}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <FaLock className="text-sm" />
                  Sign In
                </>
              )}
            </motion.button>
          </form>

          {/* Footer of card */}
          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#ff0000] transition-colors group"
            >
              <FaArrowLeft className="text-xs transition-transform group-hover:-translate-x-0.5" />
              Back to portfolio
            </Link>
          </div>
        </div>

        {/* Bottom hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-xs text-gray-500 mt-6"
        >
          <span className="text-[#ff0000]">●</span> Authorized personnel only
        </motion.p>
      </motion.div>
    </div>
  );
}