defmodule AppWeb.HelloController do
  use AppWeb, :controller

  def index(conn, _params) do
    render(conn, :index)
  end
end
