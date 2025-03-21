
-- SQL script to create storage bucket for capsule contents
insert into storage.buckets (id, name, public)
values ('capsule-contents', 'Capsule Contents', true);

-- Allow anonymous uploads for now, we'll use RLS to restrict uploads later
create policy "Anyone can upload capsule contents"
on storage.objects for insert
with check (bucket_id = 'capsule-contents');

create policy "Anyone can view capsule contents"
on storage.objects for select
using (bucket_id = 'capsule-contents');
