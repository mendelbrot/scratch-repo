### deploying

https://jekyllrb.com/docs/github-pages/

> User and organization pages live in a special GitHub repository dedicated to only the GitHub Pages files. This repository must be named after the account name. For example, [@mojombo’s user page repository](https://github.com/mojombo/mojombo.github.io) has the name `mojombo.github.io`.
>
> Content from the `master` branch of your repository will be used to build and publish the GitHub Pages site, so make sure your Jekyll site is stored there.



### installing ruby and bundler on linux

WARNING: this is what I initially tried but is wrong.  see below.

```
$ sudo apt-get update
$ sudo apt install ruby
$ ruby -v
$ gem -v
$ sudo gem install bundler
```

### installing jekyll on linux troubleshooting

errors when running `sudo gem install jekyll -v 3.9.0`

```
ERROR:  Error installing jekyll:
ERROR: Failed to build gem native extension.
```

attempting this solution:

https://github.com/jekyll/jekyll/issues/7594#issuecomment-509839929

https://jekyllrb.com/docs/troubleshooting/#no-sudo

added these line to `/home/greg/.bashrc`

```
# Ruby exports

export GEM_HOME=$HOME/gems
export PATH=$HOME/gems/bin:$PATH
```

This was successful in that it changed the directory storing the gems to a user directory and allowed me to run `gem install jekyll bundler` without sudo.  However it did not fix the origional problem.  the sam error was encountered when trying to install jekyll.  This is the terminal message and the error log it refers to:

```
Fetching em-websocket-0.5.2.gem
Fetching http_parser.rb-0.6.0.gem
Fetching jekyll-sass-converter-2.1.0.gem
Fetching ffi-1.14.2.gem
Fetching eventmachine-1.2.7.gem
Fetching sassc-2.4.0.gem
Fetching concurrent-ruby-1.1.8.gem
Fetching i18n-1.8.9.gem
Fetching rb-fsevent-0.10.4.gem
Fetching rb-inotify-0.10.1.gem
Fetching listen-3.4.1.gem
Fetching jekyll-watch-2.2.1.gem
Fetching kramdown-2.3.0.gem
Fetching kramdown-parser-gfm-1.1.0.gem
Fetching liquid-4.0.3.gem
Fetching mercenary-0.4.0.gem
Fetching forwardable-extended-2.6.0.gem
Fetching pathutil-0.16.2.gem
Fetching rouge-3.26.0.gem
Fetching safe_yaml-1.0.5.gem
Fetching unicode-display_width-1.7.0.gem
Fetching terminal-table-2.0.0.gem
Fetching jekyll-4.2.0.gem
Building native extensions. This could take a while...
ERROR:  Error installing jekyll:
        ERROR: Failed to build gem native extension.

    current directory: /home/greg/gems/gems/eventmachine-1.2.7/ext
/usr/bin/ruby2.7 -I /usr/lib/ruby/2.7.0 -r ./siteconf20210228-2101-1ejvp0y.rb extconf.rb
mkmf.rb can't find header files for ruby at /usr/lib/ruby/include/ruby.h

You might have to install separate package for the ruby development
environment, ruby-dev or ruby-devel for example.

extconf failed, exit code 1

Gem files will remain installed in /home/greg/gems/gems/eventmachine-1.2.7 for inspection.
Results logged to /home/greg/gems/extensions/x86_64-linux/2.7.0/eventmachine-1.2.7/gem_make.out
Fetching bundler-2.2.11.gem
Successfully installed bundler-2.2.11
Parsing documentation for bundler-2.2.11
Installing ri documentation for bundler-2.2.11
Done installing documentation for bundler after 1 seconds
1 gem installed
```



```
current directory: /home/greg/gems/gems/eventmachine-1.2.7/ext
/usr/bin/ruby2.7 -I /usr/lib/ruby/2.7.0 -r ./siteconf20210228-2101-1ejvp0y.rb extconf.rb
mkmf.rb can't find header files for ruby at /usr/lib/ruby/include/ruby.h

You might have to install separate package for the ruby development
environment, ruby-dev or ruby-devel for example.

extconf failed, exit code 1
```

I think what i did wrong was didn't install ruby-full:

https://davemateer.com/2020/10/20/running-jekyll-on-wsl2

https://seankilleen.com/2020/07/building-my-jekyll-blog-with-ubuntu-on-wsl2/

```
$ sudo apt-get install ruby-full
```

Then I cd's to the project directory and tried to `bundle exec jekyll serve` but received another error:

```
Bundler could not find compatible versions for gem "eventmachine":
  In snapshot (Gemfile.lock):
    eventmachine (= 1.2.7)

  In Gemfile:
    jekyll (~> 3.8.5) was resolved to 3.8.5, which depends on
      em-websocket (~> 0.5) was resolved to 0.5.1, which depends on
        eventmachine (>= 0.12.9)

Running `bundle update` will rebuild your snapshot from scratch, using only
the gems in your Gemfile, which may resolve the conflict.

Bundler could not find compatible versions for gem "jekyll":
  In snapshot (Gemfile.lock):
    jekyll (= 3.8.5)

  In Gemfile:
    jekyll (~> 3.8.5)

    minima (~> 2.0) was resolved to 2.5.1, which depends on
      jekyll-feed (~> 0.9) was resolved to 0.13.0, which depends on
        jekyll (>= 3.7, < 5.0)

    minima (~> 2.0) was resolved to 2.5.1, which depends on
      jekyll (>= 3.5, < 5.0)

Running `bundle update` will rebuild your snapshot from scratch, using only
the gems in your Gemfile, which may resolve the conflict.
```

I followed the instructions and ran `bundle update`.  This took a few minutes.  Then I was able to run the local development server!

### Running locally

```bash
cd /mnt/c/home/repos/mendelbrot.github.io
bundle exec jekyll serve --livereload
```

go to [localhost:4000](http://localhost:4000/)

I have a problem: live reload doesn't work with either `--livereload` or `--watch`.  It doesn't seem to detect changes to the file system, so my first idea is to move the repo from the windows mounted filesystem to a folder in the full Linux system.  This is also my only idea so far...  

```bash
cd /home/greg
git clone https://github.com/mendelbrot/mendelbrot.github.io.git
code .
bundle exec jekyll serve --livereload
```

live reload works and it is wickedly fast.  Startup took a second instead of 2 minutes!

```bash
cd /home/greg/mendelbrot.github.io
bundle exec jekyll serve --livereload
```

### copying images/assets


```bash
cp -r /mnt/c/home/repos/notes-personal/assets/ /home/greg/mendelbrot.github.io/assets/
```

### git create branch

```bash
git checkout -b iss53
```

### copying diagram to linux filesystem

```bash
cp  /mnt/c/home/files/projects/star_trek_chess/svgs/diagrams/setup-diagram.png /home/greg/mendelbrot.github.io/assets/images/star-trek-chess/setup-diagram.png
```