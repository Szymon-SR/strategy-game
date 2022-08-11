import random
from typing import List

STARTING_MONEY = 500
STARTING_INCOME = 0.5


class Player():
    """Class keeping the data of one player and his country"""
    home_hexes = []

    def __init__(self, valid_hexes: List):
        self.home_tile = Player.generate_home_tile(valid_hexes)
        self.money = STARTING_MONEY
        self.income = STARTING_INCOME
        self.owned_tiles = [self.home_tile]

    def generate_home_tile(hex_list: List) -> int:
        home = random.choice(hex_list)
        while home in Player.home_hexes:
            home = random.choice(hex_list)

        Player.home_hexes.append(home)

        return home

    def get_income(self):
        self.money += self.income