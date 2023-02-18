defmodule App.Repo.Migrations.AlterUsersTable do
  use Ecto.Migration

  def change do
    alter table(:users) do
      remove :first_name, :string
      remove :last_name, :string
      remove :email, :string
      add :username, :string
    end
  end
end
