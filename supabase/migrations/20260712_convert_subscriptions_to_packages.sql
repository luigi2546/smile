alter table subscription_plans add column if not exists session_count int not null default 1;
alter table subscriptions add column if not exists sessions_total int not null default 1;
alter table subscriptions add column if not exists sessions_used int not null default 0;
alter table subscriptions add column if not exists amount_paid_ghs numeric(10, 2) not null default 0;

alter table subscription_plans drop constraint if exists subscription_plans_session_count_positive;
alter table subscription_plans add constraint subscription_plans_session_count_positive check (session_count > 0);
alter table subscriptions drop constraint if exists subscriptions_session_usage_valid;
alter table subscriptions add constraint subscriptions_session_usage_valid check (sessions_total > 0 and sessions_used >= 0 and sessions_used <= sessions_total);
alter table subscriptions drop constraint if exists subscriptions_amount_paid_nonnegative;
alter table subscriptions add constraint subscriptions_amount_paid_nonnegative check (amount_paid_ghs >= 0);

update subscriptions s set sessions_total = p.session_count
from subscription_plans p where s.plan_id = p.id and s.sessions_total = 1;
