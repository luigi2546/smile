alter table appointments add column if not exists visit_type text not null default 'booking'
  check (visit_type in ('booking', 'walk_in'));
alter table appointments add column if not exists payment_method text;
alter table appointments add column if not exists payment_ref text;

create index if not exists appointments_payment_ref_idx on appointments (payment_ref);
