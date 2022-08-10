import asyncio
import json
import websockets
import random

from game_state import Game

import logging
logging.basicConfig(format="%(message)s", level=logging.DEBUG)

# set of all connected clients
websocket_clients = set()

JOIN = {}

async def handle_connection(websocket, game: Game, player: int):
    # IN

    websocket_clients.add(websocket)
    print(f'New connection from: {websocket.remote_address} ({len(websocket_clients)} total)')

    try:
        async for message in websocket:
            event = json.loads(message)
            print(event)
            # TODO player's move affect game

    except websockets.exceptions.ConnectionClosedError as cce:
        print("Connection closed")
    finally:
        websocket_clients.remove(websocket)

async def send_game_state():
    # OUT
    """Send current game state to all connected clients"""
    while True:
        # TODO replace with game state JSON
        num = str(random.randint(10, 99))
        game_state = 

        for c in websocket_clients:
            print(f'Sending [{num}] to socket [{id(c)}]')
            await c.send(num)
        await asyncio.sleep(2)

async def serve():
    async with websockets.serve(handle_connection, "", 8001):
        await asyncio.Future()  # run forever

async def main():
    tasks = []
    tasks.append(asyncio.create_task(serve()))
    tasks.append(asyncio.create_task(send_game_state()))
    await asyncio.gather(*tasks)

if __name__ == "__main__":
    # creates an asyncio event loop, runs the main()
    # coroutine, and shuts down the loop.
    asyncio.run(main())

"""
How to listen and send messages at the same time (send a message every x seconds even if we dont get any)

I have the solution in dev/websocket_client_server

"""