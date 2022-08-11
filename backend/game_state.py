from player import Player
from tile import Tile

class Game():
    """Class keeping the data of the current game"""
    def __init__(self):
        self.day = 1
        self.tiles = [Tile(i) for i in range(64)]
        self.players = [Player(self.tiles), Player(self.tiles)]

    
    def run_tick(self):
        self.day = self.day + 1

        # make changes in countries
        for player in self.players:
            player.earn_income()