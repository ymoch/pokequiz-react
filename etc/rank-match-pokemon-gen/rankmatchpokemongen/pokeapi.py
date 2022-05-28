import requests
from dataclasses import dataclass
from typing import Iterator, List
from urllib.parse import quote

_POKEAPI = 'https://pokeapi.co'


@dataclass
class Species:
    key: str
    name_ja: str
    varieties: List[str]


def fetch_species(id_or_name: str) -> Iterator[str]:
    endpoint = '/'.join(
        (_POKEAPI, 'api', 'v2', 'pokemon-species', quote(id_or_name))
    )
    res = requests.get(endpoint)
    res.raise_for_status()

    data = res.json()
    return (
        Species(
            key=data['name'],
            name_ja=next(
                name['name'] for name in data['names']
                if name['language']['name'] == 'ja'
            ),
            varieties = [
                variety['pokemon']['name']
                for variety in data['varieties']
            ]
        )
    )


def fetch_pokemon(id_or_name: str):
    endpoint = '/'.join((_POKEAPI, 'api', 'v2', 'pokemon', quote(id_or_name)))
    res = requests.get(endpoint)
    res.raise_for_status()
    pokemon = res.json()

    base_stats = {
        'speed': pokemon['stats'][5]['base_stat'],  # HACK make stricter
    }
    sprite = pokemon['sprites']['front_default']

    form_endpoint = pokemon['forms'][0]['url']
    form_res = requests.get(form_endpoint)
    form_res.raise_for_status()
    form = form_res.json()

    form_name = next(
        (
            form_name['name'] for form_name in form['form_names']
            if form_name['language']['name'] == 'ja'
        ),
        None
    )

    return {
        'form_name_ja': form_name,
        'baseStats': base_stats,
        'sprite': sprite,
    }
