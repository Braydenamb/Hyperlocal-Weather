'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CloudRain, Sun, Cloud, AlertOctagon, CloudLightning, Wind, Snowflake, Info } from 'lucide-react';
import clsx from 'clsx';
import { useLocationStore } from '@/stores/locationStore';

interface CommunityReportFormProps {
  isOpen: boolean;
  onClose: () => void;
  onReportSubmitted?: () => void;
}

const conditions = [
  { id: 'sunny', name: 'Sunny', icon: Sun, color: 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5 hover:bg-yellow-500/10' },
  { id: 'cloudy', name: 'Cloudy', icon: Cloud, color: 'text-slate-400 border-slate-400/20 bg-slate-400/5 hover:bg-slate-400/10' },
  { id: 'rain', name: 'Rain', icon: CloudRain, color: 'text-blue-500 border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10' },
  { id: 'storm', name: 'Storm', icon: CloudLightning, color: 'text-purple-500 border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10' },
  { id: 'hail', name: 'Hail', icon: AlertOctagon, color: 'text-rose-500 border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10' },
  { id: 'windy', name: 'Windy', icon: Wind, color: 'text-teal-500 border-teal-500/20 bg-teal-500/5 hover:bg-teal-500/10' },
];

export default function CommunityReportForm({
  isOpen,
  onClose,
  onReportSubmitted,
}: CommunityReportFormProps) {
  const currentLocation = useLocationStore((s) => s.currentLocation);
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentLocation) {
      setError('Please select a location first in the dashboard header.');
      return;
    }
    if (!selectedCondition) {
      setError('Please select a weather condition.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          condition: selectedCondition,
          note,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit weather report.');
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setSelectedCondition(null);
        setNote('');
        onClose();
        if (onReportSubmitted) onReportSubmitted();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#060814]/80 backdrop-blur-sm"
          />

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-lg glass-panel overflow-hidden rounded-3xl border border-white/10 bg-[#0B1020]/95 shadow-2xl p-6 lg:p-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white tracking-wide">
                  Submit Local Weather
                </h3>
                <p className="text-xs text-white/50 mt-1">
                  At {currentLocation?.name ?? 'your current coordinates'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-white/5 text-white/40 hover:text-white/80 transition-colors focus-ring"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Success screen */}
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-cyan/15 border border-cyan/30 text-cyan flex items-center justify-center mb-4 shadow-[0_0_24px_rgba(6,182,212,0.2)]">
                  <CloudRain className="w-8 h-8 animate-bounce" />
                </div>
                <h4 className="text-lg font-bold text-white mb-1">
                  Report Submitted!
                </h4>
                <p className="text-sm text-white/60">
                  Thank you for contributing to street-level intelligence.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Geolocation reminder */}
                {!currentLocation && (
                  <div className="flex gap-3 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-200 text-xs">
                    <Info className="w-5 h-5 flex-shrink-0" />
                    <span>
                      Please select a location using the header search first to submit weather reports at that street level.
                    </span>
                  </div>
                )}

                {/* Error banner */}
                {error && (
                  <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs font-semibold">
                    {error}
                  </div>
                )}

                {/* Condition Selector */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold tracking-wide text-white/70 block">
                    What condition is it right now?
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {conditions.map((cond) => {
                      const Icon = cond.icon;
                      const isSelected = selectedCondition === cond.id;
                      return (
                        <button
                          key={cond.id}
                          type="button"
                          onClick={() => setSelectedCondition(cond.id)}
                          className={clsx(
                            'flex flex-col items-center gap-2 p-3.5 rounded-2xl border text-center transition-all duration-200 focus-ring',
                            cond.color,
                            isSelected
                              ? 'border-cyan bg-cyan/15 text-cyan ring-1 ring-cyan/40 scale-95 shadow-[0_0_16px_rgba(6,182,212,0.1)]'
                              : 'border-white/5 text-white/70 hover:border-white/10 hover:text-white'
                          )}
                        >
                          <Icon className="w-6 h-6" />
                          <span className="text-xs font-semibold">{cond.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Text description */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold tracking-wide text-white/70 block">
                    Additional notes (optional)
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. Drizzle just turned into heavy downpour, localized flooding starting on side streets..."
                    maxLength={200}
                    rows={3}
                    className="w-full bg-[#0B1020]/60 border border-white/8 rounded-2xl p-4 text-sm text-white placeholder-white/30 focus-ring hover:border-white/12 transition-all outline-none resize-none"
                  />
                  <div className="text-right text-[10px] text-white/30 font-medium">
                    {note.length}/200 characters
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl border border-white/8 text-sm font-semibold text-white/70 hover:text-white hover:bg-white/5 transition-colors focus-ring"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !currentLocation}
                    className={clsx(
                      'px-6 py-2.5 rounded-xl text-sm font-bold text-[#060814] shadow-xl hover:shadow-cyan/10 transition-all duration-200 focus-ring flex items-center justify-center min-w-[120px]',
                      isSubmitting || !currentLocation
                        ? 'bg-cyan/40 cursor-not-allowed text-[#060814]/50'
                        : 'bg-cyan hover:bg-cyan-hover'
                    )}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
