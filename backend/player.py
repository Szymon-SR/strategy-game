import random
from typing import List
from enum import Enum

from tile import Tile
import logging
logging.basicConfig(format="%(message)s", level=logging.DEBUG)

STARTING_MONEY = 5000
STARTING_SOLDIERS = 7
COSTS = {"claim": 250, "tower": 150, "windmill": 200, "recruit": 50}


def generate_home_tile(hex_list: List[Tile]) -> Tile:
    """Pick randomly a tile to be the home base"""
    home = random.choice(hex_list)
    while home.id in Player.home_hexes:
        home = random.choice(hex_list)

    Player.home_hexes.append(home.id)

    return home

class PlayerStatus(Enum):
    PLAYING = 1
    WON = 2
    LOST = 3
    DISCONNECTED = 4

class Player():
    """Class keeping the data of one player and his country"""
    home_hexes: List[int] = []  # class variable to ensure two players don't get the same starting tile

    def __init__(self, valid_hexes: List[Tile], id: int):
        self.id = id
        self.home_tile = generate_home_tile(valid_hexes)
        self.money = STARTING_MONEY
        self.income = 0.0
        self.owned_tiles = [self.home_tile]
        self.soldier_positions = {self.home_tile: STARTING_SOLDIERS}
        self.status = PlayerStatus.PLAYING

    def soldier_positions_ints(self) -> dict:
        """Returns the soldier count by tile id instead of tile object"""
        result = {}

        for tile, count in self.soldier_positions.items():
            result[tile.id] = count

        return result

    def earn_income(self) -> None:
        self.income = sum([tile.income for tile in self.owned_tiles])

        self.money += self.income

    def check_if_tile_neighbors_any(self, checked_tile: Tile) -> bool:
        """Return true if passed tile neighbors ANY tile owned by player"""
        for tile in self.owned_tiles:
            if tile.check_if_neighbor(checked_tile):
                return True

        return False

    def check_if_can_claim(self, claimed_tile: Tile) -> bool:
        """Returns true if player is able to claim tile, false if he can not"""

        # check if player has enough money, doesn't already have this tile, has soldiers on this tile
        # and borders this tile
        if (COSTS["claim"] <= self.money and claimed_tile not in self.owned_tiles and
                self.check_if_tile_neighbors_any(claimed_tile) and claimed_tile in self.soldier_positions):
            return True
        else:
            return False

    def claim(self, claimed_tile: Tile):
        self.money -= COSTS["claim"]
        self.owned_tiles.append(claimed_tile)

    def lose_claim(self, tile: Tile):
        self.owned_tiles.remove(tile)

        if tile == self.home_tile:
            self.lose_game()

    def build(self, target_tile: Tile, building: str) -> bool:
        # check if player owns tile and has enough money and building isn't already built
        if (COSTS[building] <= self.money and target_tile in self.owned_tiles and
                building not in target_tile.buildings):
            self.money -= COSTS[building]
            target_tile.add_building(building)
            return True
        else:
            return False


    def increase_soldiers_in_tile(self, target_tile: Tile, soldier_count: int) -> None:
        if target_tile in self.soldier_positions:
            self.soldier_positions[target_tile] += soldier_count
        else:
            self.soldier_positions[target_tile] = soldier_count

    def decrease_soldiers_in_tile(self, target_tile: Tile, soldier_count: int) -> None:
        if target_tile in self.soldier_positions:
            self.soldier_positions[target_tile] -= soldier_count
            if self.soldier_positions[target_tile] < 1:
                # if no soldiers are in tile, don't store it
                self.soldier_positions.pop(target_tile)

    def recruit(self, target_tile: Tile) -> bool:
        """Returns true if player recruited soldiers in tile, false if he can not"""
        # check if player owns tile and has enough money
        if COSTS["recruit"] <= self.money and target_tile in self.owned_tiles:
            self.money -= COSTS["recruit"]
            self.increase_soldiers_in_tile(target_tile, 1)
            return True
        else:
            return False

    def move_soldiers(self, source: Tile, destination: Tile, soldier_count: int):
        """This already assumes that no other player has his troops in destination"""

        if source in self.soldier_positions:
            if self.soldier_positions[source] >= soldier_count:
                # move soldiers

                self.soldier_positions[source] -= soldier_count
                # if reached zero, delete from dict
                self.soldier_positions = {key:val for key, val in self.soldier_positions.items() if val > 0}

                self.increase_soldiers_in_tile(destination, soldier_count)
            else:
                logging.error("Not enough soldiers")

    def lose_game(self):
        """Called when player loses his home tile / castle"""
        self.money = 0
        self.soldier_positions.clear()
        self.owned_tiles = []
        self.status = PlayerStatus.LOST
        #  TODO send info to frontend

    def win_game(self):
        """Called when the other player loses"""
        self.status = PlayerStatus.WON