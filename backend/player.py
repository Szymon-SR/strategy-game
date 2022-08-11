import random
from typing import List

from tile import Tile

STARTING_MONEY = 500

class Player():
    """Class keeping the data of one player and his country"""
    home_hexes = []

    def __init__(self, valid_hexes: List[Tile]):
        self.home_tile = Player.generate_home_tile(valid_hexes)
        self.money = STARTING_MONEY
        self.income = 0.0
        self.owned_tiles = [self.home_tile]

    def generate_home_tile(hex_list: List[Tile]) -> Tile:
        """Pick randomly a tile to be the home base"""
        home = random.choice(hex_list)
        while home.id in Player.home_hexes:
            home = random.choice(hex_list)

        Player.home_hexes.append(home.id)

        return home

    def earn_income(self):
        self.income = sum([tile.income for tile in self.owned_tiles])

        self.money += self.income