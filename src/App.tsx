import { useState } from 'react';
import { Check } from 'lucide-react';
import logo from '/careverse_wordmark.svg';

const FORM_ENDPOINT = 'FORM_ENDPOINT';

const REGISTRANT_TYPES = ['Creator', 'Agency', 'Network', 'Brand', 'Other'] as const;
type RegistrantType = (typeof REGISTRANT_TYPES)[number];

const inputClass =
  'w-full rounded-input border border-line bg-white px-4 text-[15px] text-ink h-12 focus:outline-none transition-duration-220';

const labelClass =
  'block text-[12px] font-extrabold text-ink uppercase tracking-[0.08em] mb-2';

const optionalTag =
  'text-muted font-normal normal-case tracking-normal';

export default function App() {
  const [registrantType, setRegistrantType] = useState<RegistrantType | ''>('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [why, setWhy] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  function validate(): string | null {
    if (!registrantType) return 'Please select how you\'re registering.';
    if (!name.trim()) return 'Please enter your name.';
    if (!email.trim()) return 'Please enter your email.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return 'Please enter a valid email address.';
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setError('');
    setSubmitting(true);

    const payload = {
      registrant_type: registrantType,
      name: name.trim(),
      email: email.trim(),
      website: website.trim(),
      why: why.trim(),
      source: 'webinar',
    };

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
      setSubmitted(true);
    } catch {
      setError('Something went wrong submitting the form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-card shadow-[0_4px_24px_rgba(24,25,29,0.06)] border border-line p-10 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-[#E8FBF4] flex items-center justify-center mb-6">
            <Check className="w-8 h-8 text-good" strokeWidth={2.5} />
          </div>
          <h1 className="text-[32px] font-bold text-ink leading-[1.1] tracking-[-0.03em] mb-4">
            You're registered.
          </h1>
          <div className="w-10 h-[3px] bg-red mx-auto mb-6" />
          <p className="text-[18px] text-ink font-medium leading-[1.5] mb-5">
            You're all set for the Careverse webinar.
          </p>
          <p className="text-[16px] text-body leading-[1.62] mb-4">
            We'll send your webinar access link by email on the day of the event.
          </p>
          <p className="text-[15px] text-muted leading-[1.62]">
            Please keep an eye on your inbox for the link and webinar details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream font-sans text-body">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-cream/88 backdrop-blur-md border-b border-line h-[72px] md:h-[82px] flex items-center px-6 md:px-10">
        <img src={logo} alt="Careverse" className="h-7 md:h-8 w-auto" />
      </header>

      {/* Hero */}
      <section className="px-6 pt-16 pb-14 max-w-3xl mx-auto text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="w-6 h-[3px] bg-red" />
          <span className="text-eyebrow text-muted uppercase">Partner Webinar</span>
        </div>
        <h1 className="text-ink font-bold leading-[0.94] tracking-[-0.06em] text-[clamp(56px,6.7vw,88px)] mb-6">
          Reserve your seat
        </h1>
        <p className="text-[20px] text-body font-normal leading-[1.62] max-w-[650px] mx-auto">
          September 30 · 2:00 PM ET · 45 minutes
        </p>
      </section>

      {/* Form card */}
      <main className="px-6 pb-20">
        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto bg-white rounded-card shadow-[0_4px_24px_rgba(24,25,29,0.06)] border border-line p-6 md:p-9"
        >
          {/* Registrant type */}
          <div className="mb-5">
            <p className={`${labelClass} mb-3`}>
              I'm registering as <span className="text-red">*</span>
            </p>
            <div className="flex flex-wrap gap-3">
              {REGISTRANT_TYPES.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setRegistrantType(opt)}
                  className={`px-6 h-11 rounded-pill text-[13px] font-extrabold border transition-colors duration-220 ${
                    registrantType === opt
                      ? 'bg-ink border-ink text-white'
                      : 'bg-white border-line text-body hover:border-ink'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div className="mb-5">
            <label htmlFor="name" className={labelClass}>
              Name <span className="text-red">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              placeholder="Alex Rivera"
            />
          </div>

          {/* Email */}
          <div className="mb-5">
            <label htmlFor="email" className={labelClass}>
              Email <span className="text-red">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="alex@example.com"
            />
          </div>

          {/* Website / main channel */}
          <div className="mb-8">
            <label htmlFor="website" className={labelClass}>
              Website or main channel{' '}
              <span className={optionalTag}>(optional)</span>
            </label>
            <input
              id="website"
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className={inputClass}
              placeholder="yoursite.com, @handle, or channel URL"
            />
          </div>

          {/* Why interested */}
          <div className="mb-9">
            <label htmlFor="why" className={labelClass}>
              Why you're interested{' '}
              <span className={optionalTag}>(optional)</span>
            </label>
            <textarea
              id="why"
              value={why}
              onChange={(e) => setWhy(e.target.value)}
              rows={4}
              className="w-full rounded-input border border-line bg-white px-4 py-3 text-[15px] text-ink focus:outline-none transition-duration-220 resize-none"
              placeholder="Tell us what you hope to get out of the webinar."
            />
          </div>

          {/* Error */}
          {error && (
            <p className="mb-5 text-[13px] text-red bg-red/5 border border-red/15 rounded-input px-4 py-3 leading-[1.55]">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-ink text-white font-extrabold text-[15px] rounded-pill h-[54px] px-8 transition-transform duration-220 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {submitting ? 'Reserving…' : 'Reserve my seat'}
          </button>

          <p className="mt-5 text-center text-legal text-muted">
            You'll get your webinar access link by email.
          </p>
        </form>
      </main>

      {/* Footer */}
      <footer className="bg-night px-6 py-12 text-center">
        <div className="inline-block bg-white rounded-lg px-3 py-1.5 mx-auto mb-4">
          <img src={logo} alt="Careverse" className="h-6 w-auto" />
        </div>
        <p className="text-[13px] text-night-text leading-[1.55]">
          Careverse Partner Program
        </p>
      </footer>
    </div>
  );
}
