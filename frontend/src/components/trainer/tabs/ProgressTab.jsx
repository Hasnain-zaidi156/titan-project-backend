import React, { useEffect, useState } from 'react';
import { API_BASE } from '../constants';
import CircularProgress from '../CircularProgress';

const ProgressTab = ({ showComparison, setShowComparison, course, trainer }) => {
  const [mine, setMine] = useState(null);
  const [others, setOthers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addingModule, setAddingModule] = useState(false);
  const [newModuleName, setNewModuleName] = useState('');

  const trainerId = trainer?.employeeId;
  const courseTitle = course?.title;

  const load = async () => {
    if (!courseTitle || !trainerId) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        course: courseTitle,
        campus: course?.campus || '',
        batch: course?.batch || '',
        trainerId,
        trainerName: trainer?.name || '',
        schedule: course?.schedule || '',
      });
      const res = await fetch(`${API_BASE}/api/progress?${params.toString()}`);
      const data = await res.json();
      setMine(data.mine || null);
      setOthers(Array.isArray(data.others) ? data.others : []);
    } catch (err) {
      console.error('Failed to load course progress:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [courseTitle, trainerId]);

  const saveModules = async (modules) => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/progress`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course: courseTitle,
          campus: course?.campus || '',
          batch: course?.batch || '',
          trainerId,
          trainerName: trainer?.name || '',
          schedule: course?.schedule || '',
          modules,
        }),
      });
      const data = await res.json();
      if (res.ok) setMine(data);
    } catch (err) {
      console.error('Failed to save course progress:', err);
    } finally {
      setSaving(false);
    }
  };

  const updateModuleTopics = (idx, field, value) => {
    const modules = (mine?.modules || []).map((m, i) =>
      i === idx ? { ...m, [field]: Math.max(0, Number(value) || 0) } : m
    );
    setMine((prev) => ({ ...prev, modules }));
  };

  const commitModuleEdit = () => saveModules(mine?.modules || []);

  const addModule = () => {
    if (!newModuleName.trim()) return;
    const modules = [...(mine?.modules || []), { name: newModuleName.trim(), topicsDone: 0, topicsTotal: 0 }];
    setNewModuleName('');
    setAddingModule(false);
    saveModules(modules);
  };

  const removeModule = (idx) => {
    const modules = (mine?.modules || []).filter((_, i) => i !== idx);
    saveModules(modules);
  };

  const modules = mine?.modules || [];
  const topicsDone = modules.reduce((sum, m) => sum + (m.topicsDone || 0), 0);
  const topicsTotal = modules.reduce((sum, m) => sum + (m.topicsTotal || 0), 0);
  const overall = topicsTotal > 0 ? Math.round((topicsDone / topicsTotal) * 100) : 0;

  if (loading) {
    return <div className="course-progress-overview-block"><p className="muted-italic-text">Loading course progress…</p></div>;
  }

  return (
    <div className="course-progress-overview-block">
      <div className="progress-compare-header">
        <div>
          <p className="progress-compare-label">COMPARE PROGRESS</p>
          <h3>Course Progress Overview</h3>
        </div>
        <button className="progress-compare-toggle-btn" onClick={() => setShowComparison(!showComparison)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
          {showComparison ? 'Only My Progress' : 'Show Comparison'}
        </button>
      </div>

      <div className={`progress-content-layout ${showComparison ? 'progress-split-layout' : ''}`}>
        <div className="my-progress-panel">
          <div className="my-progress-panel-header">
            <div>
              <p className="my-progress-label">MY PROGRESS</p>
              <h4>{trainer?.name || 'You'} <span className="batch-outline-pill">{course?.batch || ''}</span></h4>
              <p className="muted-small-text">{course?.schedule || ''}</p>
            </div>
            <span className="topics-count-badge">Topics: {topicsDone}/{topicsTotal}</span>
          </div>
          <div className="overall-progress-label-row">
            <span>Overall progress</span>
            <span className="overall-progress-pct">{overall}%</span>
          </div>
          <div className="overall-progress-bar-blue">
            <div style={{ width: `${overall}%` }}></div>
          </div>

          {modules.length === 0 && (
            <p className="muted-italic-text" style={{ margin: '12px 0' }}>No modules added yet — add one below to start tracking real progress.</p>
          )}

          <div className="modules-list-new">
            {modules.map((mod, idx) => (
              <div key={idx} className="module-row-item">
                <div className="module-row-left">
                  {mod.done
                    ? <span className="module-check-done"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /><circle cx="12" cy="12" r="10" stroke="#10b981" strokeWidth="2" /></svg></span>
                    : <span className="module-check-pending"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg></span>
                  }
                  <div>
                    <p className="module-name">{mod.name}</p>
                    <p className="module-topics-text">
                      Topics:{' '}
                      <input
                        type="number" min="0" value={mod.topicsDone}
                        onChange={(e) => updateModuleTopics(idx, 'topicsDone', e.target.value)}
                        onBlur={commitModuleEdit}
                        style={{ width: 44 }}
                      />
                      /
                      <input
                        type="number" min="0" value={mod.topicsTotal}
                        onChange={(e) => updateModuleTopics(idx, 'topicsTotal', e.target.value)}
                        onBlur={commitModuleEdit}
                        style={{ width: 44 }}
                      />
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CircularProgress pct={mod.pct} />
                  <button className="ta-icon-action" title="Remove module" onClick={() => removeModule(idx)} disabled={saving}>×</button>
                </div>
              </div>
            ))}
          </div>

          {addingModule ? (
            <div className="module-row-item" style={{ gap: 8 }}>
              <input
                type="text" placeholder="Module name" value={newModuleName}
                onChange={(e) => setNewModuleName(e.target.value)} autoFocus
                style={{ flex: 1 }}
              />
              <button className="ta-btn-primary ta-confirm-btn-sm" onClick={addModule} disabled={saving}>Add</button>
              <button className="ta-btn-outline ta-confirm-btn-sm" onClick={() => { setAddingModule(false); setNewModuleName(''); }}>Cancel</button>
            </div>
          ) : (
            <button className="progress-compare-toggle-btn" style={{ marginTop: 12 }} onClick={() => setAddingModule(true)}>+ Add Module</button>
          )}
        </div>

        {showComparison && (
          <div className="other-slots-panel">
            <p className="other-slots-label">OTHER SLOTS OF {course?.batch || courseTitle}</p>
            <div className="other-slots-grid">
              {others.length === 0 && <p className="muted-italic-text">No other trainer has logged progress for this course yet.</p>}
              {others.map((slot, idx) => {
                const done = (slot.modules || []).reduce((s, m) => s + (m.topicsDone || 0), 0);
                const total = (slot.modules || []).reduce((s, m) => s + (m.topicsTotal || 0), 0);
                const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                return (
                  <div key={idx} className="other-slot-card">
                    <div className="other-slot-header">
                      <span className="other-slot-trainer">{slot.trainerName || 'Trainer'}</span>
                      <span className="other-slot-pct-badge" style={{ color: pct >= 60 ? '#4f46e5' : '#f59e0b', background: pct >= 60 ? '#eff2fe' : '#fffbeb' }}>{pct}%</span>
                    </div>
                    <p className="muted-small-text">{slot.schedule}</p>
                    <p className="other-slot-covered-label">Covered topics</p>
                    <div className="other-slot-progress-bar">
                      <div style={{ width: `${pct}%`, background: pct >= 60 ? '#4f46e5' : '#f59e0b' }}></div>
                    </div>
                    <p className="muted-small-text" style={{ marginTop: '4px' }}>{done}/{total}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressTab;
