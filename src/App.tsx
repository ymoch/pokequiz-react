import React from 'react';
import {Container, Grid, Typography} from '@mui/material';
import './App.css';

function Pokemon({name, form, sprite}: any) {
  return (
    <Container>
      <Typography align="center">
        <img src={sprite} width={96} height={96} />
      </Typography>
      <Typography align="center" variant="h6">
        {name}
        {form && <small>({form})</small>}
      </Typography>
    </Container>
  );
}

function App() {
  return (
    <Container maxWidth="xl">
      <h1>速いのはどちら?</h1>
      <Grid container>
        <Grid item xs={6}>
          <Pokemon
            name="ランドロス"
            form="れいじゅうフォルム"
            sprite="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/645.png"
          />
        </Grid>
        <Grid item xs={6}>
          <Pokemon
            name="ウーラオス"
            form="いちげきのかた"
            sprite="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/892.png"
          />
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
