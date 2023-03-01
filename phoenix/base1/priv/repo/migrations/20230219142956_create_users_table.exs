defmodule App.Repo.Migrations.CreateUsersTable do
  use Ecto.Migration

  def change do
    execute("CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;")

    create table(:users) do
      add :email, :citext, null: false
      add :provider, :string
      add :token, :string

      timestamps()
    end

    create unique_index(:users, [:email])

    create table(:profiles) do
      add :username, :citext, null: false
      add :user_id, references(:users)

      timestamps()
    end

    create unique_index(:profiles, [:user_id])

    create table(:invite_codes) do
      add :code, :string, null: false

      timestamps()
    end

    create unique_index(:invite_codes, [:code])
  end
end
