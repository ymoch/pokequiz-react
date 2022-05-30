import itertools
import json
import sys
from dataclasses import asdict
from typing import Iterator

from tqdm import tqdm

from .model import Pokemon
from .pokeapi import fetch_species, fetch_pokemon, fetch_form
from .pokemon_home import fetch_rank_matches, fetch_pokemon_ranking


def nth(iterable, n):
    return next(itertools.islice(iterable, n, None))


def rank_to_models(rank) -> Iterator[Pokemon]:
    species = fetch_species(str(rank.id))

    primary_target = nth(species.varieties, rank.form)
    targets = [primary_target]
    if primary_target == "zacian":
        targets.append("zacian-crowned")
    elif primary_target == "zamazenta":
        targets.append("zamazenta-crowned")
    elif primary_target.startswith("zygarde-"):
        # HACK Zygarde can be redundant when both 50% and 10% appears.
        targets = ["zygarde-10-power-construct", "zygarde-50", "zygarde-complete"]

    for target in targets:
        pokemon = fetch_pokemon(target)

        form = None
        if pokemon.forms[0] == pokemon.key and not pokemon.key.startswith("mimikyu-"):
            form = fetch_form(pokemon.forms[0])

        yield Pokemon(
            name=species.name,
            form=form.name if form else None,
            base_stats=pokemon.base_stats,
            sprite=pokemon.sprite,
        )


def main():
    rank_matches = fetch_rank_matches()
    target = max(
        (rank_match for rank_match in rank_matches if rank_match.is_single()),
        key=lambda rank_match: rank_match.season,
    )

    ranks = fetch_pokemon_ranking(target)
    pokemons = list(
        itertools.chain.from_iterable(rank_to_models(rank) for rank in tqdm(ranks))
    )
    json.dump(
        [asdict(pokemon) for pokemon in pokemons],
        sys.stdout,
        ensure_ascii=False,
        indent=2,
    )
