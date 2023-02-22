defmodule Hello.Repo.Migrations.ForumTables do
  use Ecto.Migration

  def change do
    create table(:messages) do
      add :user_id, references(:users)
      add :body, :string
      add :ref_message_id, references(:messages)
      timestamps()
    end
  end
end
