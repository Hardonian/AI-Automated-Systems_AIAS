'use client';

import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  CheckCircle2,
  ArrowRight,
  Globe,
  Sparkles,
  Download,
  CalendarCheck,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SurfaceCard } from '@/components/ui/section-primitives';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type SessionType = 'diagnostic' | 'architecture' | 'governance';

interface SessionOption {
  id: SessionType;
  title: string;
  duration: string;
  description: string;
}

const SESSION_TYPES: SessionOption[] = [
  {
    id: 'diagnostic',
    title: 'AI Clarity Diagnostic',
    duration: '30 min',
    description: 'Map workflows, evaluate automation fit, and identify immediate high-ROI boundaries.',
  },
  {
    id: 'architecture',
    title: 'Architecture & Failure Mode Review',
    duration: '45 min',
    description: 'Technical review of existing agent pipelines, schema contracts, and latency/cost issues.',
  },
  {
    id: 'governance',
    title: 'Governance & Safety Scoping',
    duration: '30 min',
    description: 'Evaluate PIPEDA compliance, multi-tenant boundaries, and deterministic audit controls.',
  },
];

const TIMEZONES = [
  { label: 'Eastern Time (ET / Toronto)', value: 'America/Toronto' },
  { label: 'Pacific Time (PT / Vancouver)', value: 'America/Vancouver' },
  { label: 'Central Time (CT / Chicago)', value: 'America/Chicago' },
  { label: 'UTC / GMT', value: 'UTC' },
  { label: 'London Time (BST / London)', value: 'Europe/London' },
];

const TIME_SLOTS = [
  '09:30 AM',
  '11:00 AM',
  '01:30 PM',
  '03:00 PM',
  '04:30 PM',
];

