alter table public.settings
  alter column key type varchar(255);

create or replace function trigger_set_updated_timestamp () 
returns trigger as $$ 
begin 
  new.created_at := old.created_at;
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

create or replace function trigger_set_created_timestamp () 
returns trigger as $$ 
begin 
  new.created_at := now();
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

create table if not exists public.notebooks (
  id int generated always as identity primary key,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  name varchar(255) not null,
  theme_key text,
  constraint fk_theme foreign key (theme_key) references public.settings (key)
);
create trigger set_created_timestamp 
  before update on notebooks 
  for each row execute procedure trigger_set_updated_timestamp ();
create trigger set_updated_timestamp 
  before insert on notebooks 
  for each row execute procedure trigger_set_created_timestamp ();

create type access_level as enum ('read', 'edit');

create table if not exists public.notebook_users (
  notebook_id int not null,
  user_id uuid not null,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  access access_level not null,
  constraint fk_notebook foreign key (notebook_id) references public.notebooks (id),
  constraint fk_user foreign key (user_id) references auth.users (id),
  primary key (notebook_id, user_id)
);
create trigger set_created_timestamp 
  before update on notebook_users 
  for each row execute procedure trigger_set_updated_timestamp ();
create trigger set_updated_timestamp 
  before insert on notebook_users 
  for each row execute procedure trigger_set_created_timestamp ();

create or replace function trigger_insert_notebook_user () 
returns trigger as $$ 
begin 
  insert into public.notebook_users 
    (notebook_id, user_id, access) values
    (new.id, auth.uid(), "edit");
end;
$$ language plpgsql;

create trigger insert_notebook_user 
  after insert on notebooks 
  for each row execute procedure trigger_insert_notebook_user ();

CREATE POLICY identity_update
ON public.notebooks
for update using ( exists (
  select 1 from public.notebook_users as nu where 
    nu.notebook_id = id and nu.user_id = auth.uid() 
    limit 1
));