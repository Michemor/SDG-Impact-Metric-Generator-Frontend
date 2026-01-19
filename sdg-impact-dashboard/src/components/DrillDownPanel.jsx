const StatsBadge = ({ label, value }) => (
  <div style={{ display: 'flex', flexDirection: 'column', padding: '0.75rem', background: '#eef2ff', borderRadius: '12px' }}>
    <span style={{ fontSize: '0.8rem', color: '#475569' }}>{label}</span>
    <strong style={{ fontSize: '1.1rem' }}>{value}</strong>
  </div>
)

const RecordList = ({ title, items, onSelect }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
      <strong>{title}</strong>
      <span className="muted" style={{ fontSize: '0.85rem' }}>
        {items.length} item{items.length === 1 ? '' : 's'}
      </span>
    </div>
    {items.length === 0 ? (
      <div className="muted" style={{ fontSize: '0.9rem' }}>
        No {title.toLowerCase()} linked to this SDG yet.
      </div>
    ) : (
      <div className="vertical-stack">
        {items.map((item) => (
          <button key={item.id} className="record-card" onClick={() => onSelect(item.id)}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', alignItems: 'flex-start' }}>
              <strong>{item.title}</strong>
              <span className="muted" style={{ fontSize: '0.85rem' }}>
                {item.year} • {item.department?.name ?? 'Department N/A'}
              </span>
              <div className="chip-list">
                {item.sdgs.map((goal) => (
                  <span key={goal.id} className="chip">
                    {goal.code}
                  </span>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>
    )}
  </div>
)

const DrillDownPanel = ({ loading, error, detail, onSelectRecord }) => {
  if (loading) {
    return <div className="muted">Loading SDG drill-down...</div>
  }

  if (error) {
    return <div className="error-text">{error}</div>
  }

  if (!detail?.sdg) {
    return <div className="muted">Select an SDG to explore linked projects and publications.</div>
  }

  return (
    <div className="drilldown-panel">
      <div style={{ marginBottom: '1rem' }}>
        <div className="chip" style={{ background: '#2563eb', color: '#ffffff', alignSelf: 'flex-start' }}>
          {detail.sdg.code}
        </div>
        <h3 style={{ marginBottom: '0.25rem' }}>{detail.sdg.title}</h3>
        <div className="muted" style={{ fontSize: '0.9rem' }}>
          Click a record to reveal its metadata. Use the export actions to capture this view in PDF or CSV format.
        </div>
      </div>

      <div className="stats-grid">
        <StatsBadge label="Projects" value={detail.stats.projects} />
        <StatsBadge label="Publications" value={detail.stats.publications} />
        <StatsBadge label="Departments" value={detail.stats.departments} />
        <StatsBadge label="Researchers" value={detail.stats.researchers} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
        <RecordList title="Projects" items={detail.projects ?? []} onSelect={onSelectRecord} />
        <RecordList title="Publications" items={detail.publications ?? []} onSelect={onSelectRecord} />
      </div>
    </div>
  )
}

export default DrillDownPanel
