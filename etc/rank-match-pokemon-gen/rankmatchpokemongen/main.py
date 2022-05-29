import itertools
import json
import sys

from tqdm import tqdm

from .pokeapi import fetch_species, fetch_pokemon, fetch_form
from .pokemon_home import fetch_rank_matches, fetch_pokemon_ranking


def nth(iterable, n):
    return next(itertools.islice(iterable, n, None))


def rank_to_models(rank):
    species = fetch_species(str(rank.id))

    primary_target = nth(species.varieties, rank.form)
    targets = [primary_target]
    if primary_target == "zacian":
        targets.append("zacian-crowned")
    elif primary_target == "zamazenta":
        targets.append("zamazenta-crowned")
    elif primary_target.startswith("zygarde-"):
        # HACK Zygarde can be redundant when both 50% and 10% appears.
        targets = ["zygarde-10", "zygarde-50", "zygarde-complete"]

    for target in targets:
        pokemon = fetch_pokemon(target)

        form = None
        if pokemon.forms[0] == pokemon.key and not pokemon.key.startswith("mimikyu-"):
            form = fetch_form(pokemon.forms[0])

        yield {
            "name": {"ja": species.name.ja},
            "form": {"ja": form.name.ja} if form and form.name else None,
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
    models = list(
        itertools.chain.from_iterable(rank_to_models(rank) for rank in tqdm(ranks))
    )
    json.dump(models, sys.stdout, ensure_ascii=False, indent=2)
