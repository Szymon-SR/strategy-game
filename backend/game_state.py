from player import Player, PlayerStatus
from tile import Tile

from enum import Enum
from math import floor, ceil

NUMBER_OF_TILES = 64

class GameStatus(Enum):
    ACTIVE = 1
    PAUSED = 2
    FINISHED = 3
    ABORTED = 4

class Game():
    """Class keeping the data of the current game"""
    def __init__(self):
        self.day = 0
        self.tiles = [Tile(i) for i in range(NUMBER_OF_TILES)]
        self.players = [Player(self.tiles, 0), Player(self.tiles, 1)]
        self.status = GameStatus.ACTIVE
    
    def run_tick(self):
        self.day = self.day + 1

        # make changes in countries and check if game finished
        for player in self.players:
            player.earn_income()

            if player.status == PlayerStatus.LOST:
                # finish game
                self.status = GameStatus.FINISHED
                if player.id == 0:
                    self.players[1].win_game()
                else:
                    self.players[0].win_game()


    def handle_claims(self, player_id: int, hex_id: int) -> None:
        claimed_tile = self.tiles[hex_id]

        if self.players[player_id].check_if_can_claim(claimed_tile):
            # tile is claimed by player, check if other player owns it
            for other_player in self.players:
                if other_player.id != player_id and claimed_tile in other_player.owned_tiles:
                    other_player.lose_claim(claimed_tile)
            
            self.players[player_id].claim(claimed_tile)
                    

    def handle_soldier_moves(self, player_id: int, source_id: int, target_id: int, soldier_count: int) -> bool:
        # player_id, source_id, target_id, soldier_count
        source_tile = self.tiles[source_id]
        target_tile = self.tiles[target_id]

        if source_tile and target_tile:
            # tile is valid
            for other_player in self.players:
                if other_player.id != player_id and target_tile in other_player.soldier_positions:
                    self.calculate_fight(self.players[player_id], other_player, source_tile, target_tile, soldier_count)
                    return True
            
            # no fight, can just move
            self.players[player_id].move_soldiers(source_tile, target_tile, soldier_count)
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
