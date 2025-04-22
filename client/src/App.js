import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Jobs from './pages/Jobs';
import PostJob from './pages/PostJob';
import Messaging from './pages/Messaging';
import Blog from './pages/Blog';
import Alerts from './pages/Alerts';
import RecruiterDashboard from './pages/RecruiterDashboard';
import CandidateDashboard from './pages/CandidateDashboard';
import RecruiterHome from './pages/RecruiterHome';
import CandidateHome from './pages/CandidateHome';
import JobDetails from './pages/JobDetails';
import { AuthContext } from './context/AuthContext';

function App() {
  const { user, loading } = useContext(AuthContext);

  const RequireAuth = ({ children }) => {
    if (loading) {
      return <div>Loading...</div>;
    }
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  const RoleBasedDashboard = () => {
    if (loading) {
      return <div>Loading...</div>;
    }
    if (!user) return <Navigate to="/login" replace />;
    console.log('RoleBasedDashboard user:', user);
    const role = user.role ? user.role.trim().toLowerCase() : '';
    console.log('RoleBasedDashboard role:', role);
    if (role === 'מגייס') {
      return <RecruiterDashboard />;
    } else if (role === 'מועמד') {
      return <CandidateDashboard />;
    } else {
      console.warn('RoleBasedDashboard unknown role:', role);
      return <Navigate to="/" replace />;
    }
  };

  const RoleBasedHome = () => {
    if (loading) {
      return <div>Loading...</div>;
    }
    if (!user) return <Home />;
    const role = user.role ? user.role.trim().toLowerCase() : '';
    if (role === 'recruiter') {
      return <RecruiterHome />;
    } else if (role === 'candidate') {
      return <CandidateHome />;
    } else {
      return <Home />;
    }
  };

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<RoleBasedHome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/post-job" element={<RequireAuth><PostJob /></RequireAuth>} />
        <Route path="/messaging" element={<RequireAuth><Messaging /></RequireAuth>} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/alerts" element={<RequireAuth><Alerts /></RequireAuth>} />
        <Route path="/dashboard" element={<RequireAuth><RoleBasedDashboard /></RequireAuth>} />
        <Route path="/job-details/:id" element={<RequireAuth><JobDetails /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
