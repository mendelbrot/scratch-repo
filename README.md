## the scratch repo

**2022-09-12**

the folders in this repo are for rough work, exploration, tutorials, and so on.  These are not worth having a repo for each one, and i want them in a central place for reference.  

this space is also an archive, for cloning my github repos from as far back as 2017 that i feel sentimental about, so that i can feel safe if i want to delete those repos from github.

there is no .gitignore at the root folder because each project folder has its own .gitignore.

this is how i deleted all the .git folders except for the top level one, as well as all node_modules and venv folders. (the first command shows the folders to be deleted, the second command deletes them)

```
find . | grep "\.git$\|node_modules$\|venv$" | grep -v "\./\.git$"

find . | grep "\.git$\|node_modules$\|venv$" | grep -v "\./\.git$" | xargs rm -rf
```