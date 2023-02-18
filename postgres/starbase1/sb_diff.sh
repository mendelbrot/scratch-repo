#!/usr/bin/env bash

# diff public.schema.sql with the migrations folder.

# an elaborate workaround to accomplish my preferred development workflow
# within the confines of the supabase cli.  public.schema.sql is my "database code"
# and single source of truth.  i edit it and create migrations from it by a diff
# with previous migrations

# INPUTS
# accepts one positional argument: the filename to output

# OUTPUTS
# a migration file: supabase/migrations/<timestamp>_<user input>.sql

echo "# 1. rename migrations to migrations-temp"
mv supabase/migrations supabase/migrations-temp

echo "# 2. create migrations folder"
mkdir supabase/migrations

echo "# 3. copy schema file to migrations folder"
cp public.schema.sql supabase/migrations/1.sql

echo "# 4. reset the database to the migrations folder"
supabase db reset

echo "# 5. delete schema file from migrations folder"
rm supabase/migrations/1.sql

echo "# 6. delete migrations folder"
rmdir supabase/migrations

echo "# 7. rename migrations-temp to migrations"
mv supabase/migrations-temp supabase/migrations

echo "# 8. diff the migrations folder with the database"
supabase db diff -s public -f "$1"