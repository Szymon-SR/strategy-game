from __future__ import annotations

from math import floor, ceil
from dataclasses import dataclass

NUMBER_OF_TILES_IN_ROW = 8
BASE_INCOME = 0.5


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
        self.income = BASE_INCOME
        self.coordinates = calculate_coordinates(id)

        print(f"THIS IS TILE{self.id} {self.income} {self.coordinates}")

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
