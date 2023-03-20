defmodule Linty do
  @moduledoc """

  """

  @google_url "https://www.google.com/search?q=trees"
  @datapath "./data/page.html"

  def start(_type, _args) do
    Linty.Supervisor.start_link(name: Linty.Supervisor)
  end

  def run do
    # name = IO.gets("name?")
    # company = IO.gets("company?")
    # linkedin_urls = Linty.Google.search_for_linkedin_profiles(name, company)
    # [url | _] = linkedin_urls
    # url = IO.gets("url?")
    Linty.Linkedin.get_profile_data("https://ca.linkedin.com/in/john-doe-845574202")
  end
end
