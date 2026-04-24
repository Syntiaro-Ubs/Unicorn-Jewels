import { motion } from 'motion/react';
import { TrendingUp, Users, ShoppingCart, Eye } from 'lucide-react';

export default function Overview() {
  const stats = [
    { label: 'Website Visits', value: '12,840', icon: <Eye className="text-blue-600" />, trend: '+12%', color: 'bg-blue-50' },
    { label: 'Active Sessions', value: '1,240', icon: <Users className="text-purple-600" />, trend: '+5%', color: 'bg-purple-50' },
    { label: 'Product Clicks', value: '4,520', icon: <ShoppingCart className="text-emerald-600" />, trend: '+8%', color: 'bg-emerald-50' },
    { label: 'Conversion Rate', value: '3.2%', icon: <TrendingUp className="text-amber-600" />, trend: '-2%', color: 'bg-amber-50' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      <div>
        <h3 className="text-2xl font-bold text-slate-800 tracking-tight">System Overview</h3>
        <p className="text-slate-500 text-sm mt-1 font-medium">Real-time metrics for Unicorn Jewels.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                {stat.icon}
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${stat.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
            <h4 className="text-3xl font-bold text-slate-800 mt-2 tracking-tight">{stat.value}</h4>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm h-80 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
            <TrendingUp className="text-slate-300" size={32} />
          </div>
          <h5 className="font-bold text-slate-800">Traffic Analytics</h5>
          <p className="text-sm text-slate-400 mt-2 max-w-xs">Detailed traffic source visualization will be integrated here.</p>
        </div>
        
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm h-80 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
            <Users className="text-slate-300" size={32} />
          </div>
          <h5 className="font-bold text-slate-800">Customer Insights</h5>
          <p className="text-sm text-slate-400 mt-2 max-w-xs">User behavior and demographic data will be displayed here.</p>
        </div>
      </div>
    </motion.div>
  );
}
