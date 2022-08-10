
class Game():
    """Class keeping the data of the current game"""
    def __init__(self):
        self.day = 1
    
    def run_tick(self):
        self.day = self.day + 1

# https://auth0.com/blog/state-pattern-in-python/