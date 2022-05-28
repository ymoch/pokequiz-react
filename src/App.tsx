import React from 'react';
import {Button, Container, Grid, Typography} from '@mui/material';
import './App.css';

function PokemonView({name, form, sprite}: any) {
  return (
    <Container>
      <Typography align="center">
        <img src={sprite} width={96} height={96} />
      </Typography>
      <Typography align="center">
        {name}
        {form && <small>({form})</small>}
      </Typography>
    </Container>
  );
}

function App() {
  return (
    <Container maxWidth="xl">
      <h1>速いのは?</h1>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Button fullWidth variant="outlined">
            <PokemonView
              name="ランドロス"
              form="れいじゅうフォルム"
              sprite="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/645.png"
            />
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button fullWidth variant="outlined">
            <PokemonView
              name="ウーラオス"
              form="いちげきのかた"
              sprite="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/892.png"
            />
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button fullWidth variant="outlined">
            <Typography align="center">同じ</Typography>
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
