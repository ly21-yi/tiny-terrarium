import { WEATHER } from '../plants'

export default function Environment({
  day, weather, lampOn, lidOpen, playing,
  onToggleLamp, onToggleLid, onNextDay, onTogglePlay,
}) {
  const w = WEATHER[weather]
  return (
    <section className="panel environment">
      <div className="day-card">
        <span className="weather-icon">{w.icon}</span>
        <div>
          <div className="day-number">Day {day}</div>
          <div className="weather-label">{w.label} outside</div>
        </div>
      </div>

      <div className="switches">
        <label className="switch">
          <input type="checkbox" checked={lampOn} onChange={onToggleLamp} />
          <span>💡 Grow lamp {lampOn ? 'on' : 'off'}</span>
        </label>
        <label className="switch">
          <input type="checkbox" checked={lidOpen} onChange={onToggleLid} />
          <span>🫙 Lid {lidOpen ? 'open (rain gets in)' : 'closed'}</span>
        </label>
      </div>

      <div className="time-controls">
        <button className="primary" onClick={onNextDay}>⏭ Next day</button>
        <button onClick={onTogglePlay}>{playing ? '⏸ Pause' : '▶ Auto-play'}</button>
      </div>
    </section>
  )
}
