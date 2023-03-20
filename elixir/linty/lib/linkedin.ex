defmodule Linty.Linkedin do
  @doc """
  given the linkedin url, return the name, company, and title, or return an error
  ```
  {:ok, [name: "abc", company: "def", title: "ghi"]}
  {:error, :timeout}
  {:error, :not_found}
  {:error, :auth_wall}
  ```
  """
  def get_profile_data(url) do
    Finch.build(:get, url)
    |> Finch.request(MyFinch)
    |> case do
      {:ok, %Finch.Response{body: body}} ->
        File.mkdir("/data")
        File.write("/data/page.html", body)
        {:ok, document} = Floki.parse_document(body)
        IO.inspect(document)

      {:error, %Mint.HTTPError{reason: reason}} ->
        IO.inspect(reason)
    end
  end
end
