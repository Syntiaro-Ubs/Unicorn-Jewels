import { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, ArrowLeft, Diamond, Check } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
const logoImage = "/images/unicorn-logo.svg";
const SIGNUP_IMAGE = "https://images.unsplash.com/photo-1560233144-905d47165782?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHdlYXJpbmclMjBwZWFybCUyMG5lY2tsYWNlJTIwZWxlZ2FudCUyMHBvcnRyYWl0JTIwZGFya3xlbnwxfHx8fDE3NzQyNDQ5MDh8MA&ixlib=rb-4.1.0&q=80&w=1080";
const perks = ['Early access to exclusive collections', 'Complimentary engraving on first order', 'Personalised styling consultations'];
export function SignUpPage({
  onBack,
  onGoToLogin,
  onSuccess
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [fields, setFields] = useState({
    firstName: {
      value: '',
      focused: false
    },
    lastName: {
      value: '',
      focused: false
    },
    email: {
      value: '',
      focused: false
    },
    password: {
      value: '',
      focused: false
    }
  });
  const [errors, setErrors] = useState({});
  const validate = () => {
    const newErrors = {};
    if (!fields.firstName.value.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!fields.lastName.value.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!fields.email.value) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.value)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!fields.password.value) {
      newErrors.password = 'Password is required';
    } else if (fields.password.value.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (!agreed) {
      newErrors.agreed = 'You must agree to the Terms of Service';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const updateField = (key, value) => {
    setFields(f => ({
      ...f,
      [key]: {
        ...f[key],
        value
      }
    }));
    if (errors[key]) {
      setErrors(prev => {
        const newErrs = {
          ...prev
        };
        delete newErrs[key];
        return newErrs;
      });
    }
  };
  const setFocus = (key, focused) => setFields(f => ({
    ...f,
    [key]: {
      ...f[key],
      focused
    }
  }));
  const isFloating = key => fields[key].focused || fields[key].value.length > 0;
  const inputStyle = key => ({
    borderBottomWidth: '1px',
    borderBottomColor: errors[key] ? '#ef4444' : fields[key].focused ? '#000' : '#d1d5db',
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 300
  });
  const labelClass = key => `absolute left-0 transition-all duration-300 pointer-events-none ${isFloating(key) ? '-top-5 text-[10px] tracking-[0.25em]' : 'top-3 text-base'} ${errors[key] ? 'text-red-500' : 'text-gray-400'}`;
  return <div className="min-h-screen flex bg-white" style={{
    fontFamily: "'Cormorant Garamond', serif"
  }}>
      {/* Left Editorial Panel */}
      <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      duration: 1.2
    }} className="hidden lg:flex lg:w-[42%] relative overflow-hidden flex-col">
        {/* Background Image */}
        <div className="absolute inset-0">
          <ImageWithFallback src={SIGNUP_IMAGE} alt="Unicorn Jewels Editorial Portrait" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/75" />
        </div>

        {/* Back button */}
        <button onClick={onBack} className="relative z-10 flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-300 mt-10 ml-10 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="text-xs tracking-[0.2em] uppercase">Back to Site</span>
        </button>

        {/* Brand Identity */}
        <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-12">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-8 h-[0.5px] bg-white/50" />
            <Diamond size={14} className="text-white/60" />
            <div className="w-8 h-[0.5px] bg-white/50" />
          </div>
          <h1 className="text-5xl text-white mb-4" style={{
          fontWeight: 300,
          letterSpacing: '0.15em'
        }}>
            UNICORN
          </h1>
          <h2 className="text-2xl text-white/80 mb-12 tracking-[0.35em]" style={{
          fontWeight: 300
        }}>
            JEWELS
          </h2>

          {/* Membership Perks */}
          <div className="w-full max-w-[240px] space-y-5">
            {perks.map((perk, i) => <motion.div key={perk} initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.6,
            delay: 0.4 + i * 0.15
          }} className="flex items-start gap-3 text-left">
                <div className="mt-1 w-4 h-4 rounded-full border border-white/30 flex items-center justify-center flex-shrink-0">
                  <Check size={9} className="text-white/70" />
                </div>
                <p className="text-white/60 text-sm" style={{
              fontWeight: 300,
              lineHeight: 1.5
            }}>
                  {perk}
                </p>
              </motion.div>)}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 px-12 pb-12 text-center">
          <div className="w-8 h-[0.5px] bg-white/30 mx-auto mb-6" />
          <p className="text-white/40 text-[10px] tracking-[0.25em] uppercase" style={{
          fontWeight: 300
        }}>
            Est. in the Atelier — Timeless
          </p>
        </div>
      </motion.div>

      {/* Right Form Panel */}
      <div className="flex-1 flex flex-col">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-8 pt-8 pb-4 border-b border-gray-100">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="text-xs tracking-[0.2em] uppercase">Back</span>
          </button>
          <div className="flex-shrink-0">
            <ImageWithFallback src={logoImage} alt="Unicorn Jewels Logo" className="h-12 md:h-14 w-auto object-contain" />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-8 sm:px-16 lg:px-20 xl:px-32 py-12">
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
            <div className="mb-12">
              <span className="text-[10px] tracking-[0.4em] uppercase text-gray-400 block mb-4">
                Membership
              </span>
              <h2 className="text-5xl text-black mb-4 leading-tight" style={{
              fontWeight: 300,
              letterSpacing: '0.02em'
            }}>
                Join the Circle
              </h2>
              <p className="text-base text-gray-400 mt-3" style={{
              fontWeight: 300,
              lineHeight: 1.6
            }}>
                Become a member of the Unicorn Jewels inner world.
              </p>
              <div className="w-8 h-[1px] bg-gray-300 mt-6" />
            </div>

            {/* Form */}
            <form className="space-y-8" onSubmit={e => {
            e.preventDefault();
            if (validate() && onSuccess) {
              onSuccess(fields.firstName.value ? fields.firstName.value[0].toUpperCase() : 'U');
            }
          }}>
              {/* Name Row */}
              <div className="grid grid-cols-2 gap-8">
                <div className="relative">
                  <label className={labelClass('firstName')} style={{
                  fontWeight: 300,
                  letterSpacing: isFloating('firstName') ? '0.25em' : '0.05em'
                }}>
                    {isFloating('firstName') ? 'FIRST NAME' : 'First Name'}
                  </label>
                  <input type="text" value={fields.firstName.value} onChange={e => updateField('firstName', e.target.value)} onFocus={() => setFocus('firstName', true)} onBlur={() => setFocus('firstName', false)} className={`w-full bg-transparent border-0 border-b pb-3 pt-3 text-base outline-none focus:outline-none transition-colors duration-300 ${errors.firstName ? 'text-red-500' : 'text-black'}`} style={inputStyle('firstName')} />
                  {errors.firstName && <motion.p initial={{
                  opacity: 0,
                  y: -5
                }} animate={{
                  opacity: 1,
                  y: 0
                }} className="absolute -bottom-5 left-0 text-[10px] text-red-500 tracking-wider">
                      {errors.firstName}
                    </motion.p>}
                </div>
                <div className="relative">
                  <label className={labelClass('lastName')} style={{
                  fontWeight: 300,
                  letterSpacing: isFloating('lastName') ? '0.25em' : '0.05em'
                }}>
                    {isFloating('lastName') ? 'LAST NAME' : 'Last Name'}
                  </label>
                  <input type="text" value={fields.lastName.value} onChange={e => updateField('lastName', e.target.value)} onFocus={() => setFocus('lastName', true)} onBlur={() => setFocus('lastName', false)} className={`w-full bg-transparent border-0 border-b pb-3 pt-3 text-base outline-none focus:outline-none transition-colors duration-300 ${errors.lastName ? 'text-red-500' : 'text-black'}`} style={inputStyle('lastName')} />
                  {errors.lastName && <motion.p initial={{
                  opacity: 0,
                  y: -5
                }} animate={{
                  opacity: 1,
                  y: 0
                }} className="absolute -bottom-5 left-0 text-[10px] text-red-500 tracking-wider">
                      {errors.lastName}
                    </motion.p>}
                </div>
              </div>

              {/* Email */}
              <div className="relative mt-10">
                <label className={labelClass('email')} style={{
                fontWeight: 300,
                letterSpacing: isFloating('email') ? '0.25em' : '0.05em'
              }}>
                  {isFloating('email') ? 'EMAIL ADDRESS' : 'Email Address'}
                </label>
                <input type="email" value={fields.email.value} onChange={e => updateField('email', e.target.value)} onFocus={() => setFocus('email', true)} onBlur={() => setFocus('email', false)} className={`w-full bg-transparent border-0 border-b pb-3 pt-3 text-base outline-none focus:outline-none transition-colors duration-300 ${errors.email ? 'text-red-500' : 'text-black'}`} style={inputStyle('email')} />
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
                <label className={labelClass('password')} style={{
                fontWeight: 300,
                letterSpacing: isFloating('password') ? '0.25em' : '0.05em'
              }}>
                  {isFloating('password') ? 'PASSWORD' : 'Password'}
                </label>
                <input type={showPassword ? 'text' : 'password'} value={fields.password.value} onChange={e => updateField('password', e.target.value)} onFocus={() => setFocus('password', true)} onBlur={() => setFocus('password', false)} className={`w-full bg-transparent border-0 border-b pb-3 pt-3 text-base outline-none focus:outline-none pr-10 transition-colors duration-300 ${errors.password ? 'text-red-500' : 'text-black'}`} style={inputStyle('password')} />
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

              {/* Password strength hint */}
              {fields.password.value.length > 0 && <motion.div initial={{
              opacity: 0,
              y: -5
            }} animate={{
              opacity: 1,
              y: 0
            }} className={`flex gap-1.5 ${errors.password ? 'mt-2' : '-mt-4'}`}>
                  {[1, 2, 3, 4].map(i => <div key={i} className="h-[2px] flex-1 rounded-full transition-colors duration-500" style={{
                backgroundColor: fields.password.value.length >= i * 3 ? i <= 2 ? '#C0C0C0' : '#000' : '#e5e7eb'
              }} />)}
                </motion.div>}

              {/* Agreement */}
              <div className="flex items-start gap-4 pt-2 relative">
                <button type="button" onClick={() => {
                setAgreed(!agreed);
                if (errors.agreed) {
                  setErrors(prev => {
                    const newErrs = {
                      ...prev
                    };
                    delete newErrs.agreed;
                    return newErrs;
                  });
                }
              }} className={`mt-0.5 w-4 h-4 border flex-shrink-0 flex items-center justify-center transition-all duration-300 ${errors.agreed ? 'border-red-500' : agreed ? 'bg-black border-black' : 'border-gray-300 hover:border-gray-500'}`}>
                  {agreed && <Check size={10} className={errors.agreed ? "text-red-500" : "text-white"} />}
                </button>
                <div className="flex-1">
                  <p className={`text-xs leading-relaxed ${errors.agreed ? 'text-red-500' : 'text-gray-400'}`} style={{
                  fontWeight: 300
                }}>
                    I agree to the{' '}
                    <button type="button" className={`border-b transition-colors pb-0.5 ${errors.agreed ? 'text-red-500 border-red-500 hover:border-red-700' : 'text-black border-gray-300 hover:border-black'}`}>
                      Terms of Service
                    </button>{' '}
                    and{' '}
                    <button type="button" className={`border-b transition-colors pb-0.5 ${errors.agreed ? 'text-red-500 border-red-500 hover:border-red-700' : 'text-black border-gray-300 hover:border-black'}`}>
                      Privacy Policy
                    </button>
                    . I would like to receive exclusive updates and curated offers.
                  </p>
                  {errors.agreed && <motion.p initial={{
                  opacity: 0,
                  y: -5
                }} animate={{
                  opacity: 1,
                  y: 0
                }} className="absolute -bottom-5 left-8 text-[10px] text-red-500 tracking-wider">
                      {errors.agreed}
                    </motion.p>}
                </div>
              </div>

              {/* Submit */}
              <motion.button whileHover={{
              backgroundColor: '#1a1a1a'
            }} whileTap={{
              scale: 0.99
            }} type="submit" className="w-full bg-black text-white py-4 tracking-[0.25em] uppercase text-xs transition-colors duration-300 mt-2" style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 400
            }}>
                Create Account
              </motion.button>
            </form>

            {/* Footer */}
            <div className="mt-10 text-center">
              <p className="text-sm text-gray-400" style={{
              fontWeight: 300
            }}>
                Already a member?{' '}
                <button onClick={onGoToLogin} className="text-black border-b border-gray-300 hover:border-black transition-colors duration-300 pb-0.5" style={{
                fontWeight: 400
              }}>
                  Sign In
                </button>
              </p>
              <p className="text-[10px] tracking-[0.15em] text-gray-300 uppercase mt-6">
                Private Client? Call 1·800·UNICORN
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>;
}
