import asyncio
import json
import websockets
import random
import secrets

from game_state import Game

import logging
logging.basicConfig(format="%(message)s", level=logging.DEBUG)

# set of all games
JOIN = {}


async def handle_incoming(websocket, game: Game, player: int):
    # IN
    async for message in websocket:
        event = json.loads(message)
        print(event)
        # TODO player's move affect game obj


async def send_game_state(game: Game, connected):
    # OUT
    """Send current game state to all connected clients"""
    while True:
        game.run_tick()
        # TODO replace with game state JSON
        game_state = {
            "type": "game_state",
            "day": game.day
        }

        websockets.broadcast(connected, json.dumps(game_state))

        await asyncio.sleep(1)  # TODO adjust update time


async def start(websocket):
    """
    Handle a connection from the first player: start a new game.
    """

    game = Game()

    connected = {websocket}
    join_key = secrets.token_urlsafe(12)
    JOIN[join_key] = game, connected

    try:
        # Send the secret access tokens to the browser of the first player,
        # where they'll be used for building "join" and "watch" links.

        event = {
            "type": "init",
            "join": join_key,
        }

        await websocket.send(json.dumps(event))
        # Receive and process moves from the first player.
        await handle_incoming(websocket, game, 0)

    finally:
        del JOIN[join_key]


async def join(websocket, join_key):
    """
    Handle a connection from the second player: join an existing game.
    """

    # Find the Connect Four game.
    try:
        game, connected = JOIN[join_key]

    except KeyError:
        await error(websocket, "Game not found.")
        return

    # Register to receive moves from this game.
    connected.add(websocket)

    try:
        # Receive and process moves from the second player, also start sending game state
        tasks = []
        # TODO not one but the amount of players
        tasks.append(asyncio.create_task(handle_incoming(websocket, game, 1)))
        tasks.append(asyncio.create_task(send_game_state(game, connected)))
        await asyncio.gather(*tasks)

    finally:
        connected.remove(websocket)


async def error(websocket, message):
    """
    Send an error message.
    """

    event = {
        "type": "error",
        "message": message,
    }

    await websocket.send(json.dumps(event))


async def handler(websocket):
    """
    Handle a connection and dispatch it according to who is connecting.
    """

    # Receive and parse the "init" event from the UI.
    message = await websocket.recv()
    event = json.loads(message)
    print("Got event")
    print(event)
    assert event["type"] == "init"

    if "join" in event:
        # Second player joins an existing game.
        await join(websocket, event["join"])
    else:
        # First player starts a new game.
        await start(websocket)


async def main():
    async with websockets.serve(handler, "", 8001):
        await asyncio.Future()  # run forever


if __name__ == "__main__":
    # creates an asyncio event loop, runs the main()
    # coroutine, and shuts down the loop.
    asyncio.run(main())

"""
How to listen and send messages at the same time (send a message every x seconds even if we dont get any)

I have the solution in dev/websocket_client_server

"""
