interface DiscWarStats {
  deaths: number;
  kills: number;
  dashes: number;
  lineShots: number;
  curveShots: number;
  shields: number;
  shieldCatches: number;
}

const DEFAULT_DISCWAR_STATS = {
  deaths: 0,
  kills: 0,
  dashes: 0,
  lineShots: 0,
  curveShots: 0,
  shields: 0,
  shieldCatches: 0,
};

export { DEFAULT_DISCWAR_STATS };
export type { DiscWarStats };
