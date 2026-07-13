-- Private treatment-photo storage for whitening session records.
alter table appointments add column if not exists before_photo_path text;
alter table appointments add column if not exists after_photo_path text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'treatment-photos',
  'treatment-photos',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "staff can view treatment photos" on storage.objects;
create policy "staff can view treatment photos" on storage.objects
  for select to authenticated
  using (bucket_id = 'treatment-photos');

drop policy if exists "staff can upload treatment photos" on storage.objects;
create policy "staff can upload treatment photos" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'treatment-photos');

drop policy if exists "staff can update treatment photos" on storage.objects;
create policy "staff can update treatment photos" on storage.objects
  for update to authenticated
  using (bucket_id = 'treatment-photos')
  with check (bucket_id = 'treatment-photos');
