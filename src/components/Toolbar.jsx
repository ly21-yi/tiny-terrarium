import { SPECIES } from '../plants'

const TOOLS = [
  { key: 'plant', icon: '🌰', label: 'Plant' },
  { key: 'water', icon: '💧', label: 'Water' },
  { key: 'harvest', icon: '✂️', label: 'Harvest / Clear' },
  { key: 'inspect', icon: '🔍', label: 'Inspect' },
]

export default function Toolbar({ tool, onToolChange, seed, onSeedChange }) {
  return (
    <section className="panel toolbar">
      <h2>Tools</h2>
      <div className="tool-row">
        {TOOLS.map((t) => (
          <button
            key={t.key}
            className={`tool ${tool === t.key ? 'active' : ''}`}
            onClick={() => onToolChange(t.key)}
          >
            <span className="tool-icon">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {tool === 'plant' && (
        <>
          <h3>Choose a seed</h3>
          <div className="seed-row">
            {Object.entries(SPECIES).map(([key, sp]) => (
              <button
                key={key}
                className={`seed ${seed === key ? 'active' : ''}`}
                onClick={() => onSeedChange(key)}
                title={sp.tip}
              >
                <span>{sp.bloom}</span>
                {sp.name}
              </button>
            ))}
          </div>
          <p className="hint">{SPECIES[seed].tip}</p>
        </>
      )}
    </section>
  )
}
