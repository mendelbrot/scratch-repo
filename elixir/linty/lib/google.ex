defmodule Linty.Google do
  @moduledoc """

  """

  @doc """
  the google search result links look like this:
  /url?q=<actual url>&sa=U&ved=2ahUKEwi2

  this function returns the middle part between = and &.
  """
  def url_from_string(s) do
    pattern = :binary.compile_pattern(["=", "&"])
    [_head, url, _tail] = String.split(s, pattern, parts: 3)
    url
  end

  @doc """
  from the block of html elements returned by Floki.find, get the url of the 'a' element
  """
  def get_url(block) do
    block
    |> Floki.find("a")
    |> Floki.attribute("href")
    |> (fn [s] -> s end).()
    |> url_from_string()
  end

  @doc """
  given the url, returns a list of search results.
  assumes that the input url is a google search.
  """
  def search(url) do
    {:ok, %Finch.Response{body: body}} =
      Finch.build(:get, url)
      |> Finch.request(MyFinch)

    {:ok, document} = Floki.parse_document(body)

    document
    |> Floki.find(".egMi0.kCrYT")
    |> Enum.map(&get_url/1)
  end

  @doc """
  do a google search of the linkedin domain

  inputs:
  - name - string, as first name + last name
  - company - string
  - opts
    - :title - string

  output:
    a list of urls
  """
  def search_for_linkedin_profiles(name, company, opts \\ []) do
    # optional keyword arguments
    title = Keyword.get(opts, :title)

    # create the path
    url = %URI{
      scheme: "https",
      authority: "www.google.com",
      path: "/search",
      query: "as_sitesearch=linkedin.com"
    }

    # add the query to the path, search google, and filter the results
    url
    |> URI.append_query(URI.encode_query(q: "#{name} #{company} #{title}"))
    |> URI.to_string()
    |> search()
    |> Enum.filter(fn str -> str =~ "linkedin.com/in/" end)
  end
end
