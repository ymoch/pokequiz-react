export default interface Pokemon {
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
