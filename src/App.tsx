import React from 'react';
import {Button, Container, Grid, Typography} from '@mui/material';
import './App.css';

interface Pokemon {
  name: {
    ja: string;
  };
  form?: {
    ja: string;
  };
  baseStats: {
    speed: number;
  }
  sprite: string;
};

function PokemonView({pokemon, answered}: any) {
  return (
    <Container>
      <Typography align="center">
        <img src={pokemon.sprite} width={96} height={96} />
      </Typography>
      <Typography align="center">
        {pokemon.name.ja}
        {pokemon.form && <small>({pokemon.form.ja})</small>}
      </Typography>
      {answered &&
        <Typography align="center">
          種族値: <strong>{pokemon.baseStats.speed}</strong>
        </Typography>
      }
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
          <PokemonView pokemon={lhs} answered={answered} />
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

const landorus: Pokemon = {
  name: {
    ja: 'ランドロス',
  },
  form: {
    ja: 'れいじゅうフォルム',
  },
  baseStats: {
    speed: 91,
  },
  sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/645.png',
};
const urashifu: Pokemon = {
  name: {
    ja: 'ウーラオス',
  },
  form: {
    ja: 'いちげきのかた',
  },
  baseStats: {
    speed: 97,
  },
  sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/892.png',
};

function App() {
  return (
    <Container maxWidth="xl">
      <h1>速いのは?</h1>
      <QuizForm lhs={landorus} rhs={urashifu} />
    </Container>
  );
}

export default App;
