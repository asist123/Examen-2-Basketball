// Marcador del partido (informativo).
function Scoreboard() {
  return (
    <section className="scoreboard" aria-label="Marcador del partido">
      <div className="scoreboard__team">
        <strong className="scoreboard__code">TCB</strong>
        <span className="scoreboard__name">Top Club Flames</span>
      </div>
      <div className="scoreboard__score">
        <span className="scoreboard__points scoreboard__points--home">98</span>
        <span className="scoreboard__dash">—</span>
        <span className="scoreboard__points scoreboard__points--away">92</span>
      </div>
      <div className="scoreboard__team scoreboard__team--away">
        <strong className="scoreboard__code">RIV</strong>
        <span className="scoreboard__name">Rival All-Stars</span>
      </div>
      <div className="scoreboard__meta">
        <span className="scoreboard__badge">Q4 · 01:12</span>
        <span>Arena Central · 18 Nov</span>
      </div>
    </section>
  );
}

export default Scoreboard;
