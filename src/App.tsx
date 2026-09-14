import { useState } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
import logo from '/careverse_wordmark.svg';

const FORM_ENDPOINT = 'FORM_ENDPOINT';

const PLATFORMS = [
  'Instagram',
  'TikTok',
  'YouTube',
  'Facebook',
  'X',
  'LinkedIn',
  'Blog / site',
  'Other',
] as const;

type Platform = (typeof PLATFORMS)[number];

interface ChannelRow {
  id: number;
  platform: string;
  handle: string;
}

let nextId = 2;

function makeChannel(platform = '', handle = ''): ChannelRow {
  return { id: nextId++, platform, handle };
}

function channelsToText(rows: ChannelRow[]): string {
  return rows
    .filter((r) => r.platform.trim() && r.handle.trim())
    .map((r) => `${r.platform} ${r.handle}`)
    .join(' | ');
}

const inputClass =
  'w-full rounded-input border border-line bg-white px-4 text-[15px] text-ink h-12 focus:outline-none transition-duration-220';

export default function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [channels, setChannels] = useState<ChannelRow[]>([makeChannel()]);
  const [why, setWhy] = useState('');
  const [alreadyApplied, setAlreadyApplied] = useState<'yes' | 'no' | ''>('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  function updateChannel(id: number, field: 'platform' | 'handle', value: string) {
    setChannels((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }

  function addChannel() {
    setChannels((prev) => [...prev, makeChannel()]);
  }

  function removeChannel(id: number) {
    setChannels((prev) => (prev.length <= 1 ? prev : prev.filter((r) => r.id !== id)));
  }

  function validate(): string | null {
    if (!name.trim()) return 'Please enter your first name.';
    if (!email.trim()) return 'Please enter your email.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return 'Please enter a valid email address.';

    for (const r of channels) {
      const p = r.platform.trim();
      const h = r.handle.trim();
      if (p && !h) return 'Every platform needs a handle or URL.';
      if (h && !p) return 'Every handle needs a platform selected.';
    }
    const first = channels[0];
    if (!first.platform.trim() || !first.handle.trim())
      return 'Please add at least one social channel.';

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
      name: name.trim(),
      email: email.trim(),
      channels: channels
        .filter((r) => r.platform.trim() && r.handle.trim())
        .map((r) => ({ platform: r.platform, handle: r.handle.trim() })),
      channels_text: channelsToText(channels),
      why: why.trim(),
      already_applied: alreadyApplied || 'no',
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
          <h1 className="text-[32px] font-bold text-ink leading-[1.1] tracking-[-0.03em] mb-3">
            You're registered.
          </h1>
          <p className="text-[18px] text-body leading-[1.62]">
            Check your email for the link.
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
        <div className="flex-1" />
        <a
          href="#"
          className="hidden md:inline-flex items-center justify-center bg-ink text-white font-extrabold text-[15px] rounded-pill h-11 px-6 hover:-translate-y-0.5 transition-transform duration-220"
        >
          Apply to join
        </a>
      </header>

      {/* Hero */}
      <section className="px-6 pt-16 pb-14 max-w-3xl mx-auto text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="w-6 h-[3px] bg-red" />
          <span className="text-eyebrow text-muted uppercase">Creator Webinar</span>
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
          {/* Name */}
          <div className="mb-5">
            <label
              htmlFor="name"
              className="block text-[12px] font-extrabold text-ink uppercase tracking-[0.08em] mb-2"
            >
              First name <span className="text-red">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              placeholder="Alex"
            />
          </div>

          {/* Email */}
          <div className="mb-8">
            <label
              htmlFor="email"
              className="block text-[12px] font-extrabold text-ink uppercase tracking-[0.08em] mb-2"
            >
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

          {/* Social channels */}
          <fieldset className="mb-8">
            <legend className="block text-[12px] font-extrabold text-ink uppercase tracking-[0.08em] mb-2">
              Your social channels <span className="text-red">*</span>
            </legend>
            <p className="text-[13px] text-muted leading-[1.55] mb-4">
              Add at least one. First row is required.
            </p>

            <div className="space-y-3">
              {channels.map((row, idx) => (
                <div
                  key={row.id}
                  className="flex flex-col sm:flex-row gap-2 sm:items-center"
                >
                  <select
                    value={row.platform}
                    onChange={(e) => updateChannel(row.id, 'platform', e.target.value)}
                    className={`${inputClass} sm:w-44 sm:flex-none`}
                  >
                    <option value="">Platform</option>
                    {PLATFORMS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={row.handle}
                    onChange={(e) => updateChannel(row.id, 'handle', e.target.value)}
                    className={`${inputClass} flex-1`}
                    placeholder="@handle or URL"
                  />
                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => removeChannel(row.id)}
                      aria-label="Remove channel"
                      className="flex items-center justify-center gap-1 text-[13px] text-muted hover:text-red transition-colors duration-220 px-2 h-12 sm:h-12 sm:px-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="sm:hidden">Remove</span>
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addChannel}
              className="mt-4 inline-flex items-center gap-2 text-[13px] font-extrabold text-ink hover:text-red transition-colors duration-220"
            >
              <Plus className="w-4 h-4" />
              Add another channel
            </button>
          </fieldset>

          {/* Why interested */}
          <div className="mb-8">
            <label
              htmlFor="why"
              className="block text-[12px] font-extrabold text-ink uppercase tracking-[0.08em] mb-2"
            >
              Why you're interested{' '}
              <span className="text-muted font-normal normal-case tracking-normal">
                (optional)
              </span>
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

          {/* Already applied */}
          <div className="mb-9">
            <p className="block text-[12px] font-extrabold text-ink uppercase tracking-[0.08em] mb-3">
              Already applied to the Partner Program?{' '}
              <span className="text-muted font-normal normal-case tracking-normal">
                (optional)
              </span>
            </p>
            <div className="flex gap-3">
              {(['yes', 'no'] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() =>
                    setAlreadyApplied((prev) => (prev === opt ? '' : opt))
                  }
                  className={`px-7 h-11 rounded-pill text-[13px] font-extrabold border transition-colors duration-220 capitalize ${
                    alreadyApplied === opt
                      ? 'bg-ink border-ink text-white'
                      : 'bg-white border-line text-body hover:border-ink'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
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
            Applications reviewed in 7 business days.
          </p>
        </form>
      </main>

      {/* Footer */}
      <footer className="bg-night px-6 py-12 text-center">
        <img src={logo} alt="Careverse" className="h-7 w-auto mx-auto mb-4" />
        <p className="text-[13px] text-night-text leading-[1.55]">
          Careverse Partner Program
        </p>
      </footer>
    </div>
  );
}
