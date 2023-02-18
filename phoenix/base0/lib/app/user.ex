defmodule App.User do
  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    field :username, :string
    field :provider, :string
    field :token, :string

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:username, :provider, :token])
    |> validate_required([:username, :token])
    |> validate_length(:username, min: 2, max: 16)
    |> unique_constraint(:username)
  end
end
