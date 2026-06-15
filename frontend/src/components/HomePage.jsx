import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './HomePage.css';

const quickLinksData = {
  guidelines: {
    title: 'Placement Guidelines',
    content: (
      <ul className="text-secondary">
        <li><strong>Eligibility:</strong> Only students with a CGPA above 6.0 and no active backlogs are generally eligible.</li>
        <li><strong>Code of Conduct:</strong> Students must maintain professional behavior during all drives.</li>
        <li><strong>Opt-Out Policy:</strong> If you are selected by two companies, you are opted out of future drives automatically.</li>
        <li><strong>Dress Code:</strong> Formal attire is strictly required for all interviews and screening rounds.</li>
      </ul>
    )
  },
  resumes: {
    title: 'Sample Resumes',
    content: (
      <div className="text-secondary">
        <p>A strong resume is your first impression. Here are standard formats:</p>
        <ul>
          <li><a href="#" className="text-primary">Software Engineering Resume Template (PDF)</a></li>
          <li><a href="#" className="text-primary">Core Engineering Resume Template (PDF)</a></li>
          <li><a href="#" className="text-primary">Management Trainee Template (Word)</a></li>
        </ul>
        <p className="small mt-3">Note: Ensure your resume fits on a single page if you are a fresher.</p>
      </div>
    )
  },
  interviews: {
    title: 'Interview Experiences',
    content: (
      <div className="text-secondary">
        <h6 className="fw-bold text-dark">TCS Digital (2024 Batch)</h6>
        <p className="small mb-3">Focus heavily on Data Structures, specifically Trees and Dynamic Programming. The HR round was mostly behavioral.</p>
        <h6 className="fw-bold text-dark">Wipro Elite (2023 Batch)</h6>
        <p className="small">Object-Oriented Programming and DBMS concepts were the main focus. Communication skills are critical.</p>
      </div>
    )
  },
  guidance: {
    title: 'Career Guidance',
    content: (
      <div className="text-secondary">
        <p>Our Career cell is open Monday to Friday from 2 PM to 5 PM for mock interviews and resume reviews.</p>
        <p><strong>Contact:</strong> career.cell@svu.edu.in</p>
      </div>
    )
  }
};

