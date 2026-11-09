import { SPECIES, STAGES, MAX_STAGE, stageEmoji, plantProblems } from '../plants'

function Meter({ label, value, color }) {
  return (
    <div className="meter" title={`${label}: ${Math.round(value)}%`}>
      <span className="meter-label">{label}</span>
      <div className="meter-track">
        <div className="meter-fill" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  )
}

export default function Pot({ plant, index, isSelected, lampOn, weather, onClick }) {
  if (!plant) {
    return (
      <button className={`pot empty ${isSelected ? 'selected' : ''}`} onClick={() => onClick(index)}>
        <div className="sprite faded">＋</div>
        <div className="pot-base" />
        <div className="pot-caption">Empty pot</div>
      </button>
    )
  }

  const sp = SPECIES[plant.species]
  const dead = plant.health <= 0
  const problems = dead ? [] : plantProblems(plant, lampOn, weather)
  const ready = plant.stage === MAX_STAGE && !dead

  return (
    <button
      className={`pot ${isSelected ? 'selected' : ''} ${dead ? 'dead' : ''} ${ready ? 'ready' : ''}`}
      onClick={() => onClick(index)}
    >
      <div className={`sprite stage-${plant.stage}`} key={`${plant.stage}-${dead}`}>
        {stageEmoji(plant)}
      </div>
      <div className="pot-base" style={{ borderTopColor: sp.seedColor }} />
      <div className="pot-caption">
        <strong>{sp.name}</strong> · {dead ? 'Wilted' : STAGES[plant.stage]}
      </div>
      {!dead && (
        <>
          <Meter label="💧" value={plant.water} color="#4aa3df" />
          <Meter label="❤️" value={plant.health} color={plant.health > 40 ? '#5cb85c' : '#e67e22'} />
        </>
      )}
      <div className="badges">
        {problems.map((p) => (
          <span key={p} className="badge warn">{p}</span>
        ))}
        {ready && <span className="badge good">ready to harvest!</span>}
      </div>
    </button>
  )
}
