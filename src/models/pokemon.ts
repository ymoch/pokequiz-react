export default interface Pokemon {
  name: {
    ja: string;
  };
  form: {
    ja: string;
  } | null;
  base_stats: {
    speed: number;
  }
  sprite: string;
};
