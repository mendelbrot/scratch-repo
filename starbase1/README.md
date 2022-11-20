## database development workflow
1. edit `public.schema.sql`
2. diff with the migrations folder `bash sb_diff.sh <migration name>`
3. check that the diff for the migration created items in the correct order `supabase db reset`
4. rearrange commands in or delete the last migration file as needed `supabase/migrations/<timestamp>_<migration name>.sql`
5. return to step 1

Do it in small bytes because because the diff tool will make mistakes that are difficult to correct in a large file.  The diff too also creates functions and triggers that are already in previous migrations that must be deleted.