BASE_INCOME = 0.5

class Tile:
    """Represents one tile of the map"""
    def __init__(self, id: int):
        self.id = id
        self.income = BASE_INCOME
        