from player import Player
from tile import Tile

NUMBER_OF_TILES = 64

class Game():
    """Class keeping the data of the current game"""
    def __init__(self):
        self.day = 0
        self.tiles = [Tile(i) for i in range(NUMBER_OF_TILES)]
        self.players = [Player(self.tiles), Player(self.tiles)]

    
    def run_tick(self):
        self.day = self.day + 1

        # make changes in countries
        for player in self.players:
            player.earn_income()