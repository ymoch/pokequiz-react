import requests
from dataclasses import dataclass
from typing import Iterable, Iterator, List
from urllib.parse import quote

_POKEAPI = "https://pokeapi.co"


@dataclass
class MultilingualName:
    ja: str


@dataclass
class Species:
    key: str
    name: MultilingualName
    varieties: List[str]


@dataclass
class BaseStats:
    hp: int
    attack: int
    defense: int
    special_attack: int
    special_defense: int
    speed: int


def to_multilingual_name(names: Iterable[dict]) -> MultilingualName:
    return MultilingualName(
        ja=next(
            name["name"] for name in names
            if name["language"]["name"] == "ja"
        ),
    )


def fetch_species(id_or_name: str) -> Iterator[str]:
    endpoint = "/".join(
        (_POKEAPI, "api", "v2", "pokemon-species", quote(id_or_name))
    )
    res = requests.get(endpoint)
    res.raise_for_status()

    data = res.json()
    return (
        Species(
            key=data["name"],
            name=to_multilingual_name(data["names"]),
            varieties = [
                variety["pokemon"]["name"]
                for variety in data["varieties"]
            ]
        )
    )


def fetch_pokemon(id_or_name: str):
    endpoint = "/".join((_POKEAPI, "api", "v2", "pokemon", quote(id_or_name)))
    res = requests.get(endpoint)
    res.raise_for_status()
    pokemon = res.json()

    base_stat_values = (
        next(
            stat["base_stat"] for stat in pokemon["stats"]
            if stat["stat"]["name"] == key
        )
        for key in (
            "hp",
            "attack",
            "defense",
            "special-attack",
            "special-defense",
            "speed",
        )
    )
    base_stats = BaseStats(*base_stat_values)
    sprite = pokemon["sprites"]["front_default"]

    form_endpoint = pokemon["forms"][0]["url"]
    form_res = requests.get(form_endpoint)
    form_res.raise_for_status()
    form = form_res.json()

    form_name = next(
        (
            form_name["name"] for form_name in form["form_names"]
            if form_name["language"]["name"] == "ja"
        ),
        None
    )

    return {
        "form_name_ja": form_name,
        "baseStats": base_stats,
        "sprite": sprite,
    }
