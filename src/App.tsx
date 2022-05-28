import React from 'react';
import {Button, Container, Grid, Typography} from '@mui/material';
import './App.css';

import pokemons from './resources/pokemon.json';

function PokemonView({pokemon}: any) {
  return (
    <Container disableGutters>
      <Typography align="center">
        <img src={pokemon.sprite} width={96} height={96} />
      </Typography>
      <Typography align="center">
        {pokemon.name.ja}
        {pokemon.form && <small>({pokemon.form.ja})</small>}
      </Typography>
    </Container>
  );
}

function QuizForm({lhs, rhs}: any) {
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
          <PokemonView pokemon={lhs} />
        </Button>

        {answered &&
          <Typography align="center">
            種族値: <strong>{lhs.baseStats.speed}</strong>
          </Typography>
        }
      </Grid>

      <Grid item xs={12} sm={6}>
        <Button
          fullWidth
          variant="outlined"
          disabled={answered}
          onClick={onClick}
        >
          <PokemonView pokemon={rhs} />
        </Button>

        {answered &&
          <Typography align="center">
            種族値: <strong>{rhs.baseStats.speed}</strong>
          </Typography>
        }
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
  const lhs = pokemons[0];
  const rhs = pokemons[1];
  return (
    <Container maxWidth="xl">
      <h1>速いのは?</h1>
      <QuizForm lhs={lhs} rhs={rhs} />
    </Container>
  );
}

export default App;
