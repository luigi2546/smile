-- ============================================================
-- Smile Center GH — Seed Data
-- Run AFTER schema.sql. Safe to re-run (uses ON CONFLICT DO NOTHING
-- where a natural key exists).
-- ============================================================

insert into branches (name, address, phone, lat, lng) values
  ('East Legon', 'Lagos Ave, East Legon, Accra', '+233 24 000 0001', 5.6500, -0.1500),
  ('Osu', 'Oxford Street, Osu, Accra', '+233 24 000 0002', 5.5560, -0.1830),
  ('Airport', 'Liberation Rd, Airport Residential, Accra', '+233 24 000 0003', 5.6050, -0.1710),
  ('Kasoa', 'Winneba Rd, Kasoa', '+233 24 000 0004', 5.5320, -0.4160)
on conflict do nothing;

insert into services (name, description, category, price_ghs, duration_minutes) values
  ('Teeth Whitening', 'Instant, dentist-grade brightening', 'Cosmetic', 450.00, 60),
  ('Dental Cleaning', 'Routine hygiene & polishing', 'Preventive', 200.00, 45),
  ('Scaling & Polishing', 'Plaque and stain removal', 'Preventive', 250.00, 45),
  ('Smile Makeover', 'Full cosmetic transformation', 'Cosmetic', 1800.00, 120),
  ('Dental Consultation', 'Personalized treatment plan', 'General', 100.00, 30),
  ('Oral Health Education', 'Preventive care guidance session', 'General', 0.00, 20),
  ('Kids Dentistry', 'Gentle care for young smiles', 'Pediatric', 180.00, 30),
  ('Corporate Package (per employee)', 'Wellness plan for teams', 'Corporate', 350.00, 45)
on conflict do nothing;

-- Sample customers for demo purposes
insert into customers (full_name, phone, email, is_member, membership_started_at, notes)
values
  ('Ama Owusu', '+233241112222', 'ama.owusu@example.com', true, '2026-01-12', 'Prefers morning appointments'),
  ('Kwame Mensah', '+233242223333', 'kwame.mensah@example.com', false, null, null),
  ('Efua Boateng', '+233243334444', 'efua.boateng@example.com', true, '2026-03-02', 'Referred by Ama Owusu')
on conflict (phone) do nothing;
