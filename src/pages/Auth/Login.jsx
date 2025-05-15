import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { supabase } from '../../supaBase/supaBase'; // Adjust the import path as necessary
import { useDispatch } from 'react-redux';
import { setUser } from '../../features/user/userSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Move useNavigate to the top level
  const dispatch = useDispatch();

  React.useEffect(() => {
    document.body.style.backgroundColor = 'teal';
    return () => {
      document.body.style.backgroundColor = '';
      document.body.style.backgroundImage = '';
    };
  }, []);

  const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    // Dispatch user info to Redux
    dispatch(setUser(data.user));
    navigate('/'); // Use navigate here
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}; // <-- Close handleLogin function here

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ width: '400px' }}>
        <h2 className="text-center mb-3">Login</h2>
        <p className="text-center text-muted mb-4">
          Please enter your credentials to log in
        </p>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center text-muted mt-4">
          Need an account? Please contact our support team at <strong>XXX-XXX-XXX</strong>.
        </p>
      </div>
    </div>
  );
};

export default Login;
