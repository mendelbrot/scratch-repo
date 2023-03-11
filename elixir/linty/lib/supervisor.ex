defmodule Linty.Supervisor do
  @moduledoc """
  this module makes something called a supervisor, that is needed to run Finch
  - https://hexdocs.pm/elixir/Supervisor.html
  - https://elixir-lang.org/getting-started/mix-otp/supervisor-and-application.html
  """
  use Supervisor

  def start_link(opts) do
    Supervisor.start_link(__MODULE__, :ok, opts)
  end

  @impl true
  def init(:ok) do
    children = [
      {Finch, name: MyFinch}
    ]

    Supervisor.init(children, strategy: :one_for_one)
  end
end
