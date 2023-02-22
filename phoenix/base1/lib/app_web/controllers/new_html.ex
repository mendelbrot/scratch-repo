defmodule AppWeb.NewHTML do
  use AppWeb, :html

  def index(assigns) do
    ~H"""
    <h1>Hello <%= @message %>!</h1>
    <%= raw("<b>Bold?</b>") %>
    """
  end
end
