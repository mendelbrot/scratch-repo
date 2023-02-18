defmodule AppWeb.SessionController do
  use AppWeb, :controller
  plug Ueberauth

  alias App.{Repo, User}

  def create(%{assigns: %{ueberauth_auth: auth}} = conn, _params) do
    user_params = %{
      token: auth.credentials.token,
      username: "greg1111111111111111111111111111111111",
      provider: Atom.to_string(auth.provider)
    }

    changeset = User.changeset(%User{}, user_params)

    case insert_or_update_user(changeset) do
      {:ok, user} ->
        conn
        |> put_flash(:info, "Thank you for signing in, #{changeset.changes.username}!")
        |> put_session(:user_id, user.id)
        |> redirect(to: Routes.page_path(conn, :index))

      {:error, _reason} ->
        msg = Helpers.ErrorHelpers.output_readable_message(changeset)

        conn
        |> put_flash(:error, msg)
        |> redirect(to: Routes.page_path(conn, :index))
    end
  end

  defp insert_or_update_user(changeset) do
    case Repo.get_by(User, username: changeset.changes.username) do
      nil ->
        Repo.insert(changeset)

      user ->
        {:ok, user}
    end
  end
end
