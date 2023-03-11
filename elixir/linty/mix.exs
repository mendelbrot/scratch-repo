defmodule Linty.MixProject do
  use Mix.Project

  def project do
    [
      app: :linty,
      version: "0.1.0",
      elixir: "~> 1.14",
      start_permanent: Mix.env() == :prod,
      deps: deps()
    ]
  end

  # Run "mix help compile.app" to learn about applications.
  def application do
    [
      extra_applications: [:logger],
      mod: {Linty, []}
    ]
  end

  # Run "mix help deps" to learn about dependencies.
  defp deps do
    [
      {:floki, ">= 0.34.2"},
      {:finch, "~> 0.14.0"}
    ]
  end
end