const HomePage = () => {
  const { user } = useContext(AuthContext);
  const [modalContent, setModalContent] = useState(null);
  const navigate = useNavigate();

  const handlePortalAccess = (targetPath) => {
    if (user) {
      if (user.role === 'ADMIN' && targetPath === '/student') {
        // Force login
        localStorage.removeItem('token');
        navigate('/login');
      } else if (user.role === 'STUDENT' && targetPath === '/admin') {
         // Force login
         localStorage.removeItem('token');
         navigate('/login');
      } else {
         navigate(targetPath);
      }
    } else {
      navigate('/login');
    }
  };

  const stats = [
    { label: 'Placements 2024', value: '92%', icon: '🚀' },
    { label: 'Partner Companies', value: '150+', icon: '🏢' },
    { label: 'Highest Package', value: '45 LPA', icon: '💰' },
    { label: 'Active Job Drives', value: '12', icon: '📅' }
  ];

  return (
    <div className="home-container container py-5">
      
      <div className="welcome-section text-center mb-5 pb-4 mt-4">
        <div className="d-inline-block glass-panel p-3 rounded-circle mb-4 border-primary">
          <span className="fs-1 d-block">🎓</span>
        </div>
        <h1 className="display-4 fw-bold mb-3 svu-text-gold drop-shadow-sm">
          SV University Placement Portal
        </h1>
        <p className="lead text-primary fw-semibold mx-auto" style={{ maxWidth: '600px' }}>
          Empowering students to achieve their career goals. Start your journey into the professional world today.
        </p>

        {/* Public Access Buttons / Go to Dashboard */}
        <div className="d-flex justify-content-center gap-4 mt-5">
          {user ? (
            <button 
              onClick={() => navigate(user.role === 'ADMIN' ? '/admin' : '/student')} 
              className="btn btn-lg btn-primary text-white rounded-pill px-5 py-3 fw-bold d-flex align-items-center gap-2 shadow"
            >
              🚀 Go to {user.role === 'ADMIN' ? 'Admin' : 'Student'} Dashboard ➔
            </button>
          ) : (
            <>
              <button onClick={() => navigate('/student')} className="btn btn-lg fw-bold rounded-pill px-5 py-3 shadow border border-2 border-primary d-flex align-items-center gap-2 btn-glass">
                <span className="fs-4">👨‍🎓</span> Student Portal Access
              </button>
              <button onClick={() => navigate('/admin')} className="btn btn-lg btn-primary text-white rounded-pill px-5 py-3 fw-bold d-flex align-items-center gap-2 shadow-sm">
                <span className="fs-4">🔐</span> Admin Access
              </button>
            </>
          )}
        </div>
      </div>

      <div className="row g-4 mb-5">
        {stats.map((stat, index) => (
          <div key={index} className="col-md-3">
            <div className="glass-panel p-4 text-center h-100 transition-hover">
              <div className="fs-1 mb-2">{stat.icon}</div>
              <h2 className="fw-bold text-primary">{stat.value}</h2>
              <p className="mb-0 text-secondary fw-semibold">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="row gx-5">
        <div className="col-lg-8">
          <div className="glass-panel p-5 mb-4 border-0">
            <h3 className="section-title">Latest Announcements</h3>
            <div className="announcement-list">
              <div className="announcement-item p-3 border-bottom border-primary border-opacity-25 glass-panel rounded mb-3">
                <span className="badge bg-primary mb-2">New</span>
                <h5 className="text-white fw-bold">Wipro Recruitment Drive 2025</h5>
                <p className="text-secondary small mb-0">Wipro is visiting our campus for the session 2025. All eligible students from CSE and ECE branches are invited to apply...</p>
              </div>
              <div className="announcement-item p-3 border-bottom border-primary border-opacity-25 glass-panel rounded">
                <h5 className="text-white fw-bold">Placement Orientation Program</h5>
                <p className="text-secondary small mb-0">A mandatory orientation program for final year students will be held on Monday at the University Auditorium...</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="glass-panel p-4 mb-4 border-0">
            <h3 className="section-title">Quick Links</h3>
            <div className="list-group list-group-flush bg-transparent">
              <button 
                onClick={() => setModalContent(quickLinksData.guidelines)} 
                className="list-group-item list-group-item-action bg-transparent text-secondary fw-semibold border-primary border-opacity-25 px-0"
              >Placement Guidelines</button>
              
              <button 
                onClick={() => setModalContent(quickLinksData.resumes)} 
                className="list-group-item list-group-item-action bg-transparent text-secondary fw-semibold border-primary border-opacity-25 px-0"
              >Sample Resumes</button>
              
              <button 
                onClick={() => setModalContent(quickLinksData.interviews)} 
                className="list-group-item list-group-item-action bg-transparent text-secondary fw-semibold border-primary border-opacity-25 px-0"
              >Interview Experiences</button>
              
              <button 
                onClick={() => setModalContent(quickLinksData.guidance)} 
                className="list-group-item list-group-item-action bg-transparent text-secondary fw-semibold border-none px-0"
              >Career Guidance</button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links Info Modal */}
      {modalContent && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content glass-panel border-0 shadow-lg" style={{ borderRadius: '16px' }}>
                <div className="modal-header border-bottom border-primary border-opacity-25 rounded-top" style={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px', backgroundColor: 'rgba(15, 7, 40, 0.8)' }}>
                  <h5 className="modal-title text-primary fw-bold">{modalContent.title}</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setModalContent(null)}></button>
                </div>
                <div className="modal-body py-4 px-4 text-white">
                  {modalContent.content}
                </div>
                <div className="modal-footer border-top border-primary border-opacity-25">
                  <button type="button" className="btn btn-secondary px-4 rounded-pill fw-bold text-white bg-secondary border-0" onClick={() => setModalContent(null)}>Close</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
};

export default HomePage;
