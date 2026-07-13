-- Whitening-session details for existing Smile Center databases.
alter table appointments add column if not exists amount_paid_ghs numeric(10, 2) not null default 0;
alter table appointments add column if not exists session_number int not null default 1;
alter table appointments add column if not exists total_sessions int not null default 1;
alter table appointments add column if not exists shade_before text;
alter table appointments add column if not exists shade_after text;
alter table appointments add column if not exists follow_up_date date;
alter table appointments add column if not exists consent_confirmed boolean not null default false;

alter table appointments drop constraint if exists appointments_amount_paid_nonnegative;
alter table appointments add constraint appointments_amount_paid_nonnegative check (amount_paid_ghs >= 0);
alter table appointments drop constraint if exists appointments_session_number_positive;
alter table appointments add constraint appointments_session_number_positive check (session_number > 0);
alter table appointments drop constraint if exists appointments_total_sessions_positive;
alter table appointments add constraint appointments_total_sessions_positive check (total_sessions > 0);
alter table appointments drop constraint if exists appointments_session_progress_valid;
alter table appointments add constraint appointments_session_progress_valid check (session_number <= total_sessions);
