# defmodule App.User do
#   use Ecto.Schema
#   import Ecto.Changeset

#   schema "users" do
#     field :email, :string
#     field :provider, :string
#     field :token, :string

#     timestamps()
#   end

#   @doc false
#   def changeset(user, params) do
#     user
#     |> cast(params, [:email, :provider, :token])
#     |> validate_required([:email, :provider, :token])
#     |> unique_constraint(:email)
#   end
# end
