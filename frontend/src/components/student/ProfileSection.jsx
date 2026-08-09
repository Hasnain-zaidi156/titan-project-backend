"use client"

// Profile page - view/edit student profile

export default function ProfileSection({
  setStudentView,
  isEditingProfile,
  profileData,
  profileDraft,
  setProfileDraft,
  profilePhoto,
  profilePhotoDraft,
  profileFileRef,
  handleProfilePhotoChange,
  startEditProfile,
  saveProfile,
  cancelEditProfile,
  studentCourse,
  savingProfile,
  profileSaveError,
}) {
  return (
    <div className="s-section animated-fade">
      <div className="s-breadcrumb-row">
        <div className="breadcrumbs">
          <span className="breadcrumb-nav-link" onClick={() => setStudentView("home")}>Home</span> &gt; <span className="current-crumb">Profile</span>
        </div>
      </div>

      <div className="s-profile-card">
        <div className="s-profile-top">
          <div className="s-profile-avatar-wrap">
            <img src={isEditingProfile ? profilePhotoDraft : profilePhoto} alt="Avatar" className="s-profile-avatar" />
            {isEditingProfile && (
              <button className="s-avatar-edit-btn" onClick={() => profileFileRef.current?.click()} title="Change photo">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
              </button>
            )}
            <input ref={profileFileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleProfilePhotoChange} />
          </div>
          <div className="s-profile-identity">
            {isEditingProfile ? (
              <input type="text" className="s-profile-name-input" value={profileDraft.name} onChange={(e) => setProfileDraft({ ...profileDraft, name: e.target.value })} />
            ) : (
              <h1 className="s-profile-name">{profileData.name}</h1>
            )}
            <span className="s-role-pill">Student</span>
          </div>
          <div className="s-profile-actions">
            {isEditingProfile ? (
              <>
                <button className="s-btn-outline" onClick={cancelEditProfile} disabled={savingProfile}>Cancel</button>
                <button className="s-btn-primary" onClick={saveProfile} disabled={savingProfile}>
                  {savingProfile ? "Saving..." : "Save Changes"}
                </button>
              </>
            ) : (
              <button className="s-btn-outline" onClick={startEditProfile}>Edit Profile</button>
            )}
          </div>
        </div>
        {profileSaveError && (
          <p style={{ color: "var(--red-color, #ef4444)", fontSize: "0.85rem", padding: "0 20px 10px" }}>{profileSaveError}</p>
        )}

        <div className="s-profile-grid">
          <div className="s-profile-section">
            <h3>Contact Information</h3>
            {isEditingProfile ? (
              <div className="s-profile-fields">
                <div className="s-profile-field"><label>Email</label><input value={profileDraft.email} onChange={(e) => setProfileDraft({ ...profileDraft, email: e.target.value })} /></div>
                <div className="s-profile-field"><label>Phone</label><input value={profileDraft.phone} onChange={(e) => setProfileDraft({ ...profileDraft, phone: e.target.value })} /></div>
                <div className="s-profile-field"><label>Address</label><input value={profileDraft.address} onChange={(e) => setProfileDraft({ ...profileDraft, address: e.target.value })} /></div>
              </div>
            ) : (
              <div className="s-profile-info-list">
                <div className="s-info-row"><span className="s-info-label">Email</span><span className="s-info-value">{profileData.email}</span></div>
                <div className="s-info-row"><span className="s-info-label">Phone</span><span className="s-info-value">{profileData.phone}</span></div>
                <div className="s-info-row"><span className="s-info-label">Address</span><span className="s-info-value s-info-muted">{profileData.address}</span></div>
              </div>
            )}
          </div>

          <div className="s-profile-section">
            <h3>Personal Information</h3>
            {isEditingProfile ? (
              <div className="s-profile-fields">
                <div className="s-profile-field"><label>Gender</label>
                  <select value={profileDraft.gender} onChange={(e) => setProfileDraft({ ...profileDraft, gender: e.target.value })}>
                    <option>Male</option><option>Female</option>
                  </select>
                </div>
                <div className="s-profile-field"><label>Date of Birth</label><input type="date" value={profileDraft.dob} onChange={(e) => setProfileDraft({ ...profileDraft, dob: e.target.value })} /></div>
                <div className="s-profile-field"><label>Last Qualification</label><input value={profileDraft.qualification} onChange={(e) => setProfileDraft({ ...profileDraft, qualification: e.target.value })} /></div>
                <div className="s-profile-field"><label>CNIC</label><input value={profileDraft.cnic} onChange={(e) => setProfileDraft({ ...profileDraft, cnic: e.target.value })} /></div>
              </div>
            ) : (
              <div className="s-profile-info-list">
                <div className="s-info-row"><span className="s-info-label">Gender</span><span className="s-info-value">{profileData.gender}</span></div>
                <div className="s-info-row"><span className="s-info-label">Date of Birth</span><span className="s-info-value">{profileData.dob}</span></div>
                <div className="s-info-row"><span className="s-info-label">Last Qualification</span><span className="s-info-value s-info-muted">{profileData.qualification}</span></div>
                <div className="s-info-row"><span className="s-info-label">CNIC</span><span className="s-info-value">{profileData.cnic}</span></div>
              </div>
            )}
          </div>

          <div className="s-profile-section">
            <h3>Enrolled Courses</h3>
            <div className="s-enrolled-course-card">
              <div className="s-ec-top">
                <div><h4>{studentCourse.title}</h4><p className="s-ec-meta">Batch {studentCourse.batch} · {studentCourse.campus}</p></div>
                <span className="enrolled-badge-pill">{studentCourse.status}</span>
              </div>
              <div className="s-ec-progress">
                <div className="student-progress-row"><span>Progress</span><strong>{studentCourse.progress}%</strong></div>
                <div className="progress-bar-rail" style={{ marginBottom: 0 }}><div className="progress-bar-fill-track" style={{ width: `${studentCourse.progress}%` }} /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}