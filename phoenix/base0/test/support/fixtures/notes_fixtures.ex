defmodule App.NotesFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `App.Notes` context.
  """

  @doc """
  Generate a note.
  """
  def note_fixture(attrs \\ %{}) do
    {:ok, note} =
      attrs
      |> Enum.into(%{
        content: "some content",
        name: "some name"
      })
      |> App.Notes.create_note()

    note
  end
end
