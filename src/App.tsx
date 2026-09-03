import { useState } from 'react';
import { Plus, Trash2, Check, Sparkles } from 'lucide-react';
import logo from '/image.png';

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
    } catch (err) {
      setError(
        'Something went wrong submitting the form. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blushWash to-skyWash/40 flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-pink-100/60 p-10 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-blush flex items-center justify-center mb-6">
            <Check className="w-8 h-8 text-headline" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-semibold text-headline mb-3">
            You're registered.
          </h1>
          <p className="text-body text-lg">
            Check your email for the link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blushWash via-white to-skyWash/30 font-sans text-body">
      {/* Header */}
      <header className="px-6 py-8 flex items-center justify-center gap-2">
        <img src={logo} alt="Careverse" className="h-10 w-auto" />
      </header>

      {/* Hero */}
      <section className="px-6 pt-6 pb-10 text-center max-w-xl mx-auto">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-headline/70 bg-blushWash border border-blush/40 rounded-full px-3 py-1 mb-6">
          <Sparkles className="w-3.5 h-3.5 text-blush" />
          Creator Webinar
        </span>
        <h1 className="text-4xl sm:text-5xl font-semibold text-headline leading-tight tracking-tight mb-4">
          Reserve your seat
        </h1>
        <p className="text-lg text-body/80">
          September 30 · 2:00 PM ET · 45 minutes
        </p>
      </section>

      {/* Form card */}
      <main className="px-6 pb-20">
        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl shadow-pink-100/50 border border-pink-100/60 p-6 sm:p-9"
        >
          {/* Name */}
          <div className="mb-5">
            <label htmlFor="name" className="block text-sm font-medium text-headline mb-1.5">
              First name <span className="text-blush">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-body focus:outline-none focus:ring-2 focus:ring-blush/60 focus:border-blush transition"
              placeholder="Alex"
            />
          </div>

          {/* Email */}
          <div className="mb-7">
            <label htmlFor="email" className="block text-sm font-medium text-headline mb-1.5">
              Email <span className="text-blush">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-body focus:outline-none focus:ring-2 focus:ring-blush/60 focus:border-blush transition"
              placeholder="alex@example.com"
            />
          </div>

          {/* Social channels */}
          <fieldset className="mb-7">
            <legend className="block text-sm font-medium text-headline mb-1.5">
              Your social channels <span className="text-blush">*</span>
            </legend>
            <p className="text-sm text-body/60 mb-4">
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
                    className="rounded-xl border border-gray-200 px-3 py-3 text-body bg-white focus:outline-none focus:ring-2 focus:ring-blush/60 focus:border-blush transition sm:w-40"
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
                    className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-body focus:outline-none focus:ring-2 focus:ring-blush/60 focus:border-blush transition"
                    placeholder="@handle or URL"
                  />
                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => removeChannel(row.id)}
                      aria-label="Remove channel"
                      className="flex items-center justify-center gap-1 text-sm text-body/50 hover:text-rose-500 transition px-2 py-3 sm:py-0"
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
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-headline hover:text-blush transition"
            >
              <Plus className="w-4 h-4" />
              Add another channel
            </button>
          </fieldset>

          {/* Why interested */}
          <div className="mb-7">
            <label
              htmlFor="why"
              className="block text-sm font-medium text-headline mb-1.5"
            >
              Why you're interested <span className="text-body/40 font-normal">(optional)</span>
            </label>
            <textarea
              id="why"
              value={why}
              onChange={(e) => setWhy(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-body focus:outline-none focus:ring-2 focus:ring-blush/60 focus:border-blush transition resize-none"
              placeholder="Tell us what you hope to get out of the webinar."
            />
          </div>

          {/* Already applied */}
          <div className="mb-8">
            <p className="block text-sm font-medium text-headline mb-1.5">
              Already applied to the Creator Network?{' '}
              <span className="text-body/40 font-normal">(optional)</span>
            </p>
            <div className="flex gap-3">
              {(['yes', 'no'] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() =>
                    setAlreadyApplied((prev) => (prev === opt ? '' : opt))
                  }
                  className={`px-6 py-2.5 rounded-full text-sm font-medium border transition capitalize ${
                    alreadyApplied === opt
                      ? 'bg-blush border-blush text-headline'
                      : 'bg-white border-gray-200 text-body hover:border-blush/60'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="mb-4 text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blush hover:bg-blush/90 text-headline font-semibold text-lg rounded-pill py-4 px-8 transition shadow-lg shadow-pink-200/50 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? 'Reserving…' : 'Reserve my seat'}
          </button>
        </form>
      </main>

      {/* Footer */}
      <footer className="px-6 pb-10 text-center">
        <p className="text-sm text-body/50">
          Careverse Creator Network
        </p>
      </footer>
    </div>
  );
}
