defmodule Linty do
  @moduledoc """

  """

  @url "https://www.latlong.net/category/cities-236-15.html"
  # @url "https://www.google.com/search?q=trees"
  @datapath "./data/page.html"

  def start(_type, _args) do
    Linty.Supervisor.start_link(name: Linty.Supervisor)
  end

  def run do
    {:ok, %Finch.Response{body: body}} =
      Finch.build(:get, @url)
      |> Finch.request(MyFinch)

    File.mkdir_p(Path.dirname(@datapath))
    File.write(@datapath, body)

    {:ok, document} = Floki.parse_document(body)

    document
    |> Floki.find("table tr")
  end
end
