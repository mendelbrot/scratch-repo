drop trigger if exists post_default_ref_id on posts;
drop function if exists post_default_ref_id();
drop table if exists posts;

create table posts (
  id int generated always as identity primary key,
  ref_id int,
  body text
);

create function post_default_ref_id () 
returns trigger as $$ 
begin 
  new.ref_id := new.id;
  return new;
end;
$$ language plpgsql;

create trigger post_default_ref_id
  before insert on posts 
  for each row 
  when (new.ref_id is null)
  execute procedure post_default_ref_id ();

insert into posts (body) values ('Hello!!');
insert into posts (ref_id, body) values (1, 'Hello2U!!');
insert into posts (body) values ('Yay!!!');

select * from posts;