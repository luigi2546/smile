-- Remove discontinued Stitch design-rendering data.
-- SMS had no database table; its application code and navigation are removed separately.
drop table if exists stitch_renders cascade;

delete from storage.objects where bucket_id = 'renders';
delete from storage.buckets where id = 'renders';
