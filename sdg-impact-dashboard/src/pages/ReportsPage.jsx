import { useEffect, useMemo, useState } from 'react'
import ExportButtons from '../components/ExportButtons'
import DrillDownPanel from '../components/DrillDownPanel'
import RecordDetail from '../components/RecordDetail'
import { fetchRecordDetail, fetchReportSummary, fetchSdgDetail } from '../services/apiClient'

const SummaryPlaceholder = () => (
  <div className="muted">No SDG-linked records were found. Add a project or publication to begin reporting.</div>
)

function ReportsPage() {
  const [summary, setSummary] = useState(null)
  const [loadingSummary, setLoadingSummary] = useState(true)
  const [summaryError, setSummaryError] = useState(null)

  const [selectedSdgId, setSelectedSdgId] = useState(null)
  const [sdgDetail, setSdgDetail] = useState(null)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [detailError, setDetailError] = useState(null)

  const [focusedRecord, setFocusedRecord] = useState(null)
  const [recordError, setRecordError] = useState(null)
  const [recordLoading, setRecordLoading] = useState(false)

  useEffect(() => {
    const loadSummary = async () => {
      setLoadingSummary(true)
      setSummaryError(null)
      try {
        const data = await fetchReportSummary()
        setSummary(data)
        if (data?.sdgs?.length && !selectedSdgId) {
          setSelectedSdgId(data.sdgs[0].id)
        }
      } catch (error) {
        setSummaryError(error.message)
      } finally {
        setLoadingSummary(false)
      }
    }

    loadSummary()
  }, [])

  useEffect(() => {
    if (!selectedSdgId) {
      setSdgDetail(null)
      return
    }

    const loadDetail = async () => {
      setLoadingDetail(true)
      setDetailError(null)
      setFocusedRecord(null)
      try {
        const detail = await fetchSdgDetail(selectedSdgId)
        setSdgDetail(detail)
      } catch (error) {
        setDetailError(error.message)
      } finally {
        setLoadingDetail(false)
      }
    }

    loadDetail()
  }, [selectedSdgId])

  const totals = useMemo(() => summary?.totals ?? null, [summary])

  const handleSelectRecord = async (recordId) => {
    setRecordError(null)
    setRecordLoading(true)
    try {
      const detail = await fetchRecordDetail(recordId)
      setFocusedRecord(detail)
    } catch (error) {
      setRecordError(error.message)
      setFocusedRecord(null)
    } finally {
      setRecordLoading(false)
    }
  }

  return (
    <>
      <div className="card">
        <h2>Reports</h2>
        <p className="muted">
          Export institutional SDG impact insights and drill into projects, publications, departments, and researchers.
        </p>
        <ExportButtons summary={summary} selectedDetail={sdgDetail} disabled={!summary?.sdgs?.length} />
      </div>

      <div className="two-column">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <strong>SDG Summary</strong>
              {totals ? (
                <div className="muted" style={{ marginTop: '0.25rem' }}>
                  {totals.projects} projects • {totals.publications} publications • {totals.departments} departments •
                  {` ${totals.researchers} researchers`}
                </div>
              ) : null}
            </div>
          </div>
          {loadingSummary && <div className="muted">Loading report summary...</div>}
          {summaryError && <div className="error-text">{summaryError}</div>}
          {!loadingSummary && !summaryError && !summary?.sdgs?.length ? (
            <SummaryPlaceholder />
          ) : null}
          {!loadingSummary && !summaryError && summary?.sdgs?.length ? (
            <table className="table">
              <thead>
                <tr>
                  <th>SDG</th>
                  <th>Projects</th>
                  <th>Publications</th>
                  <th>Departments</th>
                  <th>Researchers</th>
                </tr>
              </thead>
              <tbody>
                {summary.sdgs.map((sdg) => (
                  <tr
                    key={sdg.id}
                    onClick={() => setSelectedSdgId(sdg.id)}
                    className={selectedSdgId === sdg.id ? 'active-row' : ''}
                  >
                    <td>
                      <div>
                        <strong>{sdg.code}</strong>
                        <div className="muted" style={{ fontSize: '0.85rem' }}>
                          {sdg.title}
                        </div>
                      </div>
                    </td>
                    <td>{sdg.projectCount}</td>
                    <td>{sdg.publicationCount}</td>
                    <td>{sdg.departmentCount}</td>
                    <td>{sdg.researcherCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
        </div>

        <div className="card">
          <DrillDownPanel
            loading={loadingDetail}
            error={detailError}
            detail={sdgDetail}
            onSelectRecord={handleSelectRecord}
          />
        </div>
      </div>

      <div className="card">
        <strong>Record Metadata</strong>
        {recordLoading && <div className="muted">Loading record details...</div>}
        {recordError && <div className="error-text">{recordError}</div>}
        {!recordLoading && !focusedRecord ? (
          <div className="muted">Select a project or publication to inspect its metadata.</div>
        ) : null}
        {focusedRecord ? <RecordDetail record={focusedRecord} /> : null}
      </div>
    </>
  )
}

export default ReportsPage;
