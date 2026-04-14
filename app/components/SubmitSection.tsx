import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Gamepad2,
  MessageSquare,
  Send,
  CheckCircle,
  ShieldCheck,
  Users,
  Link,
  Globe,
  AlertCircle,
  ChevronDown } from
'lucide-react';
const requirements = [
{
  icon: ShieldCheck,
  label: 'Bridgewatch focused'
},
{
  icon: Users,
  label: 'Minimum 50 members'
},
{
  icon: Globe,
  label: 'Region specific (Asia, America, or Europe)'
},
{
  icon: Link,
  label: 'Permanent invite link'
},
{
  icon: AlertCircle,
  label: 'Active moderation'
}];

const WEBHOOK_URL = process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL || '';
const COOLDOWN_KEY = 'bridgewatch_submission_cooldown';
const COOLDOWN_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

type FormState = 'idle' | 'submitting' | 'success' | 'error';
export function SubmitSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [formState, setFormState] = useState<FormState>('idle');
  const [serverName, setServerName] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [region, setRegion] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [isOnCooldown, setIsOnCooldown] = useState(false);

  useEffect(() => {
    // Check for existing cooldown on mount
    const lastSubmissionTime = localStorage.getItem(COOLDOWN_KEY);
    if (lastSubmissionTime) {
      const elapsed = Date.now() - parseInt(lastSubmissionTime);
      if (elapsed < COOLDOWN_DURATION) {
        const remaining = Math.ceil((COOLDOWN_DURATION - elapsed) / 1000);
        setIsOnCooldown(true);
        setCooldownRemaining(remaining);
      } else {
        localStorage.removeItem(COOLDOWN_KEY);
      }
    }
  }, []);

  useEffect(() => {
    if (!isOnCooldown) return;

    const interval = setInterval(() => {
      const lastSubmissionTime = localStorage.getItem(COOLDOWN_KEY);
      if (lastSubmissionTime) {
        const elapsed = Date.now() - parseInt(lastSubmissionTime);
        if (elapsed < COOLDOWN_DURATION) {
          const remaining = Math.ceil((COOLDOWN_DURATION - elapsed) / 1000);
          setCooldownRemaining(remaining);
        } else {
          setIsOnCooldown(false);
          localStorage.removeItem(COOLDOWN_KEY);
          clearInterval(interval);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isOnCooldown]);

  const formatCooldown = (seconds: number): string => {
    if (seconds < 60) {
      return `Wait ${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `Wait ${minutes}m ${secs}s`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if webhook URL is configured
    if (!WEBHOOK_URL) {
      console.error('Webhook URL not configured. WEBHOOK_URL:', WEBHOOK_URL);
      setErrorMessage('Submission service is not configured. Please try again later.');
      setFormState('error');
      return;
    }
    
    // Check if on cooldown
    if (isOnCooldown) {
      setErrorMessage(`Please ${formatCooldown(cooldownRemaining).toLowerCase()} before submitting again.`);
      setFormState('error');
      return;
    }

    setFormState('submitting');
    setErrorMessage('');

    try {
      const payload = {
        embeds: [
          {
            title: '📋 New Server Submission',
            color: 0xf97316,
            fields: [
              {
                name: 'Invite Link',
                value: inviteLink,
                inline: false,
              },
              {
                name: 'Region',
                value: region,
                inline: true,
              },
              {
                name: 'Contact',
                value: contactInfo,
                inline: true,
              },
              {
                name: 'Additional Notes',
                value: notes || 'None',
                inline: false,
              },
            ],
            timestamp: new Date().toISOString(),
          },
        ],
      };

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error('Webhook error:', response.status, response.statusText);
        throw new Error(`Webhook error: ${response.status}`);
      }

      // Set cooldown
      localStorage.setItem(COOLDOWN_KEY, Date.now().toString());
      setIsOnCooldown(true);
      setCooldownRemaining(Math.ceil(COOLDOWN_DURATION / 1000));

      setFormState('success');
      setTimeout(() => {
        setFormState('idle');
        setServerName('');
        setInviteLink('');
        setRegion('');
        setContactInfo('');
        setNotes('');
      }, 3000);
    } catch (error) {
      console.error('Submission error:', error);
      setErrorMessage('Failed to submit. Please try again.');
      setFormState('error');
      setTimeout(() => {
        setFormState('idle');
        setErrorMessage('');
      }, 3000);
    }
  };
  const inputClasses =
  'w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-neutral-500 outline-none transition-all focus:border-orange-500/50 focus:bg-white/[0.07] focus:ring-1 focus:ring-orange-500/20';
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      transition={{
        duration: 0.5,
        delay: 0.6
      }}>
      
      <div className="relative overflow-visible rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl mt-32">
        <div className="absolute -inset-px bg-linear-to-r from-orange-500/10 to-transparent rounded-xl pointer-events-none" />

        {/* Clickable header / toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative z-10 w-full flex items-center justify-between p-5 md:p-6 text-left cursor-pointer group overflow-visible">
          
          <img src="images/Yara2.png" className={`absolute h-[200%] right-0 -top-24 w-1/3 object-cover object-top-right transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`} style={{ maskImage: 'linear-gradient(to right, transparent, black)', WebkitMaskImage: 'linear-gradient(to right, transparent, black)', transform: 'scaleX(-1)' }} />

          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20 shrink-0">
              <Plus className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">
                Submit Your Server
              </h3>
              <p className="text-sm text-neutral-400">
                Want your Bridgewatch Discord listed here?
              </p>
            </div>
          </div>
          <motion.div
            animate={{
              rotate: isOpen ? 180 : 0
            }}
            transition={{
              duration: 0.3
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 shrink-0 ml-4">
            
            <ChevronDown className="h-4 w-4 text-neutral-400" />
          </motion.div>
        </button>

        {/* Collapsible content */}
        <AnimatePresence initial={false}>
          {isOpen &&
          <motion.div
            initial={{
              height: 0,
              opacity: 0
            }}
            animate={{
              height: 'auto',
              opacity: 1
            }}
            exit={{
              height: 0,
              opacity: 0
            }}
            transition={{
              duration: 0.35,
              ease: [0.4, 0, 0.2, 1]
            }}
            className="overflow-hidden">
            
              <div className="relative z-10 px-5 md:px-6 pb-6">

                <img src="images/Yara2.png" className='absolute -z-10 h-full right-0 w-1/3 object-cover object-right' style={{ maskImage: 'linear-gradient(to right, transparent, black)', WebkitMaskImage: 'linear-gradient(to right, transparent, black)', transform: 'scaleX(-1)' }} />

                {/* Contact chips */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6 pb-6 border-b border-white/5">
                  <span className="text-xs text-neutral-500 self-center mr-1">
                    Fill up the form below or reach out to me directly:
                  </span>
                  <div className="flex flex-row gap-3">
                    <div className="flex items-center gap-2.5 rounded-lg bg-white/5 border border-white/10 px-3 py-2">
                      <Gamepad2 className="h-4 w-4 text-orange-500 shrink-0" />
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-neutral-500 block">
                          In-Game (Asia)
                        </span>
                        <span className="text-sm font-semibold text-white">
                          Ela
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 rounded-lg bg-white/5 border border-white/10 px-3 py-2">
                      <MessageSquare className="h-4 w-4 text-orange-500 shrink-0" />
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-neutral-500 block">
                          Discord
                        </span>
                        <span className="text-sm font-semibold text-white">
                          kyurious
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Requirements */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-orange-500" />
                    Server Requirements
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {requirements.map((req) =>
                  <div
                    key={req.label}
                    className="flex items-center gap-2.5 text-xs text-neutral-400">
                    
                        <req.icon className="h-3.5 w-3.5 text-orange-500/70 shrink-0" />
                        <span>{req.label}</span>
                      </div>
                  )}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/5 mb-6" />

                {/* Form */}
                {formState === 'success' ?
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.95
                }}
                animate={{
                  opacity: 1,
                  scale: 1
                }}
                className="flex flex-col items-center justify-center py-10 text-center">
                
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10 border border-green-500/20 mb-4">
                      <CheckCircle className="h-7 w-7 text-green-500" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-1">
                      Submission Received!
                    </h4>
                    <p className="text-sm text-neutral-400">
                      We'll review your server and get back to you soon.
                    </p>
                  </motion.div> :
              
              formState === 'error' ?
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.95
                }}
                animate={{
                  opacity: 1,
                  scale: 1
                }}
                className="flex flex-col items-center justify-center py-10 text-center">
                
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 mb-4">
                      <AlertCircle className="h-7 w-7 text-red-500" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-1">
                      Submission Failed
                    </h4>
                    <p className="text-sm text-neutral-400">
                      {errorMessage}
                    </p>
                  </motion.div> :

              <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                          Invite Link <span className="text-orange-500">*</span>
                        </label>
                        <input
                      type="url"
                      required
                      value={inviteLink}
                      onChange={(e) => setInviteLink(e.target.value)}
                      placeholder="https://discord.gg/..."
                      className={inputClasses} />
                    
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                          Region <span className="text-orange-500">*</span>
                        </label>
                        <select
                      required
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className={`${inputClasses} appearance-none`}>
                      
                          <option value="" className="bg-[#0a0a0f]">
                            Select a region
                          </option>
                          <option value="Asia" className="bg-[#0a0a0f]">
                            Asia
                          </option>
                          <option value="America" className="bg-[#0a0a0f]">
                            America
                          </option>
                          <option value="Europe" className="bg-[#0a0a0f]">
                            Europe
                          </option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                          Your Discord / IGN{' '}
                          <span className="text-orange-500">*</span>
                        </label>
                        <input
                      type="text"
                      required
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                      placeholder="How can we reach you?"
                      className={inputClasses} />
                    
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                        Additional Notes
                      </label>
                      <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Anything else you'd like us to know about your server (Callers, verifications, etc.)..."
                    className={`${inputClasses} resize-none`} />
                  
                    </div>
                    <div className="pt-2">
                      <button
                    type="submit"
                    disabled={formState === 'submitting' || isOnCooldown}
                    className="cursor-pointer flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-orange-600 hover:shadow-[0_0_20px_-5px_rgba(249,115,22,0.5)] disabled:opacity-50 disabled:cursor-not-allowed">
                    
                        {formState === 'submitting' ?
                    <>
                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Submitting...
                          </> :
                    
                    isOnCooldown ?
                    <>
                            <AlertCircle className="h-4 w-4" />
                            {formatCooldown(cooldownRemaining)}
                          </> :

                    <>
                            <Send className="h-4 w-4" />
                            Submit Server
                          </>
                    }
                      </button>
                    </div>
                  </form>
              }
              </div>
            </motion.div>
          }
        </AnimatePresence>
      </div>
    </motion.div>);

}