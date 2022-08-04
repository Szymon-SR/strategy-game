import asyncio
import json
import websockets

import logging
logging.basicConfig(format="%(message)s", level=logging.DEBUG)

async def handler(websocket):
    example_event = {"type": "attack", "player": "0", "hexId": 3, "success": 1}
    await websocket.send(json.dumps(example_event))
    async for message in websocket:
        print(message)
    



async def main():
    async with websockets.serve(handler, "", 8001):
        await asyncio.Future()  # run forever


if __name__ == "__main__":
    # creates an asyncio event loop, runs the main()
    # coroutine, and shuts down the loop.
    asyncio.run(main())
