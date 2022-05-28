import React from 'react';
import {Button, Container, Grid, Typography} from '@mui/material';
import './App.css';
import Pokemon from './models/pokemon';

import pokemons from './resources/pokemon.json';

function PokemonView(
    {pokemon, answered}: {pokemon: Pokemon, answered: boolean},
) {
  return (
    <Container disableGutters>
      <Typography align="center" variant="h5" color="primary">
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

function QuizForm({lhs, rhs}: {lhs: Pokemon, rhs: Pokemon}) {
  const [answered, setAnswered] = React.useState(false);

  const onClick = () => {
    setAnswered(true);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Button
          fullWidth
          variant="outlined"
          disabled={answered}
          onClick={onClick}
        >
          <PokemonView pokemon={lhs} answered={answered}/>
        </Button>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Button
          fullWidth
          variant="outlined"
          disabled={answered}
          onClick={onClick}
        >
          <PokemonView pokemon={rhs} answered={answered} />
        </Button>
      </Grid>

      {!answered &&
        <Grid item xs={12}>
          <Button fullWidth variant="outlined" onClick={onClick}>
            <Typography align="center">同じ</Typography>
          </Button>
        </Grid>
      }
    </Grid>
  );
}

function App() {
  const lhs: Pokemon = pokemons[Math.floor(Math.random() * pokemons.length)];
  const rhs: Pokemon = pokemons[Math.floor(Math.random() * pokemons.length)];
  return (
    <Container maxWidth="xl">
      <h1>どちらが大きい?</h1>
      <QuizForm lhs={lhs} rhs={rhs} />
    </Container>
  );
}

export default App;
