defmodule AppWeb.NewController do
  use AppWeb, :controller

  def index(conn, %{"message" => message}) do
    conn
    # |> put_root_layout(html: {AppWeb.Layouts, :new})
    # |> put_layout(html: false)
    |> render(:index, message: message)
  end
end
