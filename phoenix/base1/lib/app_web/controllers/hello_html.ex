defmodule AppWeb.HelloHTML do
  use AppWeb, :html

  def index(assigns) do
    ~H"""
    Hello world!
    """
  end
end
