import itertools
import json
import sys

from .pokeapi import fetch_species, fetch_pokemon
from .pokemon_home import fetch_rank_matches, fetch_pokemon_ranking


def nth(iterable, n):
    return next(itertools.islice(iterable, n, None))


def rank_to_model(rank):
    species = fetch_species(str(rank.id))
    variety = nth(species.varieties, rank.form)
    if variety == 'zacian':
        variety = 'zacian-crowned'
    pokemon = fetch_pokemon(variety)
    pokemon['name'] = {'ja': species.name_ja}
    return {
        'name': {'ja': species.name_ja},
        'form': (
            {'ja': pokemon['form_name_ja']}
            if pokemon['form_name_ja'] else None
        ),
        'baseStats': pokemon['baseStats'],
        'sprite': pokemon['sprite'],
    }


def main():
    rank_matches = fetch_rank_matches()
    target = max(
        (rank_match for rank_match in rank_matches if rank_match.is_single()),
        key=lambda rank_match: rank_match.season,
    )

    ranks = fetch_pokemon_ranking(target) 
    models = [rank_to_model(rank) for rank in ranks]
    json.dump(models, sys.stdout, ensure_ascii=False, indent=2)
