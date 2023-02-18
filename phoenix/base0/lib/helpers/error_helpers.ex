defmodule Helpers.ErrorHelpers do
  @doc """
  used in traversing changeset errors
  https://hexdocs.pm/ecto/Ecto.Changeset.html#traverse_errors/2

  Inputs:
    an error tuple {msg, opts}, for example:
      {"should be at least %{count} characters", [count: 3, validation: :length, min: 3]}

  Outputs:
    a readable error message string, for example:
      "should be at least 3 characters"
  """
  def format_changeset_error({msg, opts}) do
    Regex.replace(~r"%{(\w+)}", msg, fn _, key ->
      opts
      |> Keyword.get(String.to_existing_atom(key), key)
      |> to_string()
    end)
  end

  @doc """
  combine all of the errors in a map into one string for viewing.any()

  Inputs:
    a map, for example:
      %{some_key_1: "some text 1", some_key_2: "some text 2"}

  Outputs:
    a string, for example:
      "some_key_1: some text 1\\n
      some_key_2: some text 2"
  """
  def combine_errors(errors) do
    errors
    |> Enum.reduce("Errors:\n", fn {key, val}, accumulator ->
      accumulator <> "#{key}: #{val}.\n"
    end)
    |> String.trim()
  end

  @doc """
  create a readable message from a changeset error.  this combines the utilities above.

  Inputs:
    a changeset

  Outputs:
    a string
  """
  def output_readable_message(changeset) do
    changeset
    |> Ecto.Changeset.traverse_errors(&format_changeset_error/1)
    |> combine_errors()
  end
end
