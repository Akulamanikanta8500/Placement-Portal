import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './JobsPortal.css';

const JobsPortal = () => {
  const { user } = useContext(AuthContext);
  const [jobDrives, setJobDrives] = useState([]);
  const [applications, setApplications] = useState([]);
  const [studentProfile, setStudentProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [activeApplyJob, setActiveApplyJob] = useState(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
    if (user && user.role === 'STUDENT') {
      fetchStudentInfo();
    }
  }, [user]);

  const fetchStudentInfo = async () => {
    try {
      const res = await api.get(`/students/user/${user.id}`);
      setStudentProfile(res.data);
      setResumeUrl(res.data.resumeUrl || ''); // Pre-fill if they already uploaded one to profile
      fetchApplications(res.data.id);
    } catch (err) {
      console.error('Failed to fetch student info', err);
    }
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/job-drives');
      setJobDrives(res.data);
    } catch (err) {
      console.error('Failed to fetch jobs', err);
    }
    setLoading(false);
  };

  const fetchApplications = async (id) => {
    try {
      const res = await api.get(`/applications/student/${id}`);
      setApplications(res.data);
    } catch (err) {
      console.error('Failed to fetch applications', err);
    }
  };

  const initiateApplication = (jobDrive) => {
    setActiveApplyJob(jobDrive);
    setApplySuccess(false);
  };

  const submitApplication = async (e) => {
    e.preventDefault();
    if (!studentProfile) return;
    setIsSubmitting(true);
    try {
      // If user inputs a new resume during the fly, update the profile as well
      if (resumeUrl && resumeUrl !== studentProfile.resumeUrl) {
         await api.put(`/students/${studentProfile.id}`, { resumeUrl });
      }

      await api.post(`/applications/apply?studentId=${studentProfile.id}&jobDriveId=${activeApplyJob.id}`);
      
      setApplySuccess(true);
      fetchApplications(studentProfile.id);
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data || 'Failed to apply. Check eligibility criteria.');
    }
    setIsSubmitting(false);
  };

  const isApplied = (jobDriveId) => {
    return applications.some(app => app.jobDrive.id === jobDriveId);
  };

  return (
    <div className="jobs-container container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="section-title mb-0">Active Recruitment Drives</h2>
        <div className="badge glass-panel shadow-sm text-white py-2 px-3 fw-bold fs-6 border border-primary border-opacity-25 rounded-pill">
          {jobDrives.length} Opportunities
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {jobDrives.map(drive => (
            <div key={drive.id} className="col-md-6 col-lg-4">
              <div className="glass-panel p-4 rounded-4 h-100 d-flex flex-column border-top border-4 border-primary">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="badge bg-success bg-opacity-10 text-success fw-bold px-3 py-2 rounded-pill">Active Drive</div>
                  <div className="badge bg-dark border border-secondary text-secondary rounded-pill py-2">{new Date(drive.date).toLocaleDateString()}</div>
                </div>
                <h4 className="fw-bold mb-1 text-white">{drive.companyName}</h4>
                <p className="text-primary fw-bold fs-5 mb-3">{drive.jobRole}</p>
                
                <div className="mb-4 glass-panel p-3 rounded-3 shadow-sm border border-primary border-opacity-25">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="text-secondary small fw-bold">Eligibility criteria:</span>
                    <span className="badge bg-primary rounded-pill px-3">{drive.minCgpa}+ CGPA</span>
                  </div>
                  <div className="progress bg-dark" style={{ height: '8px', borderRadius: '4px' }}>
                    <div className="progress-bar bg-primary" style={{ width: `${(drive.minCgpa / 10) * 100}%`, borderRadius: '4px' }}></div>
                  </div>
                </div>

                <div className="mt-auto">
                  {user?.role === 'STUDENT' ? (
                    <button 
                      className={`btn w-100 rounded-pill fw-bold shadow-sm py-3 ${isApplied(drive.id) ? 'btn-secondary text-white disabled' : 'btn-primary'}`}
                      onClick={() => initiateApplication(drive)}
                      disabled={isApplied(drive.id)}
                    >
                      {isApplied(drive.id) ? '✓ Application Submitted' : 'Apply Now ➔'}
                    </button>
                  ) : (
                    <div className="text-center text-muted small py-2 fw-semibold">Admin View Only Mode</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Application Modal */}
      {activeApplyJob && (
        <>
          <div className="modal-backdrop fade show" style={{ backdropFilter: 'blur(5px)' }}></div>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '24px', overflow: 'hidden' }}>
                
                {applySuccess ? (
                  /* Success Card Layout */
                  <div className="modal-body p-5 text-center glass-panel">
                    <div className="mx-auto bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mb-4" style={{ width: '100px', height: '100px' }}>
                      <span className="fs-1 text-success">✓</span>
                    </div>
                    <h2 className="fw-bold text-white mb-3">Application Done Successfully!</h2>
                    <p className="text-secondary mb-4 fs-5">
                      Your application for the <strong>{activeApplyJob.jobRole}</strong> position at <strong>{activeApplyJob.companyName}</strong> has been securely submitted to the administration. The admin will review your profile to accept or reject the form.
                    </p>
                    <button className="btn btn-primary btn-lg rounded-pill px-5 fw-bold" onClick={() => { setActiveApplyJob(null); navigate('/student'); }}>
                      Go to Student Dashboard ➔
                    </button>
                  </div>
                ) : (
                  /* Form Layout */
                  <>
                    <div className="modal-header bg-primary text-white border-0 px-4 py-3">
                      <div>
                        <h4 className="modal-title fw-bold mb-0 shadow-none">Apply to {activeApplyJob.companyName}</h4>
                        <span className="small text-white text-opacity-75">{activeApplyJob.jobRole}</span>
                      </div>
                      <button type="button" className="btn-close btn-close-white" onClick={() => setActiveApplyJob(null)}></button>
                    </div>
                    
                    <div className="modal-body p-4 glass-panel">
                      <div className="alert alert-info bg-transparent border border-info border-opacity-25 shadow-sm d-flex gap-3 align-items-center mb-4 rounded-4 py-3">
                         <span className="fs-3">🤖</span>
                         <p className="mb-0 small text-secondary">
                           <strong>Auto-fill active:</strong> Your basic details have been automatically fetched from the SVU system. The Administration will evaluate your profile directly via these details.
                         </p>
                      </div>

                      <form onSubmit={submitApplication}>
                        <div className="row g-3 mb-4">
                          <div className="col-md-6">
                            <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider">Full Name</label>
                            <input type="text" className="form-control bg-dark text-white fw-bold border-secondary shadow-sm" value={studentProfile?.name || ''} readOnly disabled/>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider">University Email</label>
                            <input type="email" className="form-control bg-dark text-white fw-bold border-secondary shadow-sm" value={user?.email || ''} readOnly disabled/>
                          </div>
                          <div className="col-12">
                            <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider">Database Extracted Skills</label>
                            <input type="text" className="form-control bg-dark text-white fw-bold border-secondary shadow-sm" value={studentProfile?.skills || 'No skills listed'} readOnly disabled/>
                          </div>
                        </div>

                        <div className="glass-panel p-4 rounded-4 shadow-sm border border-primary border-opacity-25 mb-4">
                          <label className="form-label fw-bold text-primary mb-2">Upload Resume File (PDF/DOCX) <span className="text-danger">*</span></label>
                          <p className="small text-secondary mb-3">Please upload your latest professional resume. This will overwrite the resume attached to your profile.</p>
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
                          />
                          {resumeUrl && (
                            <div className="small text-success mt-2">✓ Attached: {resumeUrl.split('/').pop()}</div>
                          )}
                        </div>

                        <div className="d-flex justify-content-end gap-3 mt-4">
                          <button type="button" className="btn btn-light fw-bold px-4 rounded-pill text-secondary shadow-sm" onClick={() => setActiveApplyJob(null)} disabled={isSubmitting}>Cancel</button>
                          <button type="submit" className="btn btn-primary fw-bold px-5 rounded-pill shadow" disabled={isSubmitting}>
                            {isSubmitting ? 'Securely Submitting...' : 'Submit Application ➔'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
};

export default JobsPortal;
