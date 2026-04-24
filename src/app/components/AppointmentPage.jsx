import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Diamond, Check, MapPin, ChevronLeft, ChevronRight, Gem, Sparkles, Wrench, MoreHorizontal } from 'lucide-react';
const logoImg = "https://images.unsplash.com/photo-1610187390406-9d24b55ea697?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdmFudCUyMGdhcmRlJTIwbG9nbyUyMGpld2VscnklMjBicmFuZHxlbnwxfHx8fDE3NzY3NjUzMzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const defaultServices = [{
  id: 'personal',
  icon: Sparkles,
  label: 'Personal Shopping',
  duration: '60 min',
  desc: 'Bespoke selection tailored to your occasion, taste and budget.'
}, {
  id: 'engagement',
  icon: Diamond,
  label: 'Engagement Consultation',
  duration: '90 min',
  desc: 'Expert guidance through choosing the perfect engagement ring.'
}, {
  id: 'bespoke',
  icon: Gem,
  label: 'Bespoke Design',
  duration: '120 min',
  desc: 'Collaborate directly to create a truly unique commission.'
}, {
  id: 'care',
  icon: Wrench,
  label: 'Care & Repair',
  duration: '30 min',
  desc: 'Professional cleaning, resizing and restoration services.'
}, {
  id: 'other',
  icon: MoreHorizontal,
  label: 'Other Inquiries',
  duration: 'Flexible',
  desc: 'Have something else in mind? Let us know how we can assist you.'
}];
const vaultServices = [{
  id: 'private-viewing',
  icon: Diamond,
  label: 'Private Viewing Session',
  duration: '60 min',
  desc: 'A one-to-one presentation of high jewelry, rare stones, and bespoke pieces.'
}, {
  id: 'collector-event',
  icon: Sparkles,
  label: 'Collector Event Reservation',
  duration: 'Scheduled event',
  desc: 'Reserve your place when an exclusive salon session or hosted event is taking place.'
}, {
  id: 'curator-consultation',
  icon: Gem,
  label: 'Curator Consultation',
  duration: '45 min',
  desc: 'Meet with our concierge team for guidance on featured vault pieces and commissions.'
}, {
  id: 'other',
  icon: MoreHorizontal,
  label: 'Other Vault Inquiry',
  duration: 'Flexible',
  desc: 'Share your preferred session, event, or private viewing request and we will tailor the experience.'
}];
const locations = [{
  id: 'nyc',
  city: 'New York',
  address: '727 Fifth Avenue, NY 10022',
  hours: 'Mon–Sat 10–19 · Sun 12–18'
}, {
  id: 'bev',
  city: 'Beverly Hills',
  address: '210 N Rodeo Drive, CA 90210',
  hours: 'Mon–Sat 10–18 · Sun 12–17'
}, {
  id: 'miami',
  city: 'Miami',
  address: '9700 Collins Avenue, FL 33154',
  hours: 'Mon–Sat 10–19 · Sun 12–18'
}, {
  id: 'chi',
  city: 'Chicago',
  address: '730 N Michigan Avenue, IL 60611',
  hours: 'Mon–Sat 10–18 · Sun 12–17'
}];
const timeSlots = ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '1:00 PM', '2:00 PM', '2:30 PM', '3:00 PM', '4:00 PM', '4:30 PM', '5:00 PM'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDay(year, month) {
  return new Date(year, month, 1).getDay();
}
function StepIndicator({
  current,
  total
}) {
  return <div className="flex items-center gap-3">
      {Array.from({
      length: total
    }).map((_, i) => <div key={i} className="flex items-center gap-3">
          <div className={`transition-all duration-500 ${i < current ? 'w-6 h-6 rounded-full bg-black flex items-center justify-center' : i === current ? 'w-6 h-6 rounded-full border-2 border-black flex items-center justify-center' : 'w-2 h-2 rounded-full bg-gray-200'}`}>
            {i < current && <Check size={10} className="text-white" />}
            {i === current && <div className="w-2 h-2 rounded-full bg-black" />}
          </div>
          {i < total - 1 && <div className={`h-[1px] w-8 transition-colors duration-500 ${i < current ? 'bg-black' : 'bg-gray-200'}`} />}
        </div>)}
    </div>;
}
export function AppointmentPage({
  onBack,
  mode = 'standard'
}) {
  const today = new Date();
  const isVaultMode = mode === 'vault';
  const services = isVaultMode ? vaultServices : defaultServices;
  const stepOneTitle = isVaultMode ? <>Upcoming events &<br /><span className="italic text-gray-400">session booking</span></> : <>Choose your<br /><span className="italic text-gray-400">experience</span></>;
  // We skip the hero landing page and go straight to Step 1
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    guestCount: '1',
    notes: ''
  });
  const [confirmed, setConfirmed] = useState(false);
  const totalSteps = 4;
  const serviceObj = services.find(s => s.id === selectedService);
  const locationObj = locations.find(l => l.id === selectedLocation);
  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDay(calYear, calMonth);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const prevMonth = () => {
    if (calMonth === 0) {
      setCalYear(y => y - 1);
      setCalMonth(11);
    } else setCalMonth(m => m - 1);
    setSelectedDay(null);
  };
  const nextMonth = () => {
    if (calMonth === 11) {
      setCalYear(y => y + 1);
      setCalMonth(0);
    } else setCalMonth(m => m + 1);
    setSelectedDay(null);
  };
  const canProceed = () => {
    if (step === 1) return !!selectedService;
    if (step === 2) return !!selectedLocation;
    if (step === 3) return !!selectedDay && !!selectedTime;
    if (step === 4) return form.firstName && form.lastName && form.email;
    return true;
  };
  const formattedDate = selectedDay ? `${MONTHS[calMonth]} ${selectedDay}, ${calYear}` : '';
  if (confirmed) {
    return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6" style={{
      fontFamily: "'Cormorant Garamond', serif"
    }}>
        <motion.div initial={{
        opacity: 0,
        scale: 0.96
      }} animate={{
        opacity: 1,
        scale: 1
      }} transition={{
        duration: 1
      }} className="text-center max-w-lg">
          <motion.div initial={{
          scale: 0,
          rotate: -45
        }} animate={{
          scale: 1,
          rotate: 0
        }} transition={{
          duration: 0.8,
          delay: 0.3,
          type: 'spring'
        }} className="w-20 h-20 mx-auto mb-10 border border-white/20 rotate-45 flex items-center justify-center">
            <Diamond size={28} className="text-[#C0C0C0] -rotate-45" />
          </motion.div>
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.5
        }}>
            <span className="text-[10px] tracking-[0.4em] text-[#C0C0C0] uppercase block mb-6">{isVaultMode ? 'Viewing Request Confirmed' : 'Appointment Confirmed'}</span>
            <h2 className="text-5xl text-white mb-6" style={{
            fontWeight: 300
          }}>{isVaultMode ? <>Your private viewing<br /><span className="italic text-white/50">is reserved.</span></> : <>We look forward<br /><span className="italic text-white/50">to meeting you.</span></>}</h2>
            <div className="w-12 h-[0.5px] bg-white/30 mx-auto my-8" />
            <div className="space-y-3 text-white/60 mb-10" style={{
            fontWeight: 300
          }}>
              <p className="text-lg">{serviceObj.label}</p>
              <p>{locationObj.city} · {locationObj.address}</p>
              <p>{formattedDate} · {selectedTime}</p>
              <p className="text-[#C0C0C0]">{form.firstName} {form.lastName}</p>
            </div>
            <button onClick={onBack} className="border border-white/20 text-white/70 hover:border-white/50 hover:text-white px-10 py-4 text-xs tracking-[0.2em] uppercase transition-all duration-300">
              Return to Boutique
            </button>
          </motion.div>
        </motion.div>
      </div>;
  }
  return <motion.div initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} transition={{
    duration: 0.5
  }} className="min-h-screen flex" style={{
    fontFamily: "'Cormorant Garamond', serif"
  }}>
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col w-[38%] sticky top-0 h-screen overflow-hidden bg-black">
        <div className="absolute inset-0">
          <img src={logoImg} alt="Unicorn Jewels" className="absolute inset-0 w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>
        
        <button onClick={onBack} className="relative z-10 flex items-center gap-2 text-white/60 hover:text-white transition-colors group mt-10 ml-10 w-fit">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="text-[10px] tracking-[0.2em] uppercase">Back to Site</span>
        </button>

        <div className="relative z-10 flex-1 flex items-end pb-14 px-12">
          <motion.div key={`${selectedService}-${selectedLocation}-${selectedDay}`} initial={{
          opacity: 0,
          y: 15
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5
        }} className="w-full">
            <div className="space-y-5">
              <h3 className="text-3xl text-white" style={{
              fontWeight: 300
            }}>Your Visit</h3>
              <div className="space-y-3 mt-6">
                {selectedService && <div className="flex items-start gap-3">
                    <div className="w-[1px] h-4 bg-[#C0C0C0]/40 mt-1 flex-shrink-0" />
                    <div><p className="text-[10px] tracking-[0.2em] text-white/40 uppercase mb-1">Service</p><p className="text-white/80" style={{
                    fontWeight: 300
                  }}>{serviceObj.label}</p></div>
                  </div>}
                {selectedLocation && <div className="flex items-start gap-3">
                    <div className="w-[1px] h-4 bg-[#C0C0C0]/40 mt-1 flex-shrink-0" />
                    <div><p className="text-[10px] tracking-[0.2em] text-white/40 uppercase mb-1">Location</p><p className="text-white/80" style={{
                    fontWeight: 300
                  }}>{locationObj.city}</p></div>
                  </div>}
                {selectedDay && <div className="flex items-start gap-3">
                    <div className="w-[1px] h-4 bg-[#C0C0C0]/40 mt-1 flex-shrink-0" />
                    <div><p className="text-[10px] tracking-[0.2em] text-white/40 uppercase mb-1">Date & Time</p><p className="text-white/80" style={{
                    fontWeight: 300
                  }}>{formattedDate}{selectedTime && ` · ${selectedTime}`}</p></div>
                  </div>}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col min-h-screen bg-white">
        <div className="flex items-center justify-between px-10 pt-10 pb-6 border-b border-gray-100">
          <button onClick={() => step > 1 ? setStep(s => s - 1) : onBack()} className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] tracking-[0.2em] uppercase">Back</span>
          </button>
          <StepIndicator current={step - 1} total={totalSteps} />
          <span className="text-[10px] tracking-[0.2em] text-gray-300 uppercase">{step} / {totalSteps}</span>
        </div>

        <div className="flex-1 px-10 sm:px-16 py-12 pb-32 overflow-y-auto">
          {step === 1 && <motion.div initial={{
          opacity: 0,
          x: 30
        }} animate={{
          opacity: 1,
          x: 0
        }}>
              <span className="text-[10px] tracking-[0.4em] text-gray-400 uppercase block mb-4">Step 1</span>
              <h2 className="text-4xl sm:text-5xl text-black mb-2" style={{
            fontWeight: 300
          }}>{stepOneTitle}</h2>
              <div className="w-8 h-[1px] bg-gray-200 mt-6 mb-6" />
              {isVaultMode && <p className="text-sm text-gray-500 max-w-xl mb-10" style={{
            fontWeight: 300,
            lineHeight: 1.7
          }}>
                  Reserve a private viewing, upcoming collector event, or curator-led session with our vault team.
                </p>}
              <div className="grid sm:grid-cols-2 gap-4">
                {services.map(s => {
              const Icon = s.icon;
              const active = selectedService === s.id;
              return <button key={s.id} onClick={() => setSelectedService(s.id)} className={`text-left p-8 border transition-all duration-300 group ${active ? 'border-black bg-black text-white' : 'border-gray-100 hover:border-gray-300 bg-white'} ${s.id === 'other' ? 'sm:col-span-2' : ''}`}>
                      <div className="flex items-start justify-between mb-6">
                        <Icon size={20} className={active ? 'text-[#C0C0C0]' : 'text-gray-300 group-hover:text-gray-500'} />
                        {active && <motion.div initial={{
                    scale: 0
                  }} animate={{
                    scale: 1
                  }} className="w-5 h-5 rounded-full bg-white flex items-center justify-center"><Check size={10} className="text-black" /></motion.div>}
                      </div>
                      <h3 className={`text-xl mb-1 ${active ? 'text-white' : 'text-black'}`} style={{
                  fontWeight: 300
                }}>{s.label}</h3>
                      <p className={`text-[10px] tracking-[0.2em] uppercase mb-3 ${active ? 'text-white/50' : 'text-gray-400'}`}>{s.duration}</p>
                      <p className={`text-sm leading-relaxed ${active ? 'text-white/70' : 'text-gray-500'}`} style={{
                  fontWeight: 300
                }}>{s.desc}</p>
                    </button>;
            })}
              </div>
            </motion.div>}

          {step === 2 && <motion.div initial={{
          opacity: 0,
          x: 30
        }} animate={{
          opacity: 1,
          x: 0
        }}>
              <span className="text-[10px] tracking-[0.4em] text-gray-400 uppercase block mb-4">Step 2</span>
              <h2 className="text-4xl sm:text-5xl text-black mb-2" style={{
            fontWeight: 300
          }}>Select your<br /><span className="italic text-gray-400">boutique</span></h2>
              <div className="w-8 h-[1px] bg-gray-200 mt-6 mb-10" />
              <div className="space-y-3">
                {locations.map(loc => {
              const active = selectedLocation === loc.id;
              return <button key={loc.id} onClick={() => setSelectedLocation(loc.id)} className={`w-full text-left border p-8 transition-all duration-300 flex items-start justify-between ${active ? 'border-black bg-black text-white' : 'border-gray-100 hover:border-gray-300'}`}>
                      <div className="flex items-start gap-5">
                        <MapPin size={18} className={`mt-1 flex-shrink-0 ${active ? 'text-[#C0C0C0]' : 'text-gray-300'}`} />
                        <div>
                          <h3 className={`text-2xl mb-1 ${active ? 'text-white' : 'text-black'}`} style={{
                      fontWeight: 300
                    }}>{loc.city}</h3>
                          <p className={`text-sm mb-2 ${active ? 'text-white/60' : 'text-gray-500'}`} style={{
                      fontWeight: 300
                    }}>{loc.address}</p>
                          <p className={`text-[10px] tracking-[0.15em] uppercase ${active ? 'text-white/40' : 'text-gray-400'}`}>{loc.hours}</p>
                        </div>
                      </div>
                      {active && <motion.div initial={{
                  scale: 0
                }} animate={{
                  scale: 1
                }} className="w-5 h-5 rounded-full bg-white flex items-center justify-center mt-1"><Check size={10} className="text-black" /></motion.div>}
                    </button>;
            })}
              </div>
            </motion.div>}

          {step === 3 && <motion.div initial={{
          opacity: 0,
          x: 30
        }} animate={{
          opacity: 1,
          x: 0
        }}>
              <span className="text-[10px] tracking-[0.4em] text-gray-400 uppercase block mb-4">Step 3</span>
              <h2 className="text-4xl sm:text-5xl text-black mb-2" style={{
            fontWeight: 300
          }}>Choose your<br /><span className="italic text-gray-400">date & time</span></h2>
              <div className="w-8 h-[1px] bg-gray-200 mt-6 mb-10" />
              
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl text-black" style={{
                fontWeight: 300
              }}>{MONTHS[calMonth]} {calYear}</h3>
                  <div className="flex gap-2">
                    <button onClick={prevMonth} className="w-9 h-9 border border-gray-200 hover:border-gray-400 flex items-center justify-center transition-colors"><ChevronLeft size={14} /></button>
                    <button onClick={nextMonth} className="w-9 h-9 border border-gray-200 hover:border-gray-400 flex items-center justify-center transition-colors"><ChevronRight size={14} /></button>
                  </div>
                </div>
                <div className="grid grid-cols-7 mb-3">
                  {DAYS.map(d => <div key={d} className="text-center text-[10px] tracking-[0.15em] text-gray-400 uppercase py-2">{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({
                length: firstDay
              }).map((_, i) => <div key={`e${i}`} />)}
                  {Array.from({
                length: daysInMonth
              }).map((_, i) => {
                const day = i + 1;
                const active = selectedDay === day;
                return <button key={day} onClick={() => setSelectedDay(day)} className={`aspect-square flex items-center justify-center text-sm transition-all ${active ? 'bg-black text-white' : 'hover:bg-gray-100 text-black'}`}>
                        {day}
                      </button>;
              })}
                </div>
              </div>

              {selectedDay && <motion.div initial={{
            opacity: 0,
            y: 10
          }} animate={{
            opacity: 1,
            y: 0
          }}>
                  <h4 className="text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-4">Available Times</h4>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {timeSlots.map(time => <button key={time} onClick={() => setSelectedTime(time)} className={`py-3 text-xs tracking-widest transition-all border ${selectedTime === time ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-gray-400 text-black'}`}>
                        {time}
                      </button>)}
                  </div>
                </motion.div>}
            </motion.div>}

          {step === 4 && <motion.div initial={{
          opacity: 0,
          x: 30
        }} animate={{
          opacity: 1,
          x: 0
        }}>
              <span className="text-[10px] tracking-[0.4em] text-gray-400 uppercase block mb-4">Step 4</span>
              <h2 className="text-4xl sm:text-5xl text-black mb-2" style={{
            fontWeight: 300
          }}>Your<br /><span className="italic text-gray-400">details</span></h2>
              <div className="w-8 h-[1px] bg-gray-200 mt-6 mb-10" />
              
              <div className="space-y-8 max-w-lg">
                <div className="grid grid-cols-2 gap-6">
                  <div className="relative">
                    <label className="text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-2 block">First Name</label>
                    <input type="text" value={form.firstName} onChange={e => setForm({
                  ...form,
                  firstName: e.target.value
                })} className="w-full border-b border-gray-200 py-2 outline-none focus:border-black transition-colors" />
                  </div>
                  <div className="relative">
                    <label className="text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-2 block">Last Name</label>
                    <input type="text" value={form.lastName} onChange={e => setForm({
                  ...form,
                  lastName: e.target.value
                })} className="w-full border-b border-gray-200 py-2 outline-none focus:border-black transition-colors" />
                  </div>
                </div>
                <div className="relative">
                  <label className="text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-2 block">Email Address</label>
                  <input type="email" value={form.email} onChange={e => setForm({
                ...form,
                email: e.target.value
              })} className="w-full border-b border-gray-200 py-2 outline-none focus:border-black transition-colors" />
                </div>
                <div className="relative">
                  <label className="text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-2 block">Phone Number</label>
                  <input type="tel" value={form.phone} onChange={e => setForm({
                ...form,
                phone: e.target.value
              })} className="w-full border-b border-gray-200 py-2 outline-none focus:border-black transition-colors" />
                </div>
                <div className="relative">
                  <label className="text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-2 block">Additional Notes (Optional)</label>
                  <textarea value={form.notes} onChange={e => setForm({
                ...form,
                notes: e.target.value
              })} rows={3} className="w-full border-b border-gray-200 py-2 outline-none focus:border-black transition-colors resize-none" />
                </div>
              </div>
            </motion.div>}
        </div>

        {/* Bottom sticky footer */}
        <div className="fixed bottom-0 right-0 w-full lg:w-[62%] bg-white/90 backdrop-blur-md border-t border-gray-100 p-6 sm:px-16 flex items-center justify-between">
          <div>
            <p className="text-[10px] tracking-[0.2em] text-gray-400 uppercase">Need help?</p>
            <p className="text-sm" style={{
            fontWeight: 300
          }}>Contact our concierge</p>
          </div>
          <button onClick={() => step < 4 ? setStep(s => s + 1) : setConfirmed(true)} disabled={!canProceed()} className="bg-black text-white px-10 py-4 text-xs tracking-[0.2em] uppercase flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-[#1a1a1a]">
            <span>{step === 4 ? 'Confirm Booking' : 'Continue'}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </motion.div>;
}
