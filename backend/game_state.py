from player import Player
from tile import Tile

NUMBER_OF_TILES = 64

class Game():
    """Class keeping the data of the current game"""
    def __init__(self):
        self.day = 0
        self.tiles = [Tile(i) for i in range(NUMBER_OF_TILES)]
        self.players = [Player(self.tiles, 0), Player(self.tiles, 1)]

    
    def run_tick(self):
        self.day = self.day + 1

        # make changes in countries
        for player in self.players:
            player.earn_income()

    def handle_soldier_moves(self, player_id: int, source_id: int, direction: str, soldier_count: int) -> bool:
        source_tile = self.tiles[source_id]
        destination_coordinates = source_tile.find_neighbor(direction)
        destination_tile = None

        for tile in self.tiles:
            # find tile with searched coordinates
            coords = [tile.coordinates.q, tile.coordinates.r, tile.coordinates.s]

            if coords == destination_coordinates:
                destination_tile = tile

        if destination_tile:
            # tile is valid
            for other_player in self.players:
                if other_player.id != player_id and destination_tile in other_player.soldier_positions:
                    # TODO fight
                    print("fight")
                    return True
            
            # no fight, can just move
            self.players[player_id].move_soldiers(source_tile, destination_tile, soldier_count)
        else:
            # tile is invalid
            return False
