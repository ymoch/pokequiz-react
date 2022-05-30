export default interface Pokemon {
  id: string,
  name: {
    ja: string;
  };
  form: {
    ja: string;
  } | null;
  base_stats: {
    speed: number;
  }
};
