import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import './StudentPortal.css';

// Pre-defined vibrant colors for skill badges
const badgeColors = [
  'bg-primary', 'bg-success', 'bg-danger', 'bg-warning text-dark', 'bg-info text-dark', 'bg-secondary'
];

const StudentPortal = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // New states for functionality
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ skills: '', resumeUrl: '', educationDetails: '', projects: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Job application explorer states
  const [jobDrives, setJobDrives] = useState([]);
  const [activeTab, setActiveTab] = useState('applications');
  const [activeApplyJob, setActiveApplyJob] = useState(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  useEffect(() => {
    fetchStudentData();
  }, [user]);

  const fetchStudentData = async () => {
    setLoading(true);
    try {
      const profileRes = await api.get(`/students/user/${user.id}`);
      setProfile(profileRes.data);
      setEditForm({ 
        skills: profileRes.data.skills || '', 
        resumeUrl: profileRes.data.resumeUrl || '',
        educationDetails: profileRes.data.educationDetails || '',
        projects: profileRes.data.projects || ''
      });
      setResumeUrl(profileRes.data.resumeUrl || '');
      
      const appRes = await api.get(`/applications/student/${profileRes.data.id}`);
      setApplications(appRes.data);

      const jobsRes = await api.get('/job-drives');
      setJobDrives(jobsRes.data);
    } catch (err) {
      console.error('Failed to fetch student data', err);
    }
    setLoading(false);
  };

  const getResumeLink = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `http://localhost:8080${url}`;
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/students/${profile.id}`, editForm);
      setShowEditModal(false);
      fetchStudentData(); // Refresh data
    } catch (err) {
      console.error('Failed to update profile', err);
      alert('Failed to update profile.');
    }
  };

  const isApplied = (jobDriveId) => {
    return applications.some(app => app.jobDrive.id === jobDriveId);
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!profile) return;
    setIsSubmitting(true);
    try {
      if (resumeUrl && resumeUrl !== profile.resumeUrl) {
         await api.put(`/students/${profile.id}`, { ...editForm, resumeUrl });
      }

      await api.post(`/applications/apply?studentId=${profile.id}&jobDriveId=${activeApplyJob.id}`);
      
      setApplySuccess(true);
      
      // Re-fetch applications
      const appRes = await api.get(`/applications/student/${profile.id}`);
      setApplications(appRes.data);
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data || 'Failed to apply.');
    }
    setIsSubmitting(false);
  };

  // Filter and search logic
  const filteredApps = applications.filter(app => {
    const matchesSearch = app.jobDrive.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.jobDrive.jobRole.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'ALL' || app.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) return <div className="container py-5 text-center text-white">Loading Portal...</div>;

  return (
    <div className="student-container container py-5">
      <div className="row g-4">
        <div className="col-lg-4">
          {/* Profile Card */}
          <div className="glass-panel p-4 rounded-4 text-center position-relative">
            <button 
              className="btn btn-sm btn-outline-light position-absolute top-0 end-0 m-3 rounded-circle"
              onClick={() => setShowEditModal(true)}
              title="Edit Profile"
            >
              ✎
            </button>
            <div className="avatar-placeholder rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center">
              <span className="fs-1 fw-bold">{profile?.name.charAt(0)}</span>
            </div>
            <h3 className="fw-bold mb-1">{profile?.name}</h3>
            <p className="text-secondary small mb-3">{user.email}</p>
            
            {profile?.resumeUrl && (
              <a href={getResumeLink(profile.resumeUrl)} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-info w-100 mb-3 rounded-pill">
                📄 View Resume
              </a>
            )}

            <div className="d-flex justify-content-around border-top border-secondary border-opacity-25 pt-3 mt-2">
              <div>
                <p className="mb-0 fw-bold svu-text-gold fs-5">{profile?.cgpa}</p>
                <p className="mb-0 text-secondary tiny-text">CGPA</p>
              </div>
              <div className="border-start border-secondary border-opacity-25"></div>
              <div>
                <p className="mb-0 fw-bold svu-text-gold fs-5">{applications.length}</p>
                <p className="mb-0 text-secondary tiny-text">Applied</p>
              </div>
            </div>
          </div>

          {/* Skills Card */}
          <div className="glass-panel p-4 rounded-4 mt-4">
            <h5 className="mb-3 d-flex justify-content-between align-items-center">
              My Skills
              <button 
                className="btn btn-sm text-secondary p-0"
                onClick={() => setShowEditModal(true)}
              >
                + Add
              </button>
            </h5>
            <div className="d-flex flex-wrap gap-2">
              {profile?.skills ? profile.skills.split(',').map((skill, i) => {
                const colorClass = badgeColors[i % badgeColors.length];
                return (
                  <span key={i} className={`badge rounded-pill py-2 px-3 ${colorClass} bg-opacity-75`}>
                    {skill.trim()}
                  </span>
                );
              }) : <span className="text-secondary small italic">No skills listed</span>}
            </div>
          </div>

          <div className="glass-panel p-4 rounded-4 mt-4">
            <h5 className="mb-3">Education</h5>
            {profile?.educationDetails ? (
              <p className="text-secondary small" style={{ whiteSpace: 'pre-wrap' }}>{profile.educationDetails}</p>
            ) : (
              <p className="text-secondary italic small">No educational details provided.</p>
            )}
          </div>

          <div className="glass-panel p-4 rounded-4 mt-4">
            <h5 className="mb-3">Projects</h5>
            {profile?.projects ? (
              <p className="text-secondary small" style={{ whiteSpace: 'pre-wrap' }}>{profile.projects}</p>
            ) : (
              <p className="text-secondary italic small">No projects listed.</p>
            )}
          </div>
        </div>

        <div className="col-lg-8">
          <div className="glass-panel p-4 rounded-4 h-100 d-flex flex-column">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
              <div className="btn-group glass-panel rounded-pill p-1">
                <button 
                  className={`btn rounded-pill px-4 btn-sm ${activeTab === 'applications' ? 'btn-primary text-white fw-bold' : 'btn-link text-primary text-decoration-none fw-semibold'}`}
                  onClick={() => setActiveTab('applications')}
                >
                  My Applications
                </button>
                <button 
                  className={`btn rounded-pill px-4 btn-sm ${activeTab === 'drives' ? 'btn-primary text-white fw-bold' : 'btn-link text-primary text-decoration-none fw-semibold'}`}
                  onClick={() => setActiveTab('drives')}
                >
                  Available Jobs
                </button>
              </div>

              {activeTab === 'applications' && (
                <div className="d-flex gap-2">
                  <input 
                    type="text" 
                    className="form-control form-control-sm border-primary shadow-sm" 
                    placeholder="Search company..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ maxWidth: '200px', margin: 0 }}
                  />
                  <select 
                    className="form-select form-select-sm border-primary shadow-sm"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    style={{ width: 'auto', padding: '6px 36px 6px 12px', margin: 0 }}
                  >
                    <option value="ALL">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="ACCEPTED">Accepted</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
              )}
            </div>

            {activeTab === 'applications' && (
              <div className="table-responsive flex-grow-1">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Role</th>
                      <th>Date Applied</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApps.map(app => (
                      <tr key={app.id} className="student-table-row">
                        <td className="fw-bold">{app.jobDrive.companyName}</td>
                        <td>{app.jobDrive.jobRole}</td>
                        <td className="small text-secondary">{new Date(app.appliedAt).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge rounded-pill px-3 ${
                            app.status === 'ACCEPTED' ? 'bg-success' : 
                            app.status === 'REJECTED' ? 'bg-danger' : 
                            app.status === 'PENDING' ? 'bg-warning text-dark' : 'bg-secondary'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {filteredApps.length === 0 && applications.length > 0 && (
                      <tr>
                        <td colSpan="4" className="text-center py-5 text-secondary italic">
                          No applications match your search.
                        </td>
                      </tr>
                    )}
                    {applications.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center py-5">
                          <div className="d-flex flex-column align-items-center justify-content-center">
                            <div className="fs-1 mb-3">🚀</div>
                            <p className="text-secondary italic mb-2">No applications yet.</p>
                            <button 
                              className="btn btn-sm btn-outline-primary rounded-pill mt-2 w-auto"
                              onClick={() => setActiveTab('drives')}
                            >
                              Explore Available Jobs
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'drives' && (
              <div className="table-responsive flex-grow-1">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Role</th>
                      <th>Min CGPA</th>
                      <th>Drive Date</th>
                      <th>Eligibility</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobDrives.map(drive => {
                      const applied = isApplied(drive.id);
                      const eligible = profile ? profile.cgpa >= drive.minCgpa : false;
                      return (
                        <tr key={drive.id}>
                          <td className="fw-bold">{drive.companyName}</td>
                          <td>{drive.jobRole}</td>
                          <td><span className="badge bg-secondary">{drive.minCgpa}+</span></td>
                          <td className="small text-secondary">{new Date(drive.date).toLocaleDateString()}</td>
                          <td>
                            {eligible ? (
                              <span className="badge bg-success bg-opacity-20 text-success rounded-pill px-3 py-1">Eligible</span>
                            ) : (
                              <span className="badge bg-danger bg-opacity-20 text-danger rounded-pill px-3 py-1">Ineligible</span>
                            )}
                          </td>
                          <td>
                            {applied ? (
                              <span className="text-success fw-bold small">✓ Applied</span>
                            ) : eligible ? (
                              <button 
                                className="btn btn-sm btn-primary rounded-pill px-3 py-1 w-auto"
                                onClick={() => {
                                  setActiveApplyJob(drive);
                                  setApplySuccess(false);
                                }}
                              >
                                Apply
                              </button>
                            ) : (
                              <button className="btn btn-sm btn-secondary rounded-pill px-3 py-1 w-auto" disabled>
                                Locked
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {jobDrives.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center py-5 text-secondary italic">
                          No active recruitment drives at this time.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content glass-panel border-primary">
                <div className="modal-header border-secondary border-opacity-25">
                  <h5 className="modal-title text-primary">Edit Profile</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setShowEditModal(false)}></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleUpdateProfile}>
                    <div className="mb-3">
                      <label className="form-label text-secondary small">Skills (comma separated)</label>
                      <input 
                        type="text" 
                        className="form-control border-primary"
                        value={editForm.skills}
                        onChange={(e) => setEditForm({...editForm, skills: e.target.value})}
                        placeholder="e.g. Java, React, SQL"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-secondary small">Education Details</label>
                      <textarea 
                        className="form-control border-primary"
                        value={editForm.educationDetails}
                        onChange={(e) => setEditForm({...editForm, educationDetails: e.target.value})}
                        placeholder="e.g. B.Tech in CSE from SVU (2020-2024)"
                        rows="2"
                      ></textarea>
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-secondary small">Key Projects</label>
                      <textarea 
                        className="form-control border-primary"
                        value={editForm.projects}
                        onChange={(e) => setEditForm({...editForm, projects: e.target.value})}
                        placeholder="Describe your major projects..."
                        rows="3"
                      ></textarea>
                    </div>
                    <div className="mb-4">
                      <label className="form-label text-secondary small">Upload Resume (PDF/DOCX)</label>
                      <input 
                        type="file" 
                        accept=".pdf,.docx"
                        className="form-control border-primary"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          const formData = new FormData();
                          formData.append('file', file);
                          try {
                            const res = await api.post('/applications/upload-resume', formData, {
                              headers: { 'Content-Type': 'multipart/form-data' }
                            });
                            setEditForm({ ...editForm, resumeUrl: res.data.url });
                            alert('Resume uploaded successfully!');
                          } catch (err) {
                            alert('Failed to upload resume. Please try again.');
                          }
                        }}
                      />
                      {editForm.resumeUrl && (
                        <div className="small text-success mt-1">✓ Resume attached: {editForm.resumeUrl.split('/').pop()}</div>
                      )}
                    </div>
                    <div className="d-flex justify-content-end gap-2">
                      <button type="button" className="btn btn-outline-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                      <button type="submit" className="btn btn-primary px-4">Save Changes</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Apply Modal */}
      {activeApplyJob && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content glass-panel border-primary">
                <div className="modal-header border-secondary border-opacity-25">
                  <h5 className="modal-title text-primary">Apply to {activeApplyJob.companyName}</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setActiveApplyJob(null)}></button>
                </div>
                <div className="modal-body text-white">
                  {applySuccess ? (
                    <div className="text-center py-4">
                      <div className="fs-1 mb-3 text-success">✓</div>
                      <h4 className="fw-bold">Applied Successfully!</h4>
                      <p className="text-secondary small mt-2">
                        Your application for <strong>{activeApplyJob.jobRole}</strong> has been submitted.
                      </p>
                      <button 
                        className="btn btn-primary rounded-pill px-4 mt-3 w-auto" 
                        onClick={() => {
                          setActiveApplyJob(null);
                          setActiveTab('applications');
                        }}
                      >
                        View My Applications
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplySubmit}>
                      <div className="mb-3">
                        <label className="form-label text-secondary small">Company Name</label>
                        <input type="text" className="form-control bg-dark border-secondary" value={activeApplyJob.companyName} disabled style={{ padding: '8px 12px', margin: 0 }} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label text-secondary small">Job Role</label>
                        <input type="text" className="form-control bg-dark border-secondary" value={activeApplyJob.jobRole} disabled style={{ padding: '8px 12px', margin: 0 }} />
                      </div>
                      <div className="mb-4">
                        <label className="form-label text-primary small fw-semibold">Upload Resume File (PDF/DOCX) <span className="text-danger">*</span></label>
                        <input 
                          type="file" 
                          accept=".pdf,.docx"
                          className="form-control border-primary" 
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            const formData = new FormData();
                            formData.append('file', file);
                            try {
                              const res = await api.post('/applications/upload-resume', formData, {
                                headers: { 'Content-Type': 'multipart/form-data' }
                              });
                              setResumeUrl(res.data.url);
                              alert('Resume uploaded successfully!');
                            } catch (err) {
                              alert('Failed to upload resume. Please try again.');
                            }
                          }}
                          required={!resumeUrl}
                          style={{ padding: '8px 12px', margin: 0 }}
                        />
                        {resumeUrl && (
                          <div className="small text-success mt-2">✓ Attached: {resumeUrl.split('/').pop()}</div>
                        )}
                        <p className="tiny-text text-secondary mt-2">This file will be attached to this application and saved as your main resume.</p>
                      </div>
                      <div className="d-flex justify-content-end gap-2">
                        <button type="button" className="btn btn-outline-secondary" onClick={() => setActiveApplyJob(null)} disabled={isSubmitting}>Cancel</button>
                        <button type="submit" className="btn btn-primary px-4 w-auto" disabled={isSubmitting}>
                          {isSubmitting ? 'Submitting...' : 'Confirm & Apply'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentPortal;
