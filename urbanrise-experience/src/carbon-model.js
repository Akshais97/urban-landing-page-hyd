// Fixed planning assumptions from the original household carbon calculator.
export const carbonAssumptions = {
  grid: 0.71,
  lpg: 2.98,
  petrol: 2.31,
  diesel: 2.68,
  carMileage: 15,
  twoWheelerMileage: 45,
  electricCar: 0.15,
  electricTwoWheeler: 0.03,
  waterEnergy: 1.5,
  efficiencySaving: 0.10,
  renewableShare: 0.30,
  waterSaving: 0.40,
  greenCover: 60,
  treeAbsorption: 21,
};

export const carbonCategories = [
  ['energy', 'Energy'],
  ['water', 'Water'],
  ['mobility', 'Mobility'],
  ['cooking', 'Cooking'],
  ['nature', 'Green cover'],
];

export function estimateCarbon({ electricity, water, car, twoWheeler, cylinders, fuel, switchToEV }) {
  const model = carbonAssumptions;
  const carPerKm = fuel === 'ev' ? model.electricCar * model.grid : model[fuel] / model.carMileage;
  const today = {
    energy: electricity * 12 * model.grid,
    water: water * 365 / 1000 * model.waterEnergy * model.grid,
    mobility: car * 12 * carPerKm + twoWheeler * 12 * model.petrol / model.twoWheelerMileage,
    cooking: cylinders * 12 * 14.2 * model.lpg,
    nature: 0,
  };
  const electricMobility = switchToEV || fuel === 'ev';
  const abundance = {
    energy: today.energy * (1 - model.efficiencySaving) * (1 - model.renewableShare),
    water: today.water * (1 - model.waterSaving),
    mobility: electricMobility
      ? 12 * model.grid * (car * model.electricCar + twoWheeler * model.electricTwoWheeler)
      : today.mobility,
    cooking: today.cooking,
    nature: -model.greenCover,
  };

  const sum = values => Object.values(values).reduce((total, value) => total + value, 0);
  const todayTotal = sum(today);
  const abundanceTotal = sum(abundance);
  const saved = todayTotal - abundanceTotal;
  return { today, abundance, todayTotal, abundanceTotal, saved, reduction: Math.round(100 * saved / todayTotal) };
}
