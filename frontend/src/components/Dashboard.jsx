import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [minCgpa, setMinCgpa] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch initial profile if student, or all students if admin
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        if (user.role === 'ADMIN') {
          const res = await api.get('/students');
          setStudents(res.data);
        } else {
          const res = await api.get(`/students/user/${user.id}`);
          setStudents([res.data]);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch data.');
      }
      setLoading(false);
    };
    fetchInitialData();
  }, [user]);

  const handleFilter = async (e) => {
    e.preventDefault();
    if (!minCgpa) return;
    
    setLoading(true);
    try {
      const res = await api.get(`/students/filter/${minCgpa}`);
      setStudents(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to filter students.');
    }
    setLoading(false);
  };

  const handleClearFilter = async () => {
    setMinCgpa('');
    setLoading(true);
    try {
      const res = await api.get('/students');
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="dashboard-container container">
      <header className="dashboard-header glass-panel">
        <div>
          <h1>Placement Portal</h1>
          <p>Welcome, <span className="highlight">{user.email}</span> ({user.role})</p>
        </div>
        <button className="logout-btn" onClick={logout}>Sign Out</button>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-content">
        {user.role === 'ADMIN' && (
          <div className="glass-panel filter-section">
            <h3 className="section-title">Eligibility Filter</h3>
            <form onSubmit={handleFilter} className="filter-form">
              <input 
                type="number" 
                step="0.01"
                min="0"
                max="10"
                placeholder="Enter Minimum CGPA" 
                value={minCgpa} 
                onChange={(e) => setMinCgpa(e.target.value)} 
              />
              <div className="filter-actions">
                <button type="submit" className="filter-btn">Apply Filter</button>
                {minCgpa && (
                  <button type="button" className="clear-filter-btn" onClick={handleClearFilter}>
                    Clear Filter
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        <div className="glass-panel table-section">
          <h3 className="section-title">
            {user.role === 'ADMIN' ? 'Student Profiles' : 'My Profile'}
          </h3>
          {loading ? (
             <div className="loading-spinner">Loading...</div>
          ) : students.length > 0 ? (
            <div className="table-wrapper">
              <table className="students-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>CGPA</th>
                    <th>Skills</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td>{student.name}</td>
                      <td>
                        <span className={`cgpa-pill ${student.cgpa >= 8 ? 'high' : student.cgpa >= 7 ? 'med' : 'low'}`}>
                          {student.cgpa}
                        </span>
                      </td>
                      <td>{student.skills || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-data">No students found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
