from player import Player
from tile import Tile

from math import floor, ceil

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

    def handle_claims(self, player_id: int, hex_id: int):
        claimed_tile = self.tiles[hex_id]

        if self.players[player_id].check_if_can_claim(claimed_tile):
            # tile is claimed by player, check if other player owns it
            for other_player in self.players:
                if other_player.id != player_id and claimed_tile in other_player.owned_tiles:
                    other_player.lose_claim(claimed_tile)
            
            self.players[player_id].claim(claimed_tile)
                    

    def handle_soldier_moves(self, player_id: int, source_id: int, direction: str, soldier_count: int) -> bool:
        source_tile = self.tiles[source_id]
        destination_coordinates = source_tile.find_neighbor(direction)
        destination_tile = None

        # if source_tile not in self.players[player_id].soldier_positions or self.players[player_id].soldier_positions[source_tile] < soldier_count:
        #     # not enough soldiers
        #     return False

        for tile in self.tiles:
            # find tile with searched coordinates
            coords = [tile.coordinates.q, tile.coordinates.r, tile.coordinates.s]

            if coords == destination_coordinates:
                destination_tile = tile

        if destination_tile:
            # tile is valid
            for other_player in self.players:
                if other_player.id != player_id and destination_tile in other_player.soldier_positions:
                    self.calculate_fight(self.players[player_id], other_player, source_tile, destination_tile, soldier_count)
                    return True
            
            # no fight, can just move
            self.players[player_id].move_soldiers(source_tile, destination_tile, soldier_count)
        else:
            # tile is invalid
            return False

    def calculate_fight(self, attacker: Player, defender: Player, source_tile: Tile, destination_tile: Tile, soldier_count: int):
        damage = floor((soldier_count / 2) / destination_tile.defensiveness)
        attacker_losses = floor((defender.soldier_positions[destination_tile] ** 2) / soldier_count * destination_tile.defensiveness)

        defender.decrease_soldiers_in_tile(destination_tile, damage)
        survived_attackers = soldier_count - attacker_losses
        
        if survived_attackers < 1:
            # all attackers dead
            attacker.decrease_soldiers_in_tile(source_tile, soldier_count)
        else:
            attacker.decrease_soldiers_in_tile(source_tile, attacker_losses)

            if destination_tile not in defender.soldier_positions:
                # succesfull finishing attack, all soldiers were defeated
                attacker.move_soldiers(source_tile, destination_tile, survived_attackers)
