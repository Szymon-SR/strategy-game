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

    def handle_soldier_moves(self, player_id: int, source_id: int, direction: str, soldier_count: int):

        # calculate id of destination tile
        destination_id = 5  # TODO implement


        # check if some other player has soldiers there
        for other_player in self.players:
            if other_player.id != player_id and other_player.soldier_positions[self.tiles[destination_id]]:
                # TODO fight
                pass
            else:
                # no fight, can just move
                self.players[player_id].move_soldiers(self.tiles[source_id], self.tiles[destination_id], soldier_count)
