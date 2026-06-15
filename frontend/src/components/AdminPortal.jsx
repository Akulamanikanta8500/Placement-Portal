import { useState, useEffect } from 'react';
import api from '../utils/api';
import './AdminPortal.css';

const AdminPortal = () => {
  const [students, setStudents] = useState([]);
  const [jobDrives, setJobDrives] = useState([]);
  const [applications, setApplications] = useState([]);
  const [newDrive, setNewDrive] = useState({
    companyName: '',
    jobRole: '',
    minCgpa: '',
    date: ''
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('applications');

  const getResumeLink = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `http://localhost:8080${url}`;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const studentRes = await api.get('/students');
      const jobRes = await api.get('/job-drives');
      const appRes = await api.get('/applications');
      setStudents(studentRes.data);
      setJobDrives(jobRes.data);
      setApplications(appRes.data);
    } catch (err) {
      console.error('Failed to fetch data', err);
    }
    setLoading(false);
  };

  const handleDriveSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/job-drives', newDrive);
      alert('Job Drive created successfully!');
      setNewDrive({ companyName: '', jobRole: '', minCgpa: '', date: '' });
      fetchData();
    } catch (err) {
      alert('Failed to create Job Drive');
    }
  };

  const deleteDrive = async (id) => {
    if (window.confirm('Are you sure you want to delete this drive?')) {
      try {
        await api.delete(`/job-drives/${id}`);
        fetchData();
      } catch (err) {
        alert('Failed to delete drive');
      }
    }
  };

  const setApplicationStatus = async (id, status) => {
    try {
      await api.put(`/applications/${id}/status?status=${status}`);
      fetchData();
    } catch (err) {
      alert('Failed to update application status');
    }
  };

  return (
    <div className="admin-container container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="section-title mb-0">Admin Portal</h2>
        <div className="btn-group glass-panel rounded-pill p-1">
          <button 
            className={`btn rounded-pill px-4 ${activeTab === 'applications' ? 'btn-primary text-white fw-bold' : 'btn-link text-primary text-decoration-none fw-semibold'}`}
            onClick={() => setActiveTab('applications')}
          >
            Applications
          </button>
          <button 
            className={`btn rounded-pill px-4 ${activeTab === 'students' ? 'btn-primary text-white fw-bold' : 'btn-link text-primary text-decoration-none fw-semibold'}`}
            onClick={() => setActiveTab('students')}
          >
            Students
          </button>
          <button 
            className={`btn rounded-pill px-4 ${activeTab === 'drives' ? 'btn-primary text-white fw-bold' : 'btn-link text-primary text-decoration-none fw-semibold'}`}
            onClick={() => setActiveTab('drives')}
          >
            Job Drives
          </button>
        </div>
      </div>

      {activeTab === 'applications' && (
        <div className="glass-panel p-4 rounded-4">
          <h4 className="mb-4 text-primary">Student Applications</h4>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Resume</th>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Student CGPA</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app.id}>
                    <td className="fw-bold">{app.student?.name}</td>
                    <td>
                      {app.student?.resumeUrl ? (
                        <a 
                          href={getResumeLink(app.student.resumeUrl)} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="btn btn-sm btn-outline-info rounded-pill px-3"
                          style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                        >
                          📄 View Resume
                        </a>
                      ) : (
                        <span className="text-muted small italic">No resume</span>
                      )}
                    </td>
                    <td>{app.jobDrive?.companyName}</td>
                    <td>{app.jobDrive?.jobRole}</td>
                    <td>{app.student?.cgpa}</td>
                    <td>
                      <span className={`badge rounded-pill px-3 ${
                        app.status === 'ACCEPTED' ? 'bg-success' : 
                        app.status === 'REJECTED' ? 'bg-danger' : 
                        app.status === 'PENDING' ? 'bg-warning text-dark' : 'bg-secondary'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button 
                          className={`btn btn-sm rounded-pill px-3 ${
                            app.status === 'ACCEPTED' ? 'btn-success text-white' : 
                            app.status === 'PENDING' ? 'btn-success text-white' : 'btn-outline-success'
                          }`}
                          onClick={() => setApplicationStatus(app.id, 'ACCEPTED')}
                          disabled={app.status === 'ACCEPTED'}
                          title={app.status === 'ACCEPTED' ? "Application is currently Accepted" : "Accept Application"}
                        >
                          ✓ Accept
                        </button>
                        <button 
                          className={`btn btn-sm rounded-pill px-3 ${
                            app.status === 'REJECTED' ? 'btn-danger text-white' : 'btn-outline-danger'
                          }`}
                          onClick={() => setApplicationStatus(app.id, 'REJECTED')}
                          disabled={app.status === 'REJECTED'}
                          title={app.status === 'REJECTED' ? "Application is currently Rejected" : "Reject Application"}
                        >
                          ✗ Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {applications.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">No applications found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'students' && (
        <div className="glass-panel p-4 rounded-4">
          <h4 className="mb-4 text-primary">Registered Students</h4>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>CGPA</th>
                  <th>Skills</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student.id}>
                    <td className="fw-bold">{student.name}</td>
                    <td>{student.user.email}</td>
                    <td><span className="badge bg-primary">{student.cgpa}</span></td>
                    <td className="text-muted">{student.skills}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'drives' && (
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="glass-panel p-4 rounded-4">
              <h4 className="mb-4 text-primary">Create Job Drive</h4>
              <form onSubmit={handleDriveSubmit}>
                <div className="mb-3">
                  <label className="form-label text-secondary fw-semibold">Company Name</label>
                  <input 
                    type="text" 
                    className="form-control border-primary fw-semibold shadow-sm" 
                    value={newDrive.companyName}
                    onChange={e => setNewDrive({...newDrive, companyName: e.target.value})}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label text-secondary fw-semibold">Job Role</label>
                  <input 
                    type="text" 
                    className="form-control border-primary fw-semibold shadow-sm" 
                    value={newDrive.jobRole}
                    onChange={e => setNewDrive({...newDrive, jobRole: e.target.value})}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label text-secondary fw-semibold">Min CGPA</label>
                  <input 
                    type="number" 
                    step="0.1"
                    className="form-control border-primary fw-semibold shadow-sm" 
                    value={newDrive.minCgpa}
                    onChange={e => setNewDrive({...newDrive, minCgpa: e.target.value})}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label text-secondary fw-semibold">Drive Date</label>
                  <input 
                    type="date" 
                    className="form-control border-primary fw-semibold shadow-sm" 
                    value={newDrive.date}
                    onChange={e => setNewDrive({...newDrive, date: e.target.value})}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100 rounded-pill py-2">Create Drive</button>
              </form>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="glass-panel p-4 rounded-4 h-100">
              <h4 className="mb-4 text-primary">Existing Job Drives</h4>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Role</th>
                      <th>Min CGPA</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobDrives.map(drive => (
                      <tr key={drive.id}>
                        <td className="fw-bold">{drive.companyName}</td>
                        <td>{drive.jobRole}</td>
                        <td><span className="badge bg-secondary">{drive.minCgpa}+</span></td>
                        <td>{new Date(drive.date).toLocaleDateString()}</td>
                        <td>
                          <button className="btn btn-outline-danger btn-sm rounded-pill px-3" onClick={() => deleteDrive(drive.id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPortal;
