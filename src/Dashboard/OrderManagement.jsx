import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  ChevronDown,
  User,
  Mail,
  Calendar,
  AlertCircle,
  Filter,
  Package,
  ArrowUpDown
} from 'lucide-react';
import { ImageWithFallback } from '../app/components/figma/ImageWithFallback';

const STATUS_OPTIONS = ['Pending Payment', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const getStatusStyles = (status) => {
  switch (status) {
    case 'Pending Payment':
      return { bg: 'bg-amber-50 border-amber-200 text-amber-700', icon: <Clock size={14} /> };
    case 'Processing':
      return { bg: 'bg-blue-50 border-blue-200 text-blue-700', icon: <Clock size={14} /> };
    case 'Shipped':
      return { bg: 'bg-purple-50 border-purple-200 text-purple-700', icon: <Truck size={14} /> };
    case 'Delivered':
      return { bg: 'bg-emerald-50 border-emerald-200 text-emerald-700', icon: <CheckCircle2 size={14} /> };
    case 'Cancelled':
      return { bg: 'bg-red-50 border-red-200 text-red-700', icon: <XCircle size={14} /> };
    default:
      return { bg: 'bg-slate-50 border-slate-200 text-slate-700', icon: <AlertCircle size={14} /> };
  }
};

const resolveImageSource = (value = '') => {
  if (!value) return '';
  return value.startsWith('http') ? value : `http://localhost:5000${value}`;
};

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingStatus(true);
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setOrders(prev => prev.map(o => o.order_id === orderId ? { ...o, status: newStatus } : o));
        setEditingOrderId(null);
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Group orders by order_id
  const groupedOrders = useMemo(() => {
    const groups = {};
    orders.forEach(item => {
      const oid = item.order_id;
      if (!groups[oid]) {
        groups[oid] = {
          order_id: oid,
          user_email: item.user_email || 'guest@unicornjewels.com',
          customer_name: `${item.first_name || ''} ${item.last_name || ''}`.trim() || 'Guest Customer',
          order_date: item.order_date,
          status: item.status,
          total_price: 0,
          items: []
        };
      }
      
      // Calculate total price
      const priceNum = parseFloat((item.price || '').replace(/[^0-9.]/g, '')) || 0;
      const qty = item.quantity || 1;
      groups[oid].total_price += priceNum * qty;
      
      groups[oid].items.push(item);
    });

    return Object.values(groups);
  }, [orders]);

  // Filter & Search Grouped Orders
  const filteredOrders = useMemo(() => {
    return groupedOrders.filter(order => {
      const matchesSearch = 
        order.order_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.user_email.toLowerCase().includes(searchQuery.toLowerCase());
      
      // By default (All), do not show unpaid/pending checkout attempts
      const matchesStatus = statusFilter === 'All' 
        ? order.status !== 'Pending Payment' 
        : order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [groupedOrders, searchQuery, statusFilter]);

  return (
    <div className="space-y-8" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div>
        <h3 className="text-3xl font-bold text-slate-800 tracking-tight">Order Directory</h3>
        <p className="text-slate-500 text-sm mt-1 font-medium">Monitor customer checkout purchases, fulfill shipping details, and modify order status codes.</p>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Package size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Orders</p>
            <h4 className="text-2xl font-bold text-slate-800 mt-1">{groupedOrders.length}</h4>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Processing</p>
            <h4 className="text-2xl font-bold text-slate-800 mt-1">
              {groupedOrders.filter(o => o.status === 'Processing').length}
            </h4>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Truck size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Shipped</p>
            <h4 className="text-2xl font-bold text-slate-800 mt-1">
              {groupedOrders.filter(o => o.status === 'Shipped').length}
            </h4>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Delivered</p>
            <h4 className="text-2xl font-bold text-slate-800 mt-1">
              {groupedOrders.filter(o => o.status === 'Delivered').length}
            </h4>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by Order ID, customer name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-medium"
          />
        </div>

        <div className="flex gap-3 w-full md:w-auto items-center">
          <Filter size={16} className="text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-48 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 transition-all"
          >
            <option value="All">All Statuses</option>
            {STATUS_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4 bg-white border border-slate-200 rounded-2xl">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-slate-500 font-medium">Fetching orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-20 text-center bg-white border border-slate-200 rounded-2xl">
            <Package size={48} className="mx-auto text-slate-300 mb-4" />
            <h4 className="text-lg font-bold text-slate-700">No orders found</h4>
            <p className="text-sm text-slate-400 mt-1">There are no orders matching your search or filters.</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const styles = getStatusStyles(order.status);
            const isEditing = editingOrderId === order.order_id;
            
            return (
              <div key={order.order_id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {/* Order Header */}
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-sm font-bold text-slate-900 px-2 py-0.5 bg-slate-200/70 rounded">
                        {order.order_id}
                      </span>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${styles.bg}`}>
                        {styles.icon}
                        {order.status}
                      </span>
                      {order.status === 'Cancelled' && (
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider ${
                          order.items[0]?.refund_status === 'SUCCESS'
                            ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                            : order.items[0]?.refund_status === 'PENDING'
                            ? 'bg-amber-50 border border-amber-200 text-amber-700'
                            : 'bg-slate-50 border border-slate-200 text-slate-600'
                        }`}>
                          {order.items[0]?.refund_status === 'SUCCESS' ? 'REFUNDED' : order.items[0]?.refund_status === 'PENDING' ? 'REFUND PENDING' : 'REFUND INITIATED'}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-2 font-medium">
                      <span className="flex items-center gap-1.5"><User size={13} /> {order.customer_name}</span>
                      <span className="flex items-center gap-1.5"><Mail size={13} /> {order.user_email}</span>
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} /> {new Date(order.order_date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                    </div>
                  </div>

                  {/* Actions / Status Edit */}
                  <div className="relative shrink-0 flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Total Bill</p>
                      <p className="text-lg font-bold text-slate-900">${order.total_price.toLocaleString()}</p>
                    </div>

                    <div className="h-8 w-[1px] bg-slate-200"></div>

                    {isEditing ? (
                      <div className="flex gap-2 items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                        <select
                          defaultValue={order.status}
                          disabled={updatingStatus}
                          onChange={(e) => handleUpdateStatus(order.order_id, e.target.value)}
                          className="bg-transparent text-sm font-bold text-slate-700 outline-none px-2 py-1.5"
                        >
                          {STATUS_OPTIONS.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => setEditingOrderId(null)}
                          className="p-1.5 text-slate-400 hover:text-slate-800 transition-colors"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditingOrderId(order.order_id)}
                        className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
                      >
                        Update Status <ChevronDown size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6 divide-y divide-slate-100">
                  {order.items.map((item, idx) => (
                    <div key={item.id || idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-50 border border-slate-200 shrink-0">
                          <ImageWithFallback
                            src={resolveImageSource(item.image_url)}
                            alt={item.product_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h5 className="font-bold text-slate-800 text-sm tracking-wide">{item.product_name}</h5>
                          <p className="text-xs text-slate-400 mt-1 font-semibold">
                            {item.selected_size ? `Size: ${item.selected_size} | ` : ''}
                            {item.selected_weight ? `Weight: ${item.selected_weight}g | ` : ''}
                            Quantity: {item.quantity || 1}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-800">{item.price}</p>
                        {item.quantity > 1 && (
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            (${parseFloat(item.price.replace(/[^0-9.]/g, ''))} each)
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
