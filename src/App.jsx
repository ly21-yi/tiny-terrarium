import { useEffect, useState } from 'react'
import Pot from './components/Pot'
import Toolbar from './components/Toolbar'
import Environment from './components/Environment'
import Journal from './components/Journal'
import { SPECIES, MAX_STAGE, newPlant, growPlant, randomWeather } from './plants'

const POT_COUNT = 6
let logId = 0

export default function App() {
  const [pots, setPots] = useState(Array(POT_COUNT).fill(null))
  const [tool, setTool] = useState('plant')
  const [seed, setSeed] = useState('sunflower')
  const [selected, setSelected] = useState(null)
  const [day, setDay] = useState(1)
  const [weather, setWeather] = useState('sunny')
  const [lampOn, setLampOn] = useState(true)
  const [lidOpen, setLidOpen] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [harvests, setHarvests] = useState({})
  const [log, setLog] = useState([{ id: logId++, text: '🌱 Welcome! Pick a seed and click an empty pot.' }])

  function addLog(text) {
    setLog((prev) => [{ id: logId++, text }, ...prev].slice(0, 12))
  }

  function updatePot(index, plant) {
    setPots((prev) => prev.map((p, i) => (i === index ? plant : p)))
  }

  function handlePotClick(index) {
    const plant = pots[index]
    setSelected(index)

    if (tool === 'plant') {
      if (plant) return addLog('That pot is taken. Harvest or clear it first.')
      updatePot(index, newPlant(seed))
      addLog(`🌰 Planted a ${SPECIES[seed].name} seed.`)
    } else if (tool === 'water') {
      if (!plant || plant.health <= 0) return
      updatePot(index, { ...plant, water: Math.min(100, plant.water + 25) })
      addLog(`💧 Watered the ${SPECIES[plant.species].name}.`)
    } else if (tool === 'harvest') {
      if (!plant) return
      if (plant.stage === MAX_STAGE && plant.health > 0) {
        setHarvests((prev) => ({ ...prev, [plant.species]: (prev[plant.species] || 0) + 1 }))
        addLog(`✨ Harvested a ${SPECIES[plant.species].bloom} ${SPECIES[plant.species].name}!`)
      } else {
        addLog(`🧹 Cleared the ${SPECIES[plant.species].name}.`)
      }
      updatePot(index, null)
    }
  }

  function nextDay() {
    const grownPots = pots.map((plant) => {
      if (!plant) return plant
      const grown = growPlant(plant, { lampOn, weather, lidOpen })
      const name = SPECIES[plant.species].name
      if (grown.health <= 0 && plant.health > 0) addLog(`🥀 Your ${name} wilted.`)
      else if (grown.stage > plant.stage) {
        addLog(grown.stage === MAX_STAGE ? `🌸 Your ${name} is blooming!` : `⬆️ Your ${name} grew.`)
      }
      return grown
    })
    setPots(grownPots)
    if (weather === 'rainy' && lidOpen) addLog('🌧️ Rain watered the terrarium.')
    setWeather(randomWeather())
    setDay((d) => d + 1)
  }

  // Auto-play advances a day every 2.5 seconds while enabled.
  useEffect(() => {
    if (!playing) return
    const timer = setInterval(nextDay, 2500)
    return () => clearInterval(timer)
  })

  const totalHarvests = Object.values(harvests).reduce((a, b) => a + b, 0)
  const speciesFound = Object.keys(harvests).length
  const inspected = tool === 'inspect' && selected !== null ? pots[selected] : null

  return (
    <div className={`app ${lampOn ? 'lamp' : ''} weather-${weather}`}>
      <header>
        <h1>🌿 Tiny Terrarium</h1>
        <p>
          Grow all five species to complete your collection.{' '}
          <strong>{speciesFound}/5 discovered</strong> · {totalHarvests} harvested
        </p>
      </header>

      <main className="layout">
        <div className="left">
          <Environment
            day={day}
            weather={weather}
            lampOn={lampOn}
            lidOpen={lidOpen}
            playing={playing}
            onToggleLamp={() => setLampOn((v) => !v)}
            onToggleLid={() => setLidOpen((v) => !v)}
            onNextDay={nextDay}
            onTogglePlay={() => setPlaying((v) => !v)}
          />
          <Toolbar tool={tool} onToolChange={setTool} seed={seed} onSeedChange={setSeed} />
        </div>

        <section className={`terrarium ${lidOpen ? 'lid-open' : ''}`}>
          <div className="glass-lid" />
          {lampOn && <div className="lamp-glow" />}
          {weather === 'rainy' && lidOpen && <div className="rain" />}
          <div className="pot-grid">
            {pots.map((plant, i) => (
              <Pot
                key={i}
                index={i}
                plant={plant}
                isSelected={selected === i}
                lampOn={lampOn}
                weather={weather}
                onClick={handlePotClick}
              />
            ))}
          </div>
        </section>

        <Journal harvests={harvests} log={log} inspected={inspected} />
      </main>

      {speciesFound === 5 && (
        <div className="victory">🏆 You discovered every species! You're a master gardener.</div>
      )}
    </div>
  )
}
