-- This script was generated by the Schema Diff utility in pgAdmin 4
-- For the circular dependencies, the order in which Schema Diff writes the objects is not very sophisticated
-- and may require manual changes to the script to ensure changes are applied in the correct order.
-- Please report an issue for any failure with the reproduction steps.

CREATE TABLE IF NOT EXISTS public.settings
(
    key text COLLATE pg_catalog."default" NOT NULL,
    type text COLLATE pg_catalog."default" NOT NULL,
    data jsonb,
    CONSTRAINT settings_pkey PRIMARY KEY (key)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.settings
    OWNER to postgres;

ALTER TABLE IF EXISTS public.settings
    ENABLE ROW LEVEL SECURITY;

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
