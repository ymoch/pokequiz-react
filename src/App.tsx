import React from 'react';
import {Button, Container, Grid, Typography} from '@mui/material';
import './App.css';
import Pokemon from './models/pokemon';

import pokemons from './resources/pokemon.json';

function isSamePokemon(lhs: Pokemon, rhs: Pokemon) {
  if (lhs.name.ja !== rhs.name.ja) {
    return false;
  }
  if (lhs.form === null) {
    return rhs.form === null;
  }
  if (rhs.form === null) {
    return false;
  }
  return lhs.form.ja === rhs.form.ja;
}

function selectPokemon(): Pokemon {
  const index = Math.floor(Math.random() * pokemons.length);
  return pokemons[index];
};

function selectPokemonPair(): [Pokemon, Pokemon] {
  const lhs = selectPokemon();
  let rhs = selectPokemon();
  while (isSamePokemon(lhs, rhs)) {
    rhs = selectPokemon();
  }
  return [lhs, rhs];
}

type Color = 'primary' | 'success' | 'error';
function selectBaseColor(answered: boolean, correct: boolean): Color {
  if (!answered) {
    return 'primary';
  }
  return correct ? 'success' : 'error';
}

function PokemonCandidate(
    {pokemon, answered, correct, onClick}: {
      pokemon: Pokemon,
      answered: boolean,
      correct: boolean,
      onClick: () => any,
    },
) {
  const color = selectBaseColor(answered, correct);
  return (
    <Button
      fullWidth
      size="large"
      variant="outlined"
      color={color}
      disableRipple={answered}
      onClick={onClick}
    >
      <div>
        <Typography align="center" variant="h5" color={color}>
          すばやさ種族値: <strong>{answered ? pokemon.baseStats.speed : '???'}</strong>
        </Typography>
        <Typography align="center">
          <img src={pokemon.sprite} width={96} height={96} />
        </Typography>
        <Typography align="center" variant="caption">
          {pokemon.name.ja}
          {pokemon.form && <small>({pokemon.form.ja})</small>}
        </Typography>
      </div>
    </Button>
  );
}

function PokemonQuiz() {
  type Choice = 'lt' | 'eq' | 'gt';
  const selectComparator = (choice: Choice) => {
    if (choice === 'lt') {
      return (lhs: number, rhs: number): boolean => (lhs < rhs);
    }
    if (choice === 'gt') {
      return (lhs: number, rhs: number): boolean => (lhs > rhs);
    }
    return (lhs: number, rhs: number): boolean => (lhs === rhs);
  };

  const [initialLhs, initialRhs] = selectPokemonPair();
  const [lhs, setLhs] = React.useState<Pokemon>(initialLhs);
  const [rhs, setRhs] = React.useState<Pokemon>(initialRhs);
  const [answered, setAnswered] = React.useState(false);
  const [correct, setCorrect] = React.useState(false);

  const initialize = () => {
    const [newLhs, newRhs] = selectPokemonPair();
    setLhs(newLhs);
    setRhs(newRhs);
    setAnswered(false);
  };

  const answer = (choice: Choice) => {
    if (answered) {
      return;
    }

    const compare = selectComparator(choice);
    setCorrect(compare(lhs.baseStats.speed, rhs.baseStats.speed));
    setAnswered(true);
  };


  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <h1>どちらが大きい?</h1>
      </Grid>
      <Grid item xs={12} sm={6}>
        <PokemonCandidate
          pokemon={lhs}
          answered={answered}
          correct={correct}
          onClick={() => answer('gt')}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <PokemonCandidate
          pokemon={rhs}
          answered={answered}
          correct={correct}
          onClick={() => answer('lt')}
        />
      </Grid>

      <Grid item xs={12}>
        <Button
          fullWidth
          variant={answered ? 'contained' : 'outlined'}
          size="large"
          color={answered ? 'info' : 'primary'}
          onClick={answered ? initialize : () => answer('eq')}
        >
          {answered ? '次の問題' : '同じ'}
        </Button>
      </Grid>
    </Grid>
  );
}

function App() {
  return (
    <Container maxWidth="xl">
      <PokemonQuiz />
    </Container>
  );
}

export default App;
