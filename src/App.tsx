import React from 'react';
import {Button, Container, Grid, Typography} from '@mui/material';
import './App.css';
import Pokemon from './models/pokemon';

import pokemons from './resources/pokemon.json';

function selectPokemon(): Pokemon {
  const index = Math.floor(Math.random() * pokemons.length);
  return pokemons[index];
};

type Color = 'primary' | 'success' | 'error';
function selectBaseColor(answered: boolean, correct: boolean): Color {
  if (!answered) {
    return 'primary';
  }
  return correct ? 'success' : 'error';
}

function PokemonView(
    {pokemon, answered, color}: {
      pokemon: Pokemon,
      answered: boolean,
      color: Color,
    },
) {
  return (
    <Container disableGutters>
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
    </Container>
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

  const [lhs, setLhs] = React.useState(selectPokemon());
  const [rhs, setRhs] = React.useState(selectPokemon());

  const [answered, setAnswered] = React.useState(false);
  const [correct, setCorrect] = React.useState(false);
  const [baseColor, setBaseColor] = React.useState<Color>('primary');
  React.useEffect(() => {
    setBaseColor(selectBaseColor(answered, correct));
  }, [answered, correct]);

  const initialize = () => {
    setLhs(selectPokemon());
    setRhs(selectPokemon());
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
        <Button
          fullWidth
          variant="outlined"
          color={baseColor}
          disableRipple={answered}
          onClick={() => answer('gt')}
        >
          <PokemonView pokemon={lhs} answered={answered} color={baseColor} />
        </Button>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Button
          fullWidth
          variant="outlined"
          color={baseColor}
          disableRipple={answered}
          onClick={() => answer('lt')}
        >
          <PokemonView pokemon={rhs} answered={answered} color={baseColor} />
        </Button>
      </Grid>

      {answered?
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            color={baseColor}
            onClick={initialize}
          >
            次の問題
          </Button>
        </Grid> :
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="outlined"
            size="large"
            color={baseColor}
            onClick={() => answer('eq')}
          >
            <Typography align="center">同じ</Typography>
          </Button>
        </Grid>
      }
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
