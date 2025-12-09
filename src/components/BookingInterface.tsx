import { Calendar, Clock, Video, Phone, MessageSquare } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const meetingTypes = [
  { icon: Video, label: 'Video Call', value: 'video' },
  { icon: Phone, label: 'Phone Call', value: 'phone' },
  { icon: MessageSquare, label: 'Chat Only', value: 'chat' },
];

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
];

export const BookingInterface = () => {
  const [selectedType, setSelectedType] = useState('video');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 space-y-3 sm:space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold px-4">
              Schedule Your
              <span className="block mt-2 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Free Consultation
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground px-4">
              Meet with an AI automation expert to discuss your business needs
            </p>
          </div>

          <div className="p-4 sm:p-6 md:p-8 rounded-xl bg-gradient-card backdrop-blur-sm border border-border">
            <form className="space-y-4 sm:space-y-6">
              {/* Contact Info */}
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="fullName">Full Name *</label>
                  <Input required id="fullName" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="email">Email *</label>
                  <Input required id="email" placeholder="john@company.com" type="email" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="company">Company</label>
                  <Input id="company" placeholder="Your Company" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="phone">Phone</label>
                  <Input id="phone" placeholder="+1 (555) 000-0000" type="tel" />
                </div>
              </div>

              {/* Meeting Type */}
              <div>
                <label className="block text-sm font-medium mb-3" htmlFor="meetingType">Preferred Meeting Type *</label>
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  {meetingTypes.map((type) => (
                    <button
                      key={type.value}
                      className={`p-3 sm:p-4 rounded-lg border transition-all min-h-[80px] sm:min-h-[100px] ${
                        selectedType === type.value
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                      type="button"
                      onClick={() => setSelectedType(type.value)}
                    >
                      <type.icon className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 text-primary" />
                      <div className="text-xs sm:text-sm font-medium">{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Time Selection */}
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2" htmlFor="date">
                    <Calendar className="w-4 h-4" />
                    Select Date *
                  </label>
                  <Input
                    required
                    id="date"
                    min={new Date().toISOString().split('T')[0]}
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2" htmlFor="time">
                    <Clock className="w-4 h-4" />
                    Select Time *
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 rounded-md bg-background border border-input"
                    id="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                  >
                    <option value="">Choose a time</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Additional Info */}
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="needs">
                  Tell us about your automation needs
                </label>
                <Textarea
                  id="needs"
                  placeholder="What business processes would you like to automate? What challenges are you facing?"
                  rows={4}
                />
              </div>

              {/* Submit Button */}
              <Button className="w-full bg-gradient-primary shadow-glow" size="lg" type="submit">
                Schedule Consultation
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Note: This is a UI placeholder. Backend booking logic will be implemented by Momen.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
