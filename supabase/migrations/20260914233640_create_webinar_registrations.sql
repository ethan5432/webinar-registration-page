/*
# Create webinar_registrations table (single-tenant, no auth)

1. New Tables
- `webinar_registrations`
  - `id` (uuid, primary key)
  - `registrant_type` (text, not null) — Creator, Agency, Network, Brand, or Other
  - `name` (text, not null)
  - `email` (text, not null)
  - `website` (text, nullable) — optional website or main channel
  - `why` (text, nullable) — optional reason for interest
  - `source` (text, default 'webinar')
  - `created_at` (timestamptz, default now())
2. Security
- Enable RLS on `webinar_registrations`.
- Allow anon + authenticated INSERT only (open registration, no sign-in).
- No SELECT/UPDATE/DELETE for anon — registrations are write-only from the public form.
*/

CREATE TABLE IF NOT EXISTS webinar_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registrant_type text NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  website text,
  why text,
  source text NOT NULL DEFAULT 'webinar',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE webinar_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_webinar_registrations" ON webinar_registrations;
CREATE POLICY "anon_insert_webinar_registrations"
ON webinar_registrations FOR INSERT
TO anon, authenticated WITH CHECK (true);
