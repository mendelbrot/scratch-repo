defmodule HelloWeb.ForumLive do
  use HelloWeb, :live_view

  def mount(_params, session, socket) do
    IO.inspect(session)
    socket = assign(socket, brightness: 10)
    {:ok, socket}
  end

  def render(assigns) do
    ~H"""
    <h1>Forum</h1>
    """
  end
end
