// Species data and the pure simulation rules that run once per in-game day.

export const SPECIES = {
  sunflower: {
    name: 'Sunflower',
    bloom: '🌻',
    seedColor: '#f2b632',
    water: [40, 75],
    thirst: 1,
    light: 'sun',
    daysPerStage: 2,
    tip: 'Loves bright light and steady watering.',
  },
  cactus: {
    name: 'Cactus',
    bloom: '🌵',
    seedColor: '#6aa84f',
    water: [5, 40],
    thirst: 0.4,
    light: 'sun',
    daysPerStage: 3,
    tip: 'Wants lots of sun and very little water. Overwatering kills it!',
  },
  tulip: {
    name: 'Tulip',
    bloom: '🌷',
    seedColor: '#e86a92',
    water: [35, 70],
    thirst: 1,
    light: 'any',
    daysPerStage: 2,
    tip: 'Easygoing about light, but keep the soil moist.',
  },
  mushroom: {
    name: 'Mushroom',
    bloom: '🍄',
    seedColor: '#b5651d',
    water: [60, 100],
    thirst: 0.8,
    light: 'shade',
    daysPerStage: 1,
    tip: 'Grows fast in damp shade. Turn the grow lamp off!',
  },
  rose: {
    name: 'Rose',
    bloom: '🌹',
    seedColor: '#c0392b',
    water: [45, 65],
    thirst: 0.8,
    light: 'sun',
    daysPerStage: 3,
    tip: 'Picky: a narrow water range and plenty of sun.',
  },
}

export const STAGES = ['Seed', 'Sprout', 'Seedling', 'Budding', 'Blooming']
export const MAX_STAGE = STAGES.length - 1

export const WEATHER = {
  sunny: { icon: '☀️', label: 'Sunny', evaporation: 18, rain: 0 },
  cloudy: { icon: '☁️', label: 'Cloudy', evaporation: 10, rain: 0 },
  rainy: { icon: '🌧️', label: 'Rainy', evaporation: 4, rain: 30 },
}

export function randomWeather() {
  const roll = Math.random()
  if (roll < 0.45) return 'sunny'
  if (roll < 0.75) return 'cloudy'
  return 'rainy'
}

export function newPlant(speciesKey) {
  const [lo, hi] = SPECIES[speciesKey].water
  return { species: speciesKey, stage: 0, progress: 0, water: Math.round((lo + hi) / 2), health: 100 }
}

export function stageEmoji(plant) {
  if (plant.health <= 0) return '🥀'
  return ['🟤', '🌱', '🌿', '🪴', SPECIES[plant.species].bloom][plant.stage]
}

// Is the plant happy with current water and light? Returns a list of problems.
export function plantProblems(plant, lampOn, weather) {
  const sp = SPECIES[plant.species]
  const problems = []
  if (plant.water < sp.water[0]) problems.push('thirsty')
  if (plant.water > sp.water[1]) problems.push('soggy')
  const bright = lampOn || weather === 'sunny'
  if (sp.light === 'sun' && !bright) problems.push('needs light')
  if (sp.light === 'shade' && lampOn) problems.push('too bright')
  return problems
}

// Advance one plant by one day.
export function growPlant(plant, { lampOn, weather, lidOpen }) {
  if (plant.health <= 0) return plant
  const w = WEATHER[weather]
  const problems = plantProblems(plant, lampOn, weather)

  const sp = SPECIES[plant.species]
  let water = plant.water - (w.evaporation + (lampOn ? 6 : 0)) * sp.thirst
  if (lidOpen) water += w.rain
  water = Math.max(0, Math.min(100, water))

  let { stage, progress, health } = plant
  if (problems.length === 0) {
    health = Math.min(100, health + 10)
    if (stage < MAX_STAGE) {
      progress += 1
      if (progress >= sp.daysPerStage) {
        stage += 1
        progress = 0
      }
    }
  } else {
    health = Math.max(0, health - 15 * problems.length)
  }

  return { ...plant, water, stage, progress, health }
}