export function InteractiveScheduler() {
  const [sessionType, setSessionType] = useState<SessionType>('diagnostic');
  const [selectedTimezone, setSelectedTimezone] = useState(TIMEZONES[0]?.value || 'America/Toronto');
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>('11:00 AM');

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [notes, setNotes] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Generate next 10 business days
  const availableDates = useMemo(() => {
    const dates: { dateStr: string; dayName: string; monthDay: string; fullDate: Date }[] = [];
    const now = new Date();
    let current = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Start tomorrow

    while (dates.length < 10) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // Skip Sat/Sun
        dates.push({
          dateStr: current.toISOString().split('T')[0] ?? '',
          dayName: current.toLocaleDateString('en-US', { weekday: 'short' }),
          monthDay: current.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          fullDate: new Date(current),
        });
      }
      current = new Date(current.getTime() + 24 * 60 * 60 * 1000);
    }
    return dates;
  }, []);

  const activeDate = availableDates[selectedDateIndex] ?? availableDates[0];
  const activeSession = SESSION_TYPES.find((s) => s.id === sessionType) ?? SESSION_TYPES[0];

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Please enter your name.';
    if (!email.trim() || !email.includes('@')) newErrors.email = 'Please enter a valid work email.';
    if (!selectedSlot) newErrors.slot = 'Please select a time slot.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsConfirmed(true);
  };

  const handleDownloadICS = () => {
    if (!activeDate || !selectedSlot) return;

    const summary = `${activeSession?.title || 'AI Strategy Session'} with AIAS`;
    const description = `Consultation on deterministic AI architecture, workflow boundaries, and governance controls. Scheduled for ${name} (${company || 'Client'}).`;
    
    // Parse time to ISO approx
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//AI Automated Systems//AIAS Scheduler//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:REQUEST',
      'BEGIN:VEVENT',
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      'LOCATION:Google Meet (Video Link will be delivered via email confirmation)',
      `DTSTART:${activeDate.dateStr.replace(/-/g, '')}T150000Z`,
      `DTEND:${activeDate.dateStr.replace(/-/g, '')}T153000Z`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aias-strategy-session-${activeDate.dateStr}.ics`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setIsConfirmed(false);
    setName('');
    setEmail('');
    setCompany('');
    setNotes('');
  };

  if (isConfirmed) {
    return (
      <SurfaceCard className="border-2 border-primary bg-card p-8 sm:p-10 shadow-card max-w-3xl mx-auto text-center animate-fade-in">
        <div className="mx-auto flex h-16 w-16 items-center justify-center border-2 border-primary bg-primary/10 text-primary mb-6">
          <CheckCircle2 className="h-8 w-8" />
        </div>

        <span className="font-mono text-xs font-bold uppercase tracking-widest px-3 py-1 border border-primary text-primary bg-primary/5">
          Session Confirmed
        </span>

        <h2 className="mt-4 text-2xl sm:text-3xl font-black uppercase tracking-tight text-foreground">
          You&apos;re Booked with AIAS Architecture Team
        </h2>

        <p className="mt-2 text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
          A calendar invite and Google Meet link have been prepared for <strong className="text-foreground">{email}</strong>.
        </p>

        {/* Appointment Details Box */}
        <div className="mt-8 border-2 border-border bg-muted/30 p-6 text-left space-y-3 font-mono text-xs max-w-md mx-auto">
          <div className="flex justify-between border-b border-border pb-2">
            <span className="text-muted-foreground uppercase">Session:</span>
            <span className="font-bold text-foreground">{activeSession?.title}</span>
          </div>
          <div className="flex justify-between border-b border-border pb-2">
            <span className="text-muted-foreground uppercase">Date:</span>
            <span className="font-bold text-foreground">{activeDate?.dayName}, {activeDate?.monthDay}</span>
          </div>
          <div className="flex justify-between border-b border-border pb-2">
            <span className="text-muted-foreground uppercase">Time:</span>
            <span className="font-bold text-foreground">{selectedSlot} ({TIMEZONES.find(t => t.value === selectedTimezone)?.label.split(' ')[0]})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground uppercase">Host:</span>
            <span className="font-bold text-primary">Scott H. (Principal Systems Architect)</span>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button
            onClick={handleDownloadICS}
            className="rounded-none border-2 border-primary bg-primary font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-card hover:-translate-y-0.5 transition-all"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Calendar Invite (.ics)
          </Button>

          <Button
            onClick={handleReset}
            variant="outline"
            className="rounded-none border-2 border-border font-mono text-xs font-bold uppercase tracking-widest hover:border-foreground"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Book Another Session
          </Button>
        </div>
      </SurfaceCard>
    );
  }

  return (
    <div className="w-full space-y-8" id="interactive-scheduler-root">
      {/* Session Type Selectors */}
      <div>
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary mb-3">
          1. Select Engagement Focus
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {SESSION_TYPES.map((session) => {
            const isSelected = sessionType === session.id;
            return (
              <button
                key={session.id}
                type="button"
                onClick={() => setSessionType(session.id)}
                className={`p-5 text-left border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-card font-bold'
                    : 'border-border bg-card hover:border-muted-foreground'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-primary">
                    {session.duration}
                  </span>
                  {isSelected && <Sparkles className="h-4 w-4 text-primary" />}
                </div>
                <h3 className="mt-2 font-mono text-sm font-bold uppercase text-foreground">
                  {session.title}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {session.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Scheduling Grid */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Col: Calendar Date & Time Slot Picker (7 cols) */}
        <div className="space-y-6 lg:col-span-7">
          <SurfaceCard className="p-6 border-2 border-border">
            {/* Header with Timezone */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b-2 border-border pb-4 gap-4">
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
                  2. Choose Date & Time
                </p>
                <h3 className="font-mono text-sm font-bold uppercase text-foreground mt-1">
                  Available Strategy Slots
                </h3>
              </div>

              {/* Timezone Selector */}
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <select
                  value={selectedTimezone}
                  onChange={(e) => setSelectedTimezone(e.target.value)}
                  className="rounded-none border-2 border-border bg-background px-2 py-1 font-mono text-xs font-bold text-foreground focus:outline-none focus:border-primary"
                  aria-label="Select Timezone"
                >
                  {TIMEZONES.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Horizontal Date Picker */}
            <div className="mt-6">
              <p className="font-mono text-xs font-bold uppercase text-muted-foreground mb-3">
                Select Date
              </p>
              <div className="flex gap-2.5 overflow-x-auto pb-2">
                {availableDates.map((d, index) => {
                  const isSelected = selectedDateIndex === index;
                  return (
                    <button
                      key={d.dateStr}
                      type="button"
                      onClick={() => setSelectedDateIndex(index)}
                      className={`flex flex-col items-center justify-center min-w-[72px] p-3 border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-primary bg-primary text-primary-foreground font-black shadow-sm'
                          : 'border-border bg-card text-muted-foreground hover:border-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <span className="font-mono text-[10px] uppercase">{d.dayName}</span>
                      <span className="font-mono text-sm font-bold mt-1">{d.monthDay}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slot Picker */}
            <div className="mt-6 border-t-2 border-border pt-4">
              <p className="font-mono text-xs font-bold uppercase text-muted-foreground mb-3">
                Available Time Slots for {activeDate?.dayName}, {activeDate?.monthDay}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {TIME_SLOTS.map((slot) => {
                  const isSelected = selectedSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => {
                        setSelectedSlot(slot);
                        setErrors((prev) => ({ ...prev, slot: '' }));
                      }}
                      className={`flex items-center justify-center p-3 font-mono text-xs font-bold border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-primary bg-primary/10 text-primary shadow-sm font-black'
                          : 'border-border bg-card text-foreground hover:border-muted-foreground'
                      }`}
                    >
                      <Clock className="mr-1.5 h-3.5 w-3.5" />
                      {slot}
                    </button>
                  );
                })}
              </div>
              {errors.slot && <p className="mt-2 text-xs font-mono text-destructive">{errors.slot}</p>}
            </div>
          </SurfaceCard>
        </div>

        {/* Right Col: Attendee Details Form (5 cols) */}
        <div className="space-y-6 lg:col-span-5">
          <SurfaceCard className="p-6 border-2 border-border h-full flex flex-col justify-between">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary mb-1">
                3. Your Information
              </p>
              <h3 className="font-mono text-sm font-bold uppercase text-foreground border-b-2 border-border pb-4">
                Confirm Reservation
              </h3>

              <form onSubmit={handleConfirmBooking} className="mt-5 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="font-mono text-xs uppercase font-bold text-foreground">
                    Your Name *
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setErrors((prev) => ({ ...prev, name: '' }));
                    }}
                    placeholder="Jane Doe"
                    className="rounded-none border-2 border-border font-mono text-xs"
                  />
                  {errors.name && <p className="text-xs font-mono text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="font-mono text-xs uppercase font-bold text-foreground">
                    Work Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors((prev) => ({ ...prev, email: '' }));
                    }}
                    placeholder="jane@company.com"
                    className="rounded-none border-2 border-border font-mono text-xs"
                  />
                  {errors.email && <p className="text-xs font-mono text-destructive">{errors.email}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="company" className="font-mono text-xs uppercase font-bold text-foreground">
                    Organization / Company
                  </Label>
                  <Input
                    id="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Acme Corp"
                    className="rounded-none border-2 border-border font-mono text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="notes" className="font-mono text-xs uppercase font-bold text-foreground">
                    Primary Workflow Challenge
                  </Label>
                  <Input
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. LLM output validation, manual ETL ops"
                    className="rounded-none border-2 border-border font-mono text-xs"
                  />
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full rounded-none border-2 border-primary bg-primary font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-card hover:-translate-y-0.5 hover:shadow-lg transition-all py-6"
                  >
                    Confirm {activeSession?.duration} Session
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>

            <p className="mt-6 text-center font-mono text-[11px] text-muted-foreground border-t border-border pt-4">
              🔒 No sales pressure. 100% confidential under NDA practices.
            </p>
          </SurfaceCard>
        </div>
      </div>
    </div>
  );
}
