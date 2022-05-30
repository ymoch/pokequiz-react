from dataclasses import dataclass
from typing import Optional


@dataclass
class MultilingualName:
    ja: str


@dataclass
class BaseStats:
    hp: int
    attack: int
    defense: int
    special_attack: int
    special_defense: int
    speed: int


@dataclass
class Pokemon:
    name: MultilingualName
    form: Optional[MultilingualName]
    base_stats: BaseStats
    sprite: str
