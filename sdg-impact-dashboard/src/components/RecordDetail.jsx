const RecordDetail = ({ record }) => {
  if (!record) {
    return null
  }

  return (
    <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <div className="chip" style={{ background: '#1d4ed8', color: '#ffffff', width: 'max-content' }}>
          {record.type === 'project' ? 'Project' : 'Publication'}
        </div>
        <h3 style={{ marginBottom: '0.25rem' }}>{record.title}</h3>
        <div className="muted" style={{ fontSize: '0.9rem' }}>
          {record.year} • {record.department?.name ?? 'Department N/A'}
        </div>
      </div>

      <div className="chip-list">
        {record.sdgs.map((sdg) => (
          <span key={sdg.id} className="chip">
            {sdg.code}
          </span>
        ))}
      </div>

      <div>
        <strong>Researchers / Authors</strong>
        <div className="muted" style={{ marginTop: '0.35rem' }}>
          {record.researchers.length
            ? record.researchers.map((person) => person.name).join(', ')
            : 'No researchers linked yet.'}
        </div>
      </div>

      <div>
        <strong>Description</strong>
        <p className="muted" style={{ marginTop: '0.35rem' }}>
          {record.description || 'No description provided yet.'}
        </p>
      </div>
    </div>
  )
}

export default RecordDetail
