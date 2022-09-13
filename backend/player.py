import random
from typing import List

from tile import Tile

STARTING_MONEY = 500
STARTING_SOLDIERS = 7
COSTS = {"claim": 250, "tower": 150, "windmill": 200}


def generate_home_tile(hex_list: List[Tile]) -> Tile:
    """Pick randomly a tile to be the home base"""
    home = random.choice(hex_list)
    while home.id in Player.home_hexes:
        home = random.choice(hex_list)

    Player.home_hexes.append(home.id)

    return home


class Player():
    """Class keeping the data of one player and his country"""
    home_hexes = [] # class variable to ensure two players don't get the same starting tile

    def __init__(self, valid_hexes: List[Tile], id: int):
        self.id = id
        self.home_tile = generate_home_tile(valid_hexes)
        self.money = STARTING_MONEY
        self.income = 0.0
        self.owned_tiles = [self.home_tile]
        self.soldier_positions = {self.home_tile: STARTING_SOLDIERS}
    
    def soldier_positions_ints(self) -> dict:
        """Returns the soldier count by tile id instead of tile object"""
        result = {}

        for tile, count in self.soldier_positions.items():
            result[tile.id] = count

        return result


    def earn_income(self) -> None:
        self.income = sum([tile.income for tile in self.owned_tiles])

        self.money += self.income

    def try_to_claim_tile(self, tile: Tile) -> bool:
        """Returns true of player claimed tile, false if he can not"""
        
        # check if player has enough money, doesn't already have this tile and borders this tile
        if COSTS["claim"] <= self.money and tile not in self.owned_tiles:
            # TODO add checking if neighbors https://stackoverflow.com/questions/6661169/finding-adjacent-neighbors-on-a-hexagonal-grid
            # https://www.redblobgames.com/
            self.money -= COSTS["claim"]
            self.owned_tiles.append(tile)
            return True
        else: 
            return False

    def move_soldiers(self, source: Tile, destination: Tile, soldier_count: int):
        """This already assumes that no other player has his troops in destination"""

        if self.soldier_positions[source] >= soldier_count:
            # move soldiers
            self.soldier_positions[source] -= soldier_count
            self.soldier_positions[destination] += soldier_count
        else:
            raise Exception("Not enough soldiers")