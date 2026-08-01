import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TitanPortal.css';

export default function TitanPortal({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [view, setView] = useState('student-login');
  
  const [cnic, setCnic] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleViewChange = (newView) => {
    setView(newView);
    setCnic('');
    setEmail('');
    setDob('');
    setPassword('');
    setShowPassword(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (view === 'teacher-login') {
      if (email === 'drhasnain953@gmail.com' && password === '2008hasanin') {
        onLoginSuccess('trainer', { name: "Dr. Hasnain", email: email });
      } else {
        alert("Invalid Trainer Email or Password!");
      }
    } else if (view === 'student-login') {
      if (cnic.trim() === '4550290108391' && password === 'Hasnain') {
        onLoginSuccess('student', { name: "Hasnain", cnic: cnic });
      } else {
        alert("Invalid CNIC or Password!");
      }
    } else if (view === 'student-register') {
      alert("Password created successfully! Kindly switch to Login tab.");
      handleViewChange('student-login');
    }
  };

  return (
    <div className="titan-container">
      {/* Branding Header */}
      <div className="titan-header">
        <div className="titan-logo-container">
          <img 
            src="https://i.ibb.co/q3c3CkLS/titan-logo.jpg" 
            alt="TITAN Logo" 
            className="titan-logo-img" 
          />
        </div>
        <p className="titan-fullname">Taj Institute of Technology and Applied Networks</p>
        <h2 className="titan-portal-title">
          {view === 'teacher-login' ? 'Trainer Portal' : 'Student Portal'}
        </h2>
      </div>

      {/* Main Card */}
      <div className="titan-card">
        
        {/* Student Navigation Tabs */}
        {view !== 'teacher-login' && (
          <div className="titan-tabs">
            <button 
              type="button"
              className={`tab-btn ${view === 'student-login' ? 'active' : ''}`}
              onClick={() => handleViewChange('student-login')}
            >
              Login
            </button>
            <button 
              type="button"
              className={`tab-btn ${view === 'student-register' ? 'active' : ''}`}
              onClick={() => handleViewChange('student-register')}
            >
              Create Password
            </button>
          </div>
        )}

        {/* Dynamic Form Content */}
        <form onSubmit={handleSubmit} className="titan-form">
          
          {view === 'student-login' && (
            <>
              <h3>Login</h3>
              <p className="form-instruction">
                Kindly provide the CNIC number and password used during TITAN course registration.
              </p>
              
              <div className="input-group">
                <label>CNIC *</label>
                <input 
                  type="text" 
                  inputMode="numeric"
                  placeholder="Enter CNIC number"
                  value={cnic} 
                  onChange={(e) => setCnic(e.target.value.replace(/[^0-9]/g, ''))} 
                  required 
                />
              </div>
            </>
          )}

          {view === 'student-register' && (
            <>
              <h3>Create a Password</h3>
              <p className="form-instruction">
                Kindly provide the CNIC number and DOB used during TITAN course registration.
              </p>
              
              <div className="input-group">
                <label>CNIC *</label>
                <input 
                  type="text" 
                  inputMode="numeric"
                  placeholder="Enter CNIC number"
                  value={cnic} 
                  onChange={(e) => setCnic(e.target.value.replace(/[^0-9]/g, ''))} 
                  required 
                />
              </div>

              <div className="input-group">
                <label>DOB *</label>
                <input 
                  type="date" 
                  value={dob} 
                  onChange={(e) => setDob(e.target.value)} 
                  required 
                />
              </div>
            </>
          )}

          {view === 'teacher-login' && (
            <>
              <h3>Login</h3>
              <p className="form-instruction">
                Kindly provide your email and password to access the trainer portal.
              </p>
              
              <div className="input-group">
                <label>Email *</label>
                <input 
                  type="email" 
                  placeholder="trainer@example.com"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
            </>
          )}

          {/* Password Input */}
          <div className="input-group password-group">
            <label>Password *</label>
            <div className="password-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
              <button 
                type="button" 
                className="toggle-password-text"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <button type="submit" className="submit-btn">
            {view === 'student-register' ? 'SUBMIT' : 'LOGIN'}
          </button>

          {view === 'teacher-login' && (
            <span className="forgot-password-link">Forgot Password?</span>
          )}
        </form>
      </div>

      {/* Switching Button Area */}
      <div className="portal-switcher-box">
        {view === 'teacher-login' ? (
          <button 
            type="button"
            className="switch-portal-btn"
            onClick={() => handleViewChange('student-login')}
          >
            Login as student
          </button>
        ) : (
          <button 
            type="button"
            className="switch-portal-btn"
            onClick={() => handleViewChange('teacher-login')}
          >
            Login as teacher
          </button>
        )}
      </div>

      {/* ══════ Admin Portal Link ══════ */}
      {/* <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <button
          type="button"
          onClick={() => navigate('')}
          style={{
            background: 'none',
            border: 'none',
            color: '#555',
            fontSize: '12px',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: '4px',
            transition: 'color 0.2s',
            fontFamily: 'inherit',
          }}
          onMouseEnter={(e) => (e.target.style.color = '#1a3c6e')}
          onMouseLeave={(e) => (e.target.style.color = '#555')}
        >
          
        </button>
      </div>*/}
    </div>
  );
}