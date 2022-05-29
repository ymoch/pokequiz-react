import requests
from dataclasses import dataclass
from typing import Iterable, Iterator, List, Optional
from urllib.parse import quote

_POKEAPI = "https://pokeapi.co"


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
    key: str
    base_stats: BaseStats
    sprite: str
    forms: List[str]


@dataclass
class Species:
    key: str
    name: MultilingualName
    varieties: List[str]


@dataclass
class Form:
    key: str
    name: Optional[MultilingualName]


def to_multilingual_name(names: Iterable[dict]) -> MultilingualName:
    return MultilingualName(
        ja=next(
            name["name"] for name in names
            if name["language"]["name"] == "ja"
        ),
    )


def fetch_species(key: str) -> Iterator[str]:
    endpoint = "/".join((_POKEAPI, "api", "v2", "pokemon-species", quote(key)))
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


def fetch_pokemon(key: str) -> Pokemon:
    endpoint = "/".join((_POKEAPI, "api", "v2", "pokemon", quote(key)))
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
    return Pokemon(
        key=pokemon["name"],
        base_stats=BaseStats(*base_stat_values),
        sprite=pokemon["sprites"]["front_default"],
        forms=[form["name"] for form in pokemon["forms"]],
    )


def fetch_form(key: str) -> Form:
    endpoint = "/".join((_POKEAPI, "api", "v2", "pokemon-form", quote(key)))
    res = requests.get(endpoint)
    res.raise_for_status()
    form = res.json()

    name: Optional[MultilingualName] = None
    form_names = form["form_names"]
    if form_names:
        name = to_multilingual_name(form_names)

    return Form(key=form["name"], name=name)
