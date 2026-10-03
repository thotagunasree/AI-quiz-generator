import React, { useState } from 'react';
import { Brain, Sparkles, Eye, EyeOff, LogIn, Mail, User, Lock } from 'lucide-react';

export default function SignIn({ onSignIn }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Please enter your username.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    setIsLoading(true);

    // Simulate sign-in (client-only, no backend)
    setTimeout(() => {
      setIsLoading(false);
      if (rememberMe) {
        localStorage.setItem('aiq_user', JSON.stringify({ username: username.trim(), email: email.trim() }));
      }
      onSignIn({ username: username.trim(), email: email.trim() });
    }, 900);
  };

  return (
    <div className="signin-page">
      {/* Animated Background Blobs */}
      <div className="signin-blob signin-blob-1" />
      <div className="signin-blob signin-blob-2" />
      <div className="signin-blob signin-blob-3" />

      <div className="signin-container">
        {/* Left Branding Panel */}
        <div className="signin-brand-panel">
          <div className="signin-brand-logo">
            <div className="signin-logo-icon">
              <Brain size={40} />
            </div>
          </div>
          <h1 className="signin-brand-title">AI Quiz Generator</h1>
          <p className="signin-brand-tagline">Create smarter quizzes in seconds</p>

          <div className="signin-features">
            {[
              { icon: '🎯', text: 'AI-powered question generation' },
              { icon: '⚡', text: 'Instant quiz creation from any topic' },
              { icon: '📊', text: 'Track your progress & scores' },
              { icon: '🃏', text: 'Interactive flashcard study mode' },
            ].map((f, i) => (
              <div key={i} className="signin-feature-item">
                <span className="signin-feature-icon">{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>

          <div className="signin-brand-badge">
            <Sparkles size={14} />
            <span>Powered by Gemini AI</span>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="signin-form-panel">
          <div className="signin-form-card">
            {/* Mobile Logo (hidden on desktop) */}
            <div className="signin-mobile-logo">
              <div className="signin-logo-icon signin-logo-icon-sm">
                <Brain size={22} />
              </div>
              <span className="signin-mobile-appname">AI Quiz Generator</span>
            </div>

            <div className="signin-form-header">
              <h2>Welcome Back</h2>
              <p>Sign in to continue your learning journey</p>
            </div>

            <form onSubmit={handleSubmit} className="signin-form">
              {/* Username */}
              <div className="signin-field">
                <label htmlFor="signin-username">Username</label>
                <div className="signin-input-wrap">
                  <User size={16} className="signin-input-icon" />
                  <input
                    id="signin-username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="signin-field">
                <label htmlFor="signin-email">Email</label>
                <div className="signin-input-wrap">
                  <Mail size={16} className="signin-input-icon" />
                  <input
                    id="signin-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="signin-field">
                <label htmlFor="signin-password">Password</label>
                <div className="signin-input-wrap">
                  <Lock size={16} className="signin-input-icon" />
                  <input
                    id="signin-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="signin-eye-btn"
                    onClick={() => setShowPassword(v => !v)}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Remember + Forgot */}
              <div className="signin-meta-row">
                <label className="signin-remember">
                  <input
                    type="checkbox"
                    id="signin-remember"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <button type="button" className="signin-forgot">
                  Forgot password?
                </button>
              </div>

              {/* Error */}
              {error && (
                <div className="signin-error" role="alert">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button type="submit" className="signin-btn" disabled={isLoading} id="signin-submit-btn">
                {isLoading ? (
                  <>
                    <span className="signin-spinner" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <LogIn size={17} />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            <div className="signin-divider">
              <span>or</span>
            </div>

            <p className="signin-signup-text">
              Don't have an account?{' '}
              <button
                type="button"
                className="signin-signup-link"
                onClick={() => {
                  if (username.trim() || email.trim()) {
                    handleSubmit({ preventDefault: () => {} });
                  } else {
                    setUsername('NewUser');
                    setEmail('user@example.com');
                    setPassword('demo1234');
                  }
                }}
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
