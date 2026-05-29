import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Package, Truck, CheckCircle2, MapPin, Calendar, ArrowLeft, Search, Clock, AlertTriangle } from 'lucide-react';

export function TrackOrderPage({ onBack }) {
  const [searchQuery, setSearchQuery] = useState('ORD-993-841');
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrackOrder = async (query) => {
    if (!query) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`http://localhost:5000/api/tracking/${query.trim()}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Tracking details not found');
      }

      setTrackingData(data);
    } catch (err) {
      setError(err.message || 'Unable to load tracking details.');
      setTrackingData(null);
    } finally {
      setLoading(false);
    }
  };

  // Run initial track lookup on mount for the default order
  useEffect(() => {
    handleTrackOrder(searchQuery);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleTrackOrder(searchQuery);
  };

  // Milestones mapping
  const stepsMap = ['Label Created', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'];

  const getStatusIndex = (status) => {
    if (status === 'Exception' || status === 'Cancelled') {
      return 2; // Mid-way exception point
    }
    return stepsMap.indexOf(status);
  };

  const statusIndex = trackingData ? getStatusIndex(trackingData.status) : -1;

  // Build the list of journey steps dynamically based on tracking data events
  const journeySteps = stepsMap.map((stepName, index) => {
    const isCompleted = index <= statusIndex;
    const isCurrent = index === statusIndex;

    const codeMap = {
      'Label Created': 'OC',
      'Picked Up': 'PU',
      'In Transit': 'IT',
      'Out for Delivery': 'OD',
      'Delivered': 'DL'
    };

    const targetCode = codeMap[stepName];
    // Find matching scan event for details
    const matchingEvent = trackingData?.events?.find(e =>
      e.statusCode === targetCode ||
      e.description?.toLowerCase().includes(stepName.toLowerCase())
    );

    let dateText = 'Pending';
    let locationText = '';

    if (matchingEvent) {
      dateText = new Date(matchingEvent.timestamp).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      locationText = matchingEvent.location;
    } else if (isCompleted) {
      if (stepName === 'Label Created' && trackingData?.shipmentDate) {
        dateText = new Date(trackingData.shipmentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else if (stepName === 'Delivered' && trackingData?.actualDelivery) {
        dateText = new Date(trackingData.actualDelivery).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
    }

    if (!locationText) {
      if (stepName === 'Label Created') locationText = 'Fulfillment Center';
      else if (stepName === 'Delivered') locationText = 'Destination Address';
      else locationText = isCompleted ? 'In Transit' : 'Pending Route';
    }

    return {
      status: stepName,
      date: dateText,
      location: locationText,
      completed: isCompleted,
      current: isCurrent
    };
  });

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-gray-200 pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 border-b border-gray-100 pb-12"
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors w-fit mb-12"
          >
            <ArrowLeft size={14} />
            Back
          </button>
          <h1 className="text-5xl md:text-7xl mb-6 tracking-tight leading-none" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Track Your <span className="italic text-gray-500">Order.</span>
          </h1>
          <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400">Enter your order ID or FedEx tracking number</p>
        </motion.div>

        {/* Input Form & Tracking Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

          {/* Left Side: Lookup & Metadata */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="bg-[#fcfcfc] border border-gray-200 p-10 md:p-12 space-y-10">
              <div className="space-y-6">
                <h2 className="font-serif text-3xl mb-8">Search Order</h2>

                <form onSubmit={handleSubmit}>
                  <label className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-3 block">Order ID or Tracking Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="e.g. ORD-993-841 or 449012345551"
                      className="w-full border-b border-gray-300 bg-transparent py-3 pr-8 text-sm focus:border-black outline-none transition-colors"
                      required
                    />
                    <button type="submit" disabled={loading} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">
                      <Search size={16} />
                    </button>
                  </div>
                </form>

                {error && (
                  <div className="p-4 bg-red-50 text-red-700 text-xs flex items-start gap-2 rounded border border-red-100">
                    <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {loading && (
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <div className="w-3.5 h-3.5 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
                    <span>Locating package details...</span>
                  </div>
                )}

                {trackingData && (
                  <div className="grid grid-cols-2 gap-12 pt-4">
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-3">Status</p>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${trackingData.status === 'Delivered'
                            ? 'bg-green-500'
                            : trackingData.status === 'Exception' || trackingData.status === 'Cancelled'
                              ? 'bg-red-500'
                              : 'bg-black animate-pulse'
                          }`}></div>
                        <p className="text-sm tracking-wide font-medium">{trackingData.status}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-3">Expected Delivery</p>
                      <p className="text-sm tracking-wide">
                        {trackingData.estimatedDelivery
                          ? new Date(trackingData.estimatedDelivery).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                          : 'Pending info'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {trackingData && (
                <div className="pt-8 border-t border-gray-200 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white border border-gray-100 shrink-0">
                      <Truck size={18} className="text-gray-400" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-[10px] tracking-[0.15em] uppercase text-gray-500 mb-1">Carrier / Tracking Number</p>
                      <p className="text-sm font-medium">{trackingData.carrier} ({trackingData.trackingNumber})</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white border border-gray-100 shrink-0">
                      <MapPin size={18} className="text-gray-400" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-[10px] tracking-[0.15em] uppercase text-gray-500 mb-1">Linked Order ID</p>
                      <p className="text-sm font-medium">{trackingData.orderId || 'Direct Search'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Side: Stepper & History Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-7"
          >
            {loading ? (
              <div className="space-y-12 animate-pulse">
                <div>
                  <div className="h-8 bg-gray-200 rounded w-1/3 mb-12"></div>
                  <div className="relative space-y-16">
                    {/* Vertical Line */}
                    <div className="absolute left-[11px] top-2 bottom-2 w-[1px] bg-gray-200"></div>

                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="relative pl-12 flex gap-4">
                        <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-gray-200 border border-gray-300 animate-pulse"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                          <div className="h-3.5 bg-gray-100 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : trackingData ? (
              <div className="space-y-16">
                <div>
                  <h2 className="font-serif text-3xl mb-12">Journey Timeline</h2>
                  <div className="relative space-y-16">
                    {/* Vertical Line */}
                    <div className="absolute left-[11px] top-2 bottom-2 w-[1px] bg-gray-200"></div>

                    {journeySteps.map((step, index) => (
                      <div key={index} className="relative pl-12 group">
                        {/* Indicator Circle */}
                        <div className={`absolute left-0 top-0 w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-500 z-10 ${step.completed
                            ? 'bg-black border-black text-white'
                            : step.current
                              ? 'bg-white border-black text-black shadow-lg scale-125'
                              : 'bg-white border-gray-200 text-gray-300'
                          }`}>
                          {step.completed ? (
                            <CheckCircle2 size={12} strokeWidth={2.5} />
                          ) : step.current ? (
                            <Clock size={12} strokeWidth={2.5} className="animate-spin" style={{ animationDuration: '4s' }} />
                          ) : (
                            <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                          )}
                        </div>

                        <div className={`transition-all duration-500 ${step.completed || step.current ? 'opacity-100' : 'opacity-40'}`}>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <h3 className={`text-[11px] tracking-[0.25em] uppercase font-medium ${step.current ? 'text-black' : 'text-gray-900'}`}>
                              {step.status}
                            </h3>
                            <span className="text-[9px] tracking-[0.2em] text-gray-400 uppercase">{step.date}</span>
                          </div>
                          <p className="text-xs text-gray-500 tracking-widest uppercase">{step.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-96 border border-dashed border-gray-200 flex flex-col items-center justify-center text-center p-8 bg-[#fafafa]">
                <Package size={48} className="text-gray-300 mb-4" strokeWidth={1} />
                <h3 className="text-lg font-serif mb-2">No active shipment loaded</h3>
                <p className="text-xs text-gray-400 max-w-xs">Enter your details in the lookup form to load the tracking timeline and checkpoints.</p>
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
}
