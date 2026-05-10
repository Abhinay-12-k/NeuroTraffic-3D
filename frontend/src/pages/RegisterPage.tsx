import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { ShieldCheck, Mail, Lock, User, MapPin, Phone, ArrowRight, Cpu, Globe, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    location: '',
    email: '',
    phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      await setDoc(doc(db, 'users', user.uid), {
        fullName: formData.fullName,
        location: formData.location,
        email: formData.email,
        phone: formData.phone,
        role: 'Officer',
        createdAt: new Date().toISOString()
      });
      toast.success('Registration Successful. Welcome, Officer.', {
        duration: 3000,
        style: { background: '#0B3D2E', color: '#fff', borderRadius: '12px' }
      });
      navigate('/');
    } catch (error: any) {
      toast.error('Registration Failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: <Cpu size={20} />, title: "Neural Optimization", desc: "Real-time traffic flow balancing using deep learning." },
    { icon: <Globe size={20} />, title: "Digital Twin", desc: "High-fidelity 3D simulation of city junctions." },
    { icon: <Zap size={20} />, title: "Emergency Priority", desc: "Automated corridor clearing for first responders." }
  ];

  return (
    <div className="h-screen w-full flex bg-[#FDFBF7] overflow-hidden font-sans">
      {/* LEFT SIDE: AI INSIGHTS & IMAGE */}
      <div className="hidden lg:flex w-[55%] h-full bg-[#0B3D2E] relative flex-col p-16 justify-between overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="/traffic_ai_hero_1778411414178.png" 
            alt="AI Traffic" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-12"
          >
            <div className="w-12 h-12 bg-[#FDFBF7] rounded-xl flex items-center justify-center">
              <ShieldCheck className="text-[#0B3D2E]" size={28} />
            </div>
            <h1 className="text-2xl font-bold text-[#FDFBF7] tracking-tight uppercase">NeuroTraffic 3D</h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-xl"
          >
            <h2 className="text-5xl font-bold text-[#FDFBF7] leading-[1.1] mb-8">
              Empowering Urban <br />
              <span className="text-[#86EFAC]">Operations.</span>
            </h2>
            
            <div className="space-y-6">
              {features.map((f, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + (i * 0.1) }}
                  className="flex gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
                >
                  <div className="text-[#86EFAC] mt-1">{f.icon}</div>
                  <div>
                    <h3 className="text-[#FDFBF7] font-bold text-lg mb-1">{f.title}</h3>
                    <p className="text-[#FDFBF7]/60 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 pt-10 border-t border-white/10">
          <div className="flex items-center gap-6 text-[#FDFBF7]/40 text-xs font-bold tracking-[0.2em] uppercase">
            <span>Ver 4.2.0</span>
            <span className="w-1 h-1 bg-[#86EFAC] rounded-full"></span>
            <span>Neural Command Center</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: CLEAN REGISTER FORM */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 h-full flex flex-col p-12 lg:p-20 justify-center relative bg-[#FDFBF7]"
      >
        <div className="max-w-md w-full mx-auto">
          <div className="mb-8">
            <h3 className="text-[#0B3D2E] text-4xl font-black mb-3 tracking-tight">Personnel Recruitment</h3>
            <p className="text-slate-500 font-medium italic">Register for the National Traffic Network.</p>
          </div>

          <form onSubmit={handleRegister} className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-[10px] font-bold text-[#0B3D2E] uppercase tracking-[0.2em] mb-2 block">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input 
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-800 text-sm outline-none focus:ring-2 focus:ring-[#0B3D2E]/10 focus:border-[#0B3D2E] transition-all"
                  placeholder="Officer Name"
                  required
                />
              </div>
            </div>

            <div className="col-span-1">
              <label className="text-[10px] font-bold text-[#0B3D2E] uppercase tracking-[0.2em] mb-2 block">Station Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input 
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-800 text-sm outline-none focus:ring-2 focus:ring-[#0B3D2E]/10 focus:border-[#0B3D2E] transition-all"
                  placeholder="City/Station"
                  required
                />
              </div>
            </div>

            <div className="col-span-1">
              <label className="text-[10px] font-bold text-[#0B3D2E] uppercase tracking-[0.2em] mb-2 block">Contact Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input 
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-800 text-sm outline-none focus:ring-2 focus:ring-[#0B3D2E]/10 focus:border-[#0B3D2E] transition-all"
                  placeholder="+1 (555) 000"
                  required
                />
              </div>
            </div>

            <div className="col-span-2">
              <label className="text-[10px] font-bold text-[#0B3D2E] uppercase tracking-[0.2em] mb-2 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-800 text-sm outline-none focus:ring-2 focus:ring-[#0B3D2E]/10 focus:border-[#0B3D2E] transition-all"
                  placeholder="name@station.gov"
                  required
                />
              </div>
            </div>

            <div className="col-span-2">
              <label className="text-[10px] font-bold text-[#0B3D2E] uppercase tracking-[0.2em] mb-2 block">Create Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input 
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-800 text-sm outline-none focus:ring-2 focus:ring-[#0B3D2E]/10 focus:border-[#0B3D2E] transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="col-span-2 bg-[#0B3D2E] hover:bg-[#082D22] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#0B3D2E]/20 mt-4"
            >
              {loading ? 'Creating Account...' : 'Complete Recruitment'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-slate-400 text-sm">
              Already Registered? {' '}
              <Link to="/login" className="text-[#0B3D2E] font-bold hover:underline">Access Portal</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
