# App

To start your Phoenix server:

  * Run `mix setup` to install and setup dependencies
  * Start Phoenix endpoint with `mix phx.server` or inside IEx with `iex -S mix phx.server`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

Ready to run in production? Please [check our deployment guides](https://hexdocs.pm/phoenix/deployment.html).

## Learn more

  * Official website: https://www.phoenixframework.org/
  * Guides: https://hexdocs.pm/phoenix/overview.html
  * Docs: https://hexdocs.pm/phoenix
  * Forum: https://elixirforum.com/c/phoenix-forum
  * Source: https://github.com/phoenixframework/phoenix

**some useful commands**
```
mix deps.get
mix phx.server
mix ecto.migrate

mix ecto.drop
mix ecto.create
mix ecto.rollback
mix ecto.migrate --log-migrations-sql

mix help phx.gen.schema
mix ecto.gen.migration alter_users_table

source .env
```

**uberauth**
https://medium.brianemory.com/elixir-phoenix-creating-an-app-part-4-using-google-%C3%BCberauth-e7d2ed1a3541

**ecto-migrations**
https://fly.io/phoenix-files/anatomy-of-an-ecto-migration/
https://devhints.io/phoenix-migrations

