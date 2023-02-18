-- This script was generated by the Schema Diff utility in pgAdmin 4
-- For the circular dependencies, the order in which Schema Diff writes the objects is not very sophisticated
-- and may require manual changes to the script to ensure changes are applied in the correct order.
-- Please report an issue for any failure with the reproduction steps.

CREATE TABLE IF NOT EXISTS public.settings
(
    key character varying(255) COLLATE pg_catalog."default" NOT NULL,
    type character varying(255) COLLATE pg_catalog."default" NOT NULL,
    data jsonb,
    CONSTRAINT settings_pkey PRIMARY KEY (key)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.settings
    OWNER to postgres;

GRANT ALL ON TABLE public.settings TO anon;

GRANT ALL ON TABLE public.settings TO authenticated;

GRANT ALL ON TABLE public.settings TO postgres;

GRANT ALL ON TABLE public.settings TO service_role;
CREATE POLICY authenticated_read
    ON public.settings
    AS PERMISSIVE
    FOR SELECT
    TO authenticated
    USING (true);

-- Type: access_level

-- DROP TYPE IF EXISTS public.access_level;

CREATE TYPE public.access_level AS ENUM
    ('read', 'edit');

ALTER TYPE public.access_level
    OWNER TO postgres;

CREATE OR REPLACE FUNCTION public.trigger_set_updated_timestamp()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
 
begin 
  new.created_at := old.created_at;
  new.updated_at := now();
  return new;
end;
$BODY$;

ALTER FUNCTION public.trigger_set_updated_timestamp()
    OWNER TO postgres;

GRANT EXECUTE ON FUNCTION public.trigger_set_updated_timestamp() TO authenticated;

GRANT EXECUTE ON FUNCTION public.trigger_set_updated_timestamp() TO postgres;

GRANT EXECUTE ON FUNCTION public.trigger_set_updated_timestamp() TO PUBLIC;

GRANT EXECUTE ON FUNCTION public.trigger_set_updated_timestamp() TO anon;

GRANT EXECUTE ON FUNCTION public.trigger_set_updated_timestamp() TO service_role;

CREATE OR REPLACE FUNCTION public.trigger_set_created_timestamp()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
 
begin 
  new.created_at := now();
  new.updated_at := now();
  return new;
end;
$BODY$;

ALTER FUNCTION public.trigger_set_created_timestamp()
    OWNER TO postgres;

GRANT EXECUTE ON FUNCTION public.trigger_set_created_timestamp() TO authenticated;

GRANT EXECUTE ON FUNCTION public.trigger_set_created_timestamp() TO postgres;

GRANT EXECUTE ON FUNCTION public.trigger_set_created_timestamp() TO PUBLIC;

GRANT EXECUTE ON FUNCTION public.trigger_set_created_timestamp() TO anon;

GRANT EXECUTE ON FUNCTION public.trigger_set_created_timestamp() TO service_role;

CREATE TABLE IF NOT EXISTS public.projects
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    theme_key text COLLATE pg_catalog."default",
    CONSTRAINT projects_pkey PRIMARY KEY (id),
    CONSTRAINT fk_theme FOREIGN KEY (theme_key)
        REFERENCES public.settings (key) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.projects
    OWNER to postgres;

ALTER TABLE IF EXISTS public.projects
    ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.projects TO anon;

GRANT ALL ON TABLE public.projects TO authenticated;

GRANT ALL ON TABLE public.projects TO postgres;

GRANT ALL ON TABLE public.projects TO service_role;

CREATE TABLE IF NOT EXISTS public.project_users
(
    project_id integer NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    access access_level NOT NULL,
    CONSTRAINT project_users_pkey PRIMARY KEY (project_id, user_id),
    CONSTRAINT fk_project FOREIGN KEY (project_id)
        REFERENCES public.projects (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT fk_user FOREIGN KEY (user_id)
        REFERENCES auth.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.project_users
    OWNER to postgres;

ALTER TABLE IF EXISTS public.project_users
    ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.project_users TO anon;

GRANT ALL ON TABLE public.project_users TO authenticated;

GRANT ALL ON TABLE public.project_users TO postgres;

GRANT ALL ON TABLE public.project_users TO service_role;

CREATE TRIGGER set_created_timestamp
    BEFORE UPDATE 
    ON public.project_users
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_set_updated_timestamp();

CREATE TRIGGER set_updated_timestamp
    BEFORE INSERT
    ON public.project_users
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_set_created_timestamp();


CREATE OR REPLACE FUNCTION public.trigger_insert_project_user()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
 
begin 
  insert into public.project_users 
    (project_id, user_id, access) values
    (new.id, auth.uid(), 'edit');
end;
$BODY$;

ALTER FUNCTION public.trigger_insert_project_user()
    OWNER TO postgres;

GRANT EXECUTE ON FUNCTION public.trigger_insert_project_user() TO authenticated;

GRANT EXECUTE ON FUNCTION public.trigger_insert_project_user() TO postgres;

GRANT EXECUTE ON FUNCTION public.trigger_insert_project_user() TO PUBLIC;

GRANT EXECUTE ON FUNCTION public.trigger_insert_project_user() TO anon;

GRANT EXECUTE ON FUNCTION public.trigger_insert_project_user() TO service_role;




CREATE POLICY project_editors_and_readers_can_select
    ON public.projects
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING ((EXISTS ( SELECT 1
   FROM project_users pu
  WHERE ((pu.project_id = projects.id) AND (pu.user_id = auth.uid()) AND ((pu.access = 'edit'::access_level) OR (pu.access = 'read'::access_level)))
 LIMIT 1)));
CREATE POLICY project_editors_can_delete
    ON public.projects
    AS PERMISSIVE
    FOR DELETE
    TO public
    USING ((EXISTS ( SELECT 1
   FROM project_users pu
  WHERE ((pu.project_id = projects.id) AND (pu.user_id = auth.uid()) AND (pu.access = 'edit'::access_level))
 LIMIT 1)));
CREATE POLICY project_editors_can_insert
    ON public.projects
    AS PERMISSIVE
    FOR INSERT
    TO authenticated
    WITH CHECK ((EXISTS ( SELECT 1
   FROM project_users pu
  WHERE ((pu.project_id = projects.id) AND (pu.user_id = auth.uid()) AND (pu.access = 'edit'::access_level))
 LIMIT 1)));
CREATE POLICY project_editors_can_update
    ON public.projects
    AS PERMISSIVE
    FOR UPDATE
    TO public
    USING ((EXISTS ( SELECT 1
   FROM project_users pu
  WHERE ((pu.project_id = projects.id) AND (pu.user_id = auth.uid()) AND (pu.access = 'edit'::access_level))
 LIMIT 1)));

CREATE TRIGGER insert_project_user
    AFTER INSERT
    ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_insert_project_user();

CREATE TRIGGER set_created_timestamp
    BEFORE UPDATE 
    ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_set_updated_timestamp();

CREATE TRIGGER set_updated_timestamp
    BEFORE INSERT
    ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_set_created_timestamp();
