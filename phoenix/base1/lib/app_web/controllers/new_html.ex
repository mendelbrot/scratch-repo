defmodule AppWeb.NewHTML do
  use AppWeb, :html

  def index(assigns) do
    ~H"""
    Hello!
    """
  end
end
