defmodule Hello.Repo.Migrations.Profiles do
  use Ecto.Migration

  def change do
    create table(:profiles, primary_key: false) do
      add :username, :citext, null: false
      add :user_id, references(:users, on_delete: :delete_all), primary_key: true
      timestamps()
    end

    create unique_index(:profiles, [:username])
  end
end
