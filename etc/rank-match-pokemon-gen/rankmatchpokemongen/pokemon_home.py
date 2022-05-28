import itertools
import json
from dataclasses import dataclass
from typing import Iterator
from urllib.parse import quote

import requests


@dataclass
class RankMatch:
    id: str
    name: str
    start: str
    end: str
    cnt: int
    rule: int
    season: int
    rst: int
    ts1: int
    ts2: int
    reg: str

    def is_single(self) -> bool:
        return self.rule == 0


@dataclass
class Pokemon:
    id: int
    form: int
    rank: int


def fetch_rank_matches() -> Iterator[RankMatch]:
    endpoint = 'https://api.battle.pokemon-home.com/cbd/competition/rankmatch/list'
    res = requests.post(endpoint, json={'soft': 'Sw'})
    res.raise_for_status()

    data = res.json()
    items = itertools.chain.from_iterable(
        season.items() for season in data['list'].values()
    )
    return (RankMatch(id=key, **value) for key, value in items)


def fetch_pokemon_ranking(rank_match: RankMatch) -> Iterator[RankMatch]:
    endpoint = '/'.join((
        'https://resource.pokemon-home.com',
        'battledata',
        'ranking',
        quote(rank_match.id),
        quote(str(rank_match.rule)),
        quote(str(rank_match.ts2)),
        'pokemon',
    ))
    res = requests.get(endpoint)
    res.raise_for_status()

    return (
        Pokemon(rank=idx + 1, **value) for idx, value in enumerate(res.json())
    )
