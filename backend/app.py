import asyncio
import json
import websockets
import random
import secrets

from game_state import Game

import logging
logging.basicConfig(format="%(message)s", level=logging.ERROR)

logger = logging.getLogger('websockets.server')
logger.setLevel(logging.ERROR)

# set of all games
JOIN = {}


async def handle_incoming(websocket, game: Game, player: int):
    # IN
    async for message in websocket:
        event = json.loads(message)

        player_id = event["player_id"]
        hex_id = event["hex_id"]

        if event["type"] == "claim":
            game.handle_claims(player_id, hex_id)
        if event["type"] == "build":
            building = event["building"]
            game.players[player_id].build(game.tiles[hex_id], building)
        if event["type"] == "recruit":
            game.players[player_id].recruit(game.tiles[hex_id])
        if event["type"] == "move":
            print(f"MOVE EVENT {message}")
            source_id = event["source_id"];
            target_id = event["target_id"];
            soldier_count = event["count"]

            game.handle_soldier_moves(player_id, source_id, target_id, soldier_count)
        else:
            logging.error(event)

async def send_game_state(game: Game, connected):
    # OUT
    """Send current game state to all connected clients"""

    # every x cycles, game will run tick / new day will come (state will be sent more often)
    TICK_FREQUENCY = 5  
    tick_counter = 0

    while True:
        tick_counter += 1
        if tick_counter == TICK_FREQUENCY:
            tick_counter = 0
            game.run_tick()

        player0 = game.players[0]
        player1 = game.players[1]

        player1owned = [tile.id for tile in player0.owned_tiles]
        player2owned = [tile.id for tile in player1.owned_tiles] 

        game_state = {
            "type": "game_state",
            "day": game.day,
            "home_tiles": [player0.home_tile.id, player1.home_tile.id], # home tiles of players, by player index
            "money_balances": [player0.money, player1.money],
            "incomes": [player0.income, player1.income],
            "owned_tiles": [player1owned, player2owned],
            "tile_incomes": [tile.income for tile in game.tiles],
            "tile_defenses": [tile.defensiveness for tile in game.tiles],
            "tile_coordinates": [tile.coords_as_list for tile in game.tiles], # list of lists
            "soldier_positions": [player0.soldier_positions_ints(), player1.soldier_positions_ints()],
        }

        websockets.broadcast(connected, json.dumps(game_state))

        await asyncio.sleep(0.2)  # TODO adjust update time


async def start(websocket):
    """
    Handle a connection from the first player: start a new game.
    """

    game = Game()

    connected = {websocket}
    join_key = secrets.token_urlsafe(6)
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
    
    # The amount of previously connected players becomes this player's id
    player_index = len(connected)
    # Assign the index to the player and send it
    assignment = {
        "type": "index_assignment",
        "index": player_index,
    }
    await websocket.send(json.dumps(assignment))

    # Register to receive moves from this game.
    connected.add(websocket)

    try:
        # Receive and process moves from the second player, also start sending game state
        tasks = []
        tasks.append(asyncio.create_task(handle_incoming(websocket, game, player_index)))
        tasks.append(asyncio.create_task(send_game_state(game, connected))) # TODO move to first player's start?
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
