export default interface Pokemon {
  name: {
    ja: string;
  };
  form: {
    ja: string;
  } | null;
  baseStats: {
    speed: number;
  }
  sprite: string;
};
