import React from 'react';
import { courseProgressData } from '../mockData';
import CircularProgress from '../CircularProgress';

const ProgressTab = ({ showComparison, setShowComparison }) => {
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
              <h4>{courseProgressData.mySlot.trainer} <span className="batch-outline-pill">{courseProgressData.mySlot.batch}</span></h4>
              <p className="muted-small-text">{courseProgressData.mySlot.schedule}</p>
            </div>
            <span className="topics-count-badge">Topics: {courseProgressData.mySlot.topicsDone}/{courseProgressData.mySlot.topicsTotal}</span>
          </div>
          <div className="overall-progress-label-row">
            <span>Overall progress</span>
            <span className="overall-progress-pct">{courseProgressData.mySlot.overall}%</span>
          </div>
          <div className="overall-progress-bar-blue">
            <div style={{ width: `${courseProgressData.mySlot.overall}%` }}></div>
          </div>
          <div className="modules-list-new">
            {courseProgressData.mySlot.modules.map((mod, idx) => (
              <div key={idx} className="module-row-item">
                <div className="module-row-left">
                  {mod.done
                    ? <span className="module-check-done"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /><circle cx="12" cy="12" r="10" stroke="#10b981" strokeWidth="2" /></svg></span>
                    : <span className="module-check-pending"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg></span>
                  }
                  <div>
                    <p className="module-name">{mod.name}</p>
                    <p className="module-topics-text">Topics: {mod.topicsDone}/{mod.topicsTotal}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CircularProgress pct={mod.pct} />
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" style={{ cursor: 'pointer' }}><polyline points="6 9 12 15 18 9" /></svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showComparison && (
          <div className="other-slots-panel">
            <p className="other-slots-label">OTHER SLOTS OF {courseProgressData.mySlot.batch}</p>
            <div className="other-slots-grid">
              {courseProgressData.otherSlots.map((slot, idx) => (
                <div key={idx} className="other-slot-card">
                  <div className="other-slot-header">
                    <span className="other-slot-trainer">{slot.trainer}</span>
                    <span className="other-slot-pct-badge" style={{ color: slot.pct >= 60 ? '#4f46e5' : '#f59e0b', background: slot.pct >= 60 ? '#eff2fe' : '#fffbeb' }}>{slot.pct}%</span>
                  </div>
                  <p className="muted-small-text">{slot.schedule}</p>
                  <p className="other-slot-covered-label">Covered topics</p>
                  <div className="other-slot-progress-bar">
                    <div style={{ width: `${slot.pct}%`, background: slot.pct >= 60 ? '#4f46e5' : '#f59e0b' }}></div>
                  </div>
                  <p className="muted-small-text" style={{ marginTop: '4px' }}>{slot.topicsDone}/{slot.topicsTotal}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressTab;
