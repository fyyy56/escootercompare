export const EMPTY_FILTERS = {
  powerMin: '',
  powerMax: '',
  speedMin: '',
  speedMax: '',
  weightMin: '',
  weightMax: '',
  rangeMin: '',
  rangeMax: '',
  voltMin: '',
  voltMax: '',
  capMin: '',
  capMax: '',
  repairMin: '',
};

function num(val, fallback) {
  if (val === '' || val == null) return fallback;
  const n = Number(val);
  return Number.isFinite(n) ? n : fallback;
}

export function filterScooters(scooters, { activeBrand, searchQuery, filters }) {
  const pMin = num(filters.powerMin, 0);
  const pMax = num(filters.powerMax, Infinity);
  const sMin = num(filters.speedMin, 0);
  const sMax = num(filters.speedMax, Infinity);
  const wMin = num(filters.weightMin, 0);
  const wMax = num(filters.weightMax, Infinity);
  const rMin = num(filters.rangeMin, 0);
  const rMax = num(filters.rangeMax, Infinity);
  const vMin = num(filters.voltMin, 0);
  const vMax = num(filters.voltMax, Infinity);
  const cMin = num(filters.capMin, 0);
  const cMax = num(filters.capMax, Infinity);
  const repMin = num(filters.repairMin, 0);
  const query = searchQuery.trim().toLowerCase();

  return scooters.filter((s) => {
    if (activeBrand !== 'all' && s.brand !== activeBrand) return false;
    if (s.powerVal < pMin || s.powerVal > pMax) return false;
    if (s.speedVal < sMin || s.speedVal > sMax) return false;
    if (s.weightVal < wMin || s.weightVal > wMax) return false;
    if (s.rangeVal < rMin || s.rangeVal > rMax) return false;
    if (s.voltVal < vMin || s.voltVal > vMax) return false;
    if (s.capVal < cMin || s.capVal > cMax) return false;
    if (s.repair < repMin) return false;
    if (
      query &&
      !s.name.toLowerCase().includes(query) &&
      !s.series.toLowerCase().includes(query)
    ) {
      return false;
    }
    return true;
  });
}
