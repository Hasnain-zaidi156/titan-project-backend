import React from 'react';
import { PROFILE_BG_IMG } from './mockData';

const ProfilePage = ({
  trainerProfile, profilePhoto,
  isEditingProfile, profileDraft, setProfileDraft,
  profilePhotoDraft, photoInputRef, handlePhotoChange,
  startEditingProfile, saveProfileEdits, cancelEditingProfile, downloadTrainerCard,
}) => {
  return (
    <div className="profile-page-wrapper animated-fade">
      <div className="profile-cover-banner" style={{ backgroundImage: `url(${PROFILE_BG_IMG})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="profile-cover-overlay"></div>
        <div className="profile-cover-avatar-wrap" onClick={() => { if (!isEditingProfile) startEditingProfile(); setTimeout(() => photoInputRef.current?.click(), 50); }} style={{ cursor: 'pointer' }}>
          <img src={isEditingProfile ? profilePhotoDraft : profilePhoto} alt="Avatar" className="profile-cover-avatar" />
          <button className="profile-photo-upload-btn" onClick={(e) => { e.stopPropagation(); if (!isEditingProfile) startEditingProfile(); setTimeout(() => photoInputRef.current?.click(), 50); }} title="Change photo">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
          </button>
          <input ref={photoInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
        </div>
      </div>

      <div className="profile-identity-row">
        <div>
          {isEditingProfile ? (
            <input type="text" className="profile-name-edit-input" value={profileDraft.name} onChange={(e) => setProfileDraft({ ...profileDraft, name: e.target.value })} />
          ) : (
            <h1>{trainerProfile.name}</h1>
          )}
          <span className="role-pill-tag">Trainer</span>
        </div>
        <div className="profile-action-buttons">
          {isEditingProfile ? (
            <>
              <button className="btn-outline-action" onClick={cancelEditingProfile}>Cancel</button>
              <button className="btn-dark-action" onClick={saveProfileEdits}>Save Changes</button>
            </>
          ) : (
            <>
              <button className="btn-outline-action" onClick={startEditingProfile}>Edit Profile</button>
              <button className="btn-dark-action" onClick={downloadTrainerCard}>Download Card</button>
            </>
          )}
        </div>
      </div>

      <div className="profile-grid-layout">
        <div className="profile-info-card">
          <h3>Personal Information</h3>
          {isEditingProfile ? (
            <>
              <div className="info-row-item"><span className="info-label">Email</span><input className="info-edit-input" value={profileDraft.email} onChange={(e) => setProfileDraft({ ...profileDraft, email: e.target.value })} /></div>
              <div className="info-row-item"><span className="info-label">Employee ID</span><input className="info-edit-input" value={profileDraft.employeeId} onChange={(e) => setProfileDraft({ ...profileDraft, employeeId: e.target.value })} /></div>
              <div className="info-row-item"><span className="info-label">Hourly Rate</span><input className="info-edit-input" value={profileDraft.hourlyRate} onChange={(e) => setProfileDraft({ ...profileDraft, hourlyRate: e.target.value })} /></div>
              <div className="info-row-item"><span className="info-label">Phone</span><input className="info-edit-input" value={profileDraft.phone} onChange={(e) => setProfileDraft({ ...profileDraft, phone: e.target.value })} /></div>
            </>
          ) : (
            <>
              <div className="info-row-item"><span className="info-label">Email</span><span className="info-value">{trainerProfile.email}</span></div>
              <div className="info-row-item"><span className="info-label">Employee ID</span><span className="info-value">{trainerProfile.employeeId}</span></div>
              <div className="info-row-item"><span className="info-label">Hourly Rate</span><span className="info-value">{trainerProfile.hourlyRate}</span></div>
              <div className="info-row-item"><span className="info-label">Phone</span><span className="info-value">{trainerProfile.phone}</span></div>
            </>
          )}
        </div>
        <div className="profile-info-card">
          <h3>Bio</h3>
          <p className="muted-italic-text">No bio added yet.</p>
        </div>
        <div className="profile-info-card">
          <h3>Social Links</h3>
          <p className="muted-italic-text">No social links added yet.</p>
        </div>
        <div className="profile-info-card">
          <h3>Security</h3>
          <button className="btn-outline-action">Update Password</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
