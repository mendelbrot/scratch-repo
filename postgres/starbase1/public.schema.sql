-- trigger: auto set timestamp

create function trigger_set_updated_timestamp () 
returns trigger as $$ 
begin 
  new.created_at := old.created_at;
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

create function trigger_set_created_timestamp () 
returns trigger as $$ 
begin 
  new.created_at := now();
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;


-- table: settings

create table public.settings (
  key varchar(255) primary key,
  type varchar(255) not null,
  data jsonb
);

create policy authenticated_read
  on public.settings
  as permissive
  for select
  to authenticated
  using (true);


-- table: projects

create table public.projects (
  id int generated always as identity primary key,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  name varchar(255) not null,
  theme_key text,
  constraint fk_theme foreign key (theme_key) references public.settings (key)
);

create trigger set_created_timestamp 
  before update on projects 
  for each row execute procedure trigger_set_updated_timestamp ();

create trigger set_updated_timestamp 
  before insert on projects 
  for each row execute procedure trigger_set_created_timestamp ();

alter table public.projects
  enable row level security;


-- table: project_users

create type access_level as enum ('read', 'edit');

create table public.project_users (
  project_id int not null,
  user_id uuid not null,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  access access_level not null,
  constraint fk_project foreign key (project_id) references public.projects (id),
  constraint fk_user foreign key (user_id) references auth.users (id),
  primary key (project_id, user_id)
);

create trigger set_created_timestamp 
  before update on project_users 
  for each row execute procedure trigger_set_updated_timestamp ();

create trigger set_updated_timestamp 
  before insert on project_users 
  for each row execute procedure trigger_set_created_timestamp ();

alter table public.project_users
  enable row level security;

-- project_user rls policies




-- projects rls policies

create policy project_editors_and_readers_can_select
on public.projects
for select using ( exists (
  select 1 from public.project_users as pu where 
    pu.project_id = id and pu.user_id = auth.uid() and 
    (pu.access = 'edit' or pu.access = 'read')
    limit 1
));

create policy project_editors_can_insert
on public.projects
for insert to authenticated with check ( exists (
  select 1 from public.project_users as pu where 
    pu.project_id = id and pu.user_id = auth.uid() and pu.access = 'edit'
    limit 1
));

create policy project_editors_can_update
on public.projects
for update using ( exists (
  select 1 from public.project_users as pu where 
    pu.project_id = id and pu.user_id = auth.uid() and pu.access = 'edit'
    limit 1
));

create policy project_editors_can_delete
on public.projects
for delete using ( exists (
  select 1 from public.project_users as pu where 
    pu.project_id = id and pu.user_id = auth.uid() and pu.access = 'edit'
    limit 1
));


-- trigger: create a project user when a user creates a project

create function trigger_insert_project_user () 
returns trigger as $$ 
begin 
  insert into public.project_users 
    (project_id, user_id, access) values
    (new.id, auth.uid(), 'edit');
end;
$$ language plpgsql;

create trigger insert_project_user 
  after insert on projects 
  for each row execute procedure trigger_insert_project_user ();


-- table: notes

create table public.notes (
  id int generated always as identity primary key,
  project_id int not null,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  name varchar(255) not null,
  body text,
  constraint fk_project foreign key (project_id) references public.projects (id)
);

create trigger set_created_timestamp 
  before update on notes 
  for each row execute procedure trigger_set_updated_timestamp ();

create trigger set_updated_timestamp 
  before insert on notes 
  for each row execute procedure trigger_set_created_timestamp ();

alter table public.notes
  enable row level security;


-- notes rls policies

create policy project_editors_and_readers_can_select
on public.notes
for select using ( exists (
  select 1 from public.project_users as pu where 
    pu.project_id = project_id and pu.user_id = auth.uid() and 
    (pu.access = 'edit' or pu.access = 'read')
    limit 1
));

create policy project_editors_can_insert
on public.notes
for insert to authenticated with check ( exists (
  select 1 from public.project_users as pu where 
    pu.project_id = project_id and pu.user_id = auth.uid() and pu.access = 'edit'
    limit 1
));

create policy project_editors_can_update
on public.notes
for update using ( exists (
  select 1 from public.project_users as pu where 
    pu.project_id = project_id and pu.user_id = auth.uid() and pu.access = 'edit'
    limit 1
));

create policy project_editors_can_delete
on public.notes
for delete using ( exists (
  select 1 from public.project_users as pu where 
    pu.project_id = project_id and pu.user_id = auth.uid() and pu.access = 'edit'
    limit 1
));