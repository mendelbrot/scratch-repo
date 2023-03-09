defmodule LintyTest do
  use ExUnit.Case
  doctest Linty

  test "greets the world" do
    assert Linty.hello() == :world
  end
end
