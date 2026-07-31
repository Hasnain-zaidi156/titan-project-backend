import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TitanPortal.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function TitanPortal({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [view, setView] = useState('student-login');
  
  const [cnic, setCnic] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleViewChange = (newView) => {
    setView(newView);
    setCnic('');
    setEmail('');
    setDob('');
    setPassword('');
    setShowPassword(false);
    setLoading(false);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (view === 'teacher-login') {
        // Demo trainer login
        if (email === 'drhasnain953@gmail.com' && password === '2008hasanin') {
          onLoginSuccess('trainer', { name: "Dr. Hasnain", email: email });
        } else {
          setError('Invalid Trainer Email or Password!');
        }
        setLoading(false);
        return;
      }

      if (view === 'student-login') {
        // Real student login API
        const response = await fetch(`${API_BASE}/api/students/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cnic: cnic.trim(), password }),
        });
        const data = await response.json();
        if (!response.ok) {
          setError(data.message || 'Login failed.');
          setLoading(false);
          return;
        }
        // Login successful
        onLoginSuccess('student', data);
        setLoading(false);
        return;
      }

      if (view === 'student-register') {
        // Create password API
        const response = await fetch(`${API_BASE}/api/students/set-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cnic: cnic.trim(), dob, newPassword: password }),
        });
        const data = await response.json();
        if (!response.ok) {
          setError(data.message || 'Password creation failed.');
          setLoading(false);
          return;
        }
        alert(data.message);
        handleViewChange('student-login');
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error('Request error:', error);
      setError('Could not connect to server. Please try again.');
      setLoading(false);
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
              disabled={loading}
            >
              Login
            </button>
            <button 
              type="button"
              className={`tab-btn ${view === 'student-register' ? 'active' : ''}`}
              onClick={() => handleViewChange('student-register')}
              disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
                />
              </div>

              <div className="input-group">
                <label>DOB *</label>
                <input 
                  type="date" 
                  value={dob} 
                  onChange={(e) => setDob(e.target.value)} 
                  required 
                  disabled={loading}
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
                  disabled={loading}
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
                placeholder={view === 'student-register' ? "Create a new password (min 6 characters)" : "Enter password"}
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                minLength={view === 'student-register' ? 6 : undefined}
                disabled={loading}
              />
              <button 
                type="button" 
                className="toggle-password-text"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {view === 'student-register' && (
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Password must be at least 6 characters long.
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div style={{ 
              color: '#dc2626', 
              fontSize: '0.85rem', 
              padding: '8px 12px', 
              background: '#fef2f2', 
              borderRadius: '6px',
              border: '1px solid #fecaca',
              marginBottom: '10px'
            }}>
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Processing...' : (view === 'student-register' ? 'CREATE PASSWORD' : 'LOGIN')}
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
            disabled={loading}
          >
            Login as student
          </button>
        ) : (
          <button 
            type="button"
            className="switch-portal-btn"
            onClick={() => handleViewChange('teacher-login')}
            disabled={loading}
          >
            Login as teacher
          </button>
        )}
      </div>
    </div>
  );
}