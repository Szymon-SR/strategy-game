from __future__ import annotations

from typing import List
from math import floor, ceil
from dataclasses import dataclass

NUMBER_OF_TILES_IN_ROW = 8
BASE_INCOME = 5
BASE_DEFENSIVENESS = 1

DIRECTIONS = {
    "topleft": [0, -1, 1],
    "topright": [1, -1, 0],
    "left": [-1, 0, 1],
    "right": [1, 0, -1],
    "bottomleft": [-1, 1, 0],
    "bottomright": [0, 1, -1],
}

@dataclass
class CubeCoordinates:
    """
    Representation of placement of the hexagonal tile
    https://www.redblobgames.com/grids/hexagons/
    """
    q: int
    r: int
    s: int


def calculate_coordinates(id: int) -> CubeCoordinates:
    """Calculate cube coordinates of tile basing on my tile id"""
    index_of_tile_in_row = id % NUMBER_OF_TILES_IN_ROW
    index_of_row = floor(id / NUMBER_OF_TILES_IN_ROW)

    q = (floor(index_of_row / 2) * -1) + index_of_tile_in_row
    r = index_of_row
    s = (ceil(index_of_row / 2) * -1) - index_of_tile_in_row

    return CubeCoordinates(q=q, r=r, s=s)


class Tile:
    """Represents one tile of the map"""

    def __init__(self, id: int):
        self.id = id
        self.income_multiplier = 1
        self.defensiveness_multiplier = 1
        self.coordinates = calculate_coordinates(id)
        self.buildings = []

        # print(f"THIS IS TILE{self.id} {self.income} {self.coordinates}")

    @property
    def income(self):
        return BASE_INCOME * self.income_multiplier

    @property
    def defensiveness(self):
        return BASE_DEFENSIVENESS * self.defensiveness_multiplier

    @property
    def coords_as_list(self):
        return [self.coordinates.q, self.coordinates.r, self.coordinates.s]

    def add_building(self, building: str) -> None:
        self.buildings.append(building)

        if building == "windmill":
            self.income_multiplier += 0.5
        if building == "tower":
            self.defensiveness_multiplier += 0.5


    def check_if_neighbor(self, other_tile: Tile) -> bool:
        deltas = [self.coordinates.q - other_tile.coordinates.q,
                  self.coordinates.r - other_tile.coordinates.r,
                  self.coordinates.s - other_tile.coordinates.s]

        # Moving one space in hex coordinates involves changing one of the 3 cube coordinates by +1
        # and changing another one by -1 (the sum must remain 0)
        # This results in 6 possible changes. Each corresponds to one of the hexagonal directions. 
        # https://www.redblobgames.com/grids/hexagons/
        neighbors_deltas = [-1, 0, 1]

        return sorted(deltas) == neighbors_deltas

    def find_neighbor(self, direction: str) -> List[int]:
        """Return coordinates of tile towards some direction from self"""
        deltas = DIRECTIONS[direction]
        target_q = self.coordinates.q + deltas[0]
        target_r = self.coordinates.r + deltas[1]
        target_s = self.coordinates.s + deltas[2]

        return [target_q, target_r, target_s]
