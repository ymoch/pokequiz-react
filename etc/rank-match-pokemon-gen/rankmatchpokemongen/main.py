import itertools
import json
import sys

from .pokeapi import fetch_species, fetch_pokemon, fetch_form
from .pokemon_home import fetch_rank_matches, fetch_pokemon_ranking


def nth(iterable, n):
    return next(itertools.islice(iterable, n, None))


def rank_to_model(rank):
    species = fetch_species(str(rank.id))

    variety = nth(species.varieties, rank.form)
    if variety == "zacian":
        variety = "zacian-crowned"

    pokemon = fetch_pokemon(variety)
    form = fetch_form(pokemon.forms[0])
    return {
        "name": {"ja": species.name.ja},
        "form": {"ja": form.name.ja} if form.name else None,
        "baseStats": {
            "hp": pokemon.base_stats.hp,
            "attack": pokemon.base_stats.attack,
            "defense": pokemon.base_stats.defense,
            "specialAttack": pokemon.base_stats.special_attack,
            "specialDefense": pokemon.base_stats.special_defense,
            "speed": pokemon.base_stats.speed,
        },
        "sprite": pokemon.sprite,
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
