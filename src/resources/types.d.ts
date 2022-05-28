import Pokemon from '@/src/models/pokemon';

declare module './pokemon.json' {
  const value: Pokemon[];
  export = value;
}
