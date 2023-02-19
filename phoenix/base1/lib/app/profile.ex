# defmodule App.Profile do
#   use Ecto.Schema
#   import Ecto.Changeset

#   schema "profiles" do
#     field :username, :string
#     field :provider, :string
#     field :token, :string

#     timestamps()
#   end

#   @doc false
#   def changeset(profile, attrs) do
#     profile
#     |> cast(attrs, [:profilename, :provider, :token])
#     |> validate_required([:profilename, :token])
#     |> validate_length(:profilename, min: 2, max: 16)
#     |> unique_constraint(:profilename)
#   end
# end
