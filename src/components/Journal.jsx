import { SPECIES } from '../plants'

export default function Journal({ harvests, log, inspected }) {
  return (
    <section className="panel journal">
      {inspected && (
        <div className="inspect">
          <h2>🔍 {SPECIES[inspected.species].name}</h2>
          <p>{SPECIES[inspected.species].tip}</p>
          <p className="small">
            Ideal water: {SPECIES[inspected.species].water[0]}–{SPECIES[inspected.species].water[1]}% ·
            Light: {SPECIES[inspected.species].light}
          </p>
        </div>
      )}

      <h2>Harvest collection</h2>
      <div className="collection">
        {Object.entries(SPECIES).map(([key, sp]) => (
          <div key={key} className={`collected ${harvests[key] ? '' : 'locked'}`} title={sp.name}>
            <span>{harvests[key] ? sp.bloom : '❔'}</span>
            <small>×{harvests[key] || 0}</small>
          </div>
        ))}
      </div>

      <h2>Garden log</h2>
      <ul className="log">
        {log.map((entry) => (
          <li key={entry.id}>{entry.text}</li>
        ))}
      </ul>
    </section>
  )
}
