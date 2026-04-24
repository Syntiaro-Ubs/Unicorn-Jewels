import { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
const logoImg = "https://images.unsplash.com/photo-1610187390406-9d24b55ea697?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdmFudCUyMGdhcmRlJTIwbG9nbyUyMGpld2VscnklMjBicmFuZHxlbnwxfHx8fDE3NzY3NjUzMzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const logoImage = "/images/unicorn-logo.svg";
import { ImageWithFallback } from './figma/ImageWithFallback';
export function LoginPage({
  onBack,
  onGoToSignup,
  onSuccess
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focused, setFocused] = useState(null);
  const [errors, setErrors] = useState({});
  const validate = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  return <div className="min-h-screen flex bg-white" style={{
    fontFamily: "'Cormorant Garamond', serif"
  }}>
      {/* Left Panel — full logo */}
      <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      duration: 1.2
    }} className="hidden lg:flex lg:w-[42%] relative overflow-hidden flex-col">
        {/* Logo fills the entire panel */}
        <img src={logoImg} alt="Unicorn Jewels" className="absolute inset-0 w-full h-full object-cover" />

        {/* Back Button */}
        <button onClick={onBack} className="relative z-10 flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-300 mt-10 ml-10 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="text-xs tracking-[0.2em] uppercase">Back to Site</span>
        </button>
      </motion.div>

      {/* Right Form Panel */}
      <div className="flex-1 flex flex-col">
        {/* Mobile back button */}
        <div className="lg:hidden flex items-center justify-between px-8 pt-8 pb-4 border-b border-gray-100">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="text-xs tracking-[0.2em] uppercase">Back</span>
          </button>
          <div className="flex-shrink-0">
            <ImageWithFallback src={logoImage} alt="Unicorn Jewels Logo" className="h-12 md:h-14 w-auto object-contain" />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-8 sm:px-16 lg:px-20 xl:px-32 py-16">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: 0.2
        }} className="w-full max-w-md">
            {/* Header */}
            <div className="mb-14">
              <span className="text-[10px] tracking-[0.4em] uppercase text-gray-400 block mb-4">
                Client Access
              </span>
              <h2 className="text-5xl text-black mb-4" style={{
              fontWeight: 300,
              letterSpacing: '0.03em'
            }}>
                Welcome Back
              </h2>
              <div className="w-8 h-[1px] bg-gray-300 mt-6" />
            </div>

            {/* Form */}
            <form className="space-y-8" onSubmit={e => {
            e.preventDefault();
            if (validate() && onSuccess) {
              onSuccess(email[0].toUpperCase());
            }
          }}>
              {/* Email */}
              <div className="relative">
                <label className={`absolute left-0 transition-all duration-300 pointer-events-none ${focused === 'email' || email ? '-top-5 text-[10px] tracking-[0.25em]' : 'top-3 text-base'} ${errors.email ? 'text-red-500' : 'text-gray-400'}`} style={{
                fontWeight: 300,
                letterSpacing: focused === 'email' || email ? '0.25em' : '0.05em'
              }}>
                  {focused === 'email' || email ? 'EMAIL ADDRESS' : 'Email Address'}
                </label>
                <input type="email" value={email} onChange={e => {
                setEmail(e.target.value);
                if (errors.email) setErrors({
                  ...errors,
                  email: undefined
                });
              }} onFocus={() => setFocused('email')} onBlur={() => setFocused(null)} className={`w-full bg-transparent border-0 border-b pb-3 pt-3 text-base outline-none focus:outline-none transition-colors duration-300 ${errors.email ? 'text-red-500' : 'text-black'}`} style={{
                borderBottomWidth: '1px',
                borderBottomColor: errors.email ? '#ef4444' : focused === 'email' ? '#000' : '#d1d5db',
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300
              }} />
                {errors.email && <motion.p initial={{
                opacity: 0,
                y: -5
              }} animate={{
                opacity: 1,
                y: 0
              }} className="absolute -bottom-5 left-0 text-[10px] text-red-500 tracking-wider">
                    {errors.email}
                  </motion.p>}
              </div>

              {/* Password */}
              <div className="relative mt-10">
                <label className={`absolute left-0 transition-all duration-300 pointer-events-none ${focused === 'password' || password ? '-top-5 text-[10px] tracking-[0.25em]' : 'top-3 text-base'} ${errors.password ? 'text-red-500' : 'text-gray-400'}`} style={{
                fontWeight: 300,
                letterSpacing: focused === 'password' || password ? '0.25em' : '0.05em'
              }}>
                  {focused === 'password' || password ? 'PASSWORD' : 'Password'}
                </label>
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => {
                setPassword(e.target.value);
                if (errors.password) setErrors({
                  ...errors,
                  password: undefined
                });
              }} onFocus={() => setFocused('password')} onBlur={() => setFocused(null)} className={`w-full bg-transparent border-0 border-b pb-3 pt-3 text-base outline-none focus:outline-none pr-10 transition-colors duration-300 ${errors.password ? 'text-red-500' : 'text-black'}`} style={{
                borderBottomWidth: '1px',
                borderBottomColor: errors.password ? '#ef4444' : focused === 'password' ? '#000' : '#d1d5db',
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300
              }} />
                {errors.password && <motion.p initial={{
                opacity: 0,
                y: -5
              }} animate={{
                opacity: 1,
                y: 0
              }} className="absolute -bottom-5 left-0 text-[10px] text-red-500 tracking-wider">
                    {errors.password}
                  </motion.p>}
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 top-3 text-gray-400 hover:text-gray-700 transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <button type="button" className="text-xs tracking-[0.15em] uppercase text-gray-400 hover:text-black transition-colors duration-300 border-b border-transparent hover:border-gray-300 pb-0.5" style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300
              }}>
                  Forgot Password?
                </button>
              </div>

              {/* Sign In Button */}
              <motion.button whileHover={{
              backgroundColor: '#1a1a1a'
            }} whileTap={{
              scale: 0.99
            }} type="submit" className="w-full bg-black text-white py-4 tracking-[0.25em] uppercase text-xs transition-colors duration-300 mt-4" style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 400
            }}>
                Sign In
              </motion.button>

              {/* Divider */}
              <div className="flex items-center gap-6 py-2">
                <div className="flex-1 h-[0.5px] bg-gray-200" />
                <span className="text-[10px] tracking-[0.2em] text-gray-300 uppercase">or</span>
                <div className="flex-1 h-[0.5px] bg-gray-200" />
              </div>

              {/* Guest Access */}
              <div className="space-y-3">
                <button type="button" className="w-full border border-gray-200 text-black py-4 tracking-[0.2em] uppercase text-xs hover:border-gray-400 hover:bg-gray-50 transition-all duration-300" style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300
              }}>
                  Continue as Guest
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-14 text-center">
              <p className="text-sm text-gray-400" style={{
              fontWeight: 300
            }}>
                New to Unicorn Jewels?{' '}
                <button onClick={onGoToSignup} className="text-black border-b border-gray-300 hover:border-black transition-colors duration-300 pb-0.5" style={{
                fontWeight: 400
              }}>
                  Create an Account
                </button>
              </p>
              <p className="text-[10px] tracking-[0.15em] text-gray-300 uppercase mt-8">
                Private Client? Call 1·800·UNICORN
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>;
}