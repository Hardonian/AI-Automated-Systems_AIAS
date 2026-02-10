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
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
];

export const BookingInterface = () => {
  const [selectedType, setSelectedType] = useState('video');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  return (
    <section className='relative py-24'>
      <div className='container mx-auto px-4'>
        <div className='mx-auto max-w-4xl'>
          <div className='mb-8 space-y-3 text-center sm:mb-12 sm:space-y-4'>
            <h2 className='px-4 text-3xl font-bold sm:text-4xl md:text-5xl'>
              Schedule Your
              <span className='to-primary-glow mt-2 block bg-gradient-to-r from-primary bg-clip-text text-transparent'>
                Free Consultation
              </span>
            </h2>
            <p className='px-4 text-lg text-muted-foreground sm:text-xl'>
              Meet with an AI automation expert to discuss your business needs
            </p>
          </div>

          <div className='bg-gradient-card rounded-xl border border-border p-4 backdrop-blur-sm sm:p-6 md:p-8'>
            <form className='space-y-4 sm:space-y-6'>
              {/* Contact Info */}
              <div className='grid gap-3 sm:grid-cols-2 sm:gap-4'>
                <div>
                  <label
                    className='mb-2 block text-sm font-medium'
                    htmlFor='fullName'
                  >
                    Full Name *
                  </label>
                  <Input required id='fullName' placeholder='John Doe' />
                </div>
                <div>
                  <label
                    className='mb-2 block text-sm font-medium'
                    htmlFor='email'
                  >
                    Email *
                  </label>
                  <Input
                    required
                    id='email'
                    placeholder='john@company.com'
                    type='email'
                  />
                </div>
              </div>

              <div className='grid gap-3 sm:grid-cols-2 sm:gap-4'>
                <div>
                  <label
                    className='mb-2 block text-sm font-medium'
                    htmlFor='company'
                  >
                    Company
                  </label>
                  <Input id='company' placeholder='Your Company' />
                </div>
                <div>
                  <label
                    className='mb-2 block text-sm font-medium'
                    htmlFor='phone'
                  >
                    Phone
                  </label>
                  <Input
                    id='phone'
                    placeholder='+1 (555) 000-0000'
                    type='tel'
                  />
                </div>
              </div>

              {/* Meeting Type */}
              <div>
                <label
                  className='mb-3 block text-sm font-medium'
                  htmlFor='meetingType'
                >
                  Preferred Meeting Type *
                </label>
                <div className='grid grid-cols-3 gap-2 sm:gap-4'>
                  {meetingTypes.map(type => (
                    <button
                      key={type.value}
                      className={`min-h-[80px] rounded-lg border p-3 transition-all sm:min-h-[100px] sm:p-4 ${
                        selectedType === type.value
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                      type='button'
                      onClick={() => setSelectedType(type.value)}
                    >
                      <type.icon className='mx-auto mb-1 h-5 w-5 text-primary sm:mb-2 sm:h-6 sm:w-6' />
                      <div className='text-xs font-medium sm:text-sm'>
                        {type.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Time Selection */}
              <div className='grid gap-3 sm:grid-cols-2 sm:gap-4'>
                <div>
                  <label
                    className='mb-2 block flex items-center gap-2 text-sm font-medium'
                    htmlFor='date'
                  >
                    <Calendar className='h-4 w-4' />
                    Select Date *
                  </label>
                  <Input
                    required
                    id='date'
                    min={new Date().toISOString().split('T')[0]}
                    type='date'
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    className='mb-2 block flex items-center gap-2 text-sm font-medium'
                    htmlFor='time'
                  >
                    <Clock className='h-4 w-4' />
                    Select Time *
                  </label>
                  <select
                    required
                    className='w-full rounded-md border border-input bg-background px-3 py-2'
                    id='time'
                    value={selectedTime}
                    onChange={e => setSelectedTime(e.target.value)}
                  >
                    <option value=''>Choose a time</option>
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Additional Info */}
              <div>
                <label
                  className='mb-2 block text-sm font-medium'
                  htmlFor='needs'
                >
                  Tell us about your automation needs
                </label>
                <Textarea
                  id='needs'
                  placeholder='What business processes would you like to automate? What challenges are you facing?'
                  rows={4}
                />
              </div>

              {/* Submit Button */}
              <Button
                className='bg-gradient-primary shadow-glow w-full'
                size='lg'
                type='submit'
              >
                Schedule Consultation
              </Button>

              <p className='text-center text-xs text-muted-foreground'>
                Note: This is a UI placeholder. Backend booking logic will be
                implemented by Momen.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
