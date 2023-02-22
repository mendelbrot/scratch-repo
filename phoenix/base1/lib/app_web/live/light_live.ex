defmodule AppWeb.LightLive do
  use AppWeb, :live_view

  def mount(_params, _session, socket) do
    IO.inspect(self(), label: "MOUNT")
    socket = assign(socket, brightness: 10)
    {:ok, socket}
  end

  def render(assigns) do
    IO.inspect(self(), label: "RENDER")

    ~H"""
    <h1 class="text-blue-500 text-5xl font-bold text-center">Front Porch Light</h1>
    <div id="light">
      <div class="meter">
        <span style={"width: #{@brightness}%"}>
          <%= @brightness %>%
        </span>
      </div>
      <button phx-click="off">
        <img src="images/light-off.png" width="50" , height="50" />
      </button>
      <button phx-click="down">
        <img src="images/light-down.png" width="50" , height="50" />
      </button>
      <button phx-click="up">
        <img src="images/light-up.png" width="50" , height="50" />
      </button>
      <button phx-click="on">
        <img src="images/light-on.png" width="50" , height="50" />
      </button>
    </div>
    """
  end

  def handle_event("off", _, socket) do
    IO.inspect(self(), label: "OFF")
    socket = assign(socket, brightness: 0)
    {:noreply, socket}
  end

  def handle_event("down", _, socket) do
    IO.inspect(self(), label: "DOWN")
    socket = update(socket, :brightness, fn b -> b - 10 end)
    {:noreply, socket}
  end

  def handle_event("up", _, socket) do
    IO.inspect(self(), label: "UP")
    socket = update(socket, :brightness, fn b -> b + 10 end)
    {:noreply, socket}
  end

  def handle_event("on", _, socket) do
    IO.inspect(self(), label: "ON")

    # raise "🔥"

    socket = assign(socket, brightness: 100)
    {:noreply, socket}
  end
end
