from player import Player

class Game():
    """Class keeping the data of the current game"""
    def __init__(self):
        self.day = 1
        self.players = [Player(range(20)), Player(range(20))]
    
    def run_tick(self):
        self.day = self.day + 1

        # make changes in countries
        for player in self.players:
            player.get_income()