import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

const Projects = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [creating, setCreating] = useState(false);
  const isAdmin = String(user?.role || '').toLowerCase() === 'admin';

  useEffect(() => { fetchProjects(); }, [user]);

  const fetchProjects = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/projects`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setProjects(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await axios.post(`${API_BASE}/projects`, newProject, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setShowModal(false);
      setNewProject({ name: '', description: '' });
      fetchProjects();
    } catch (error) {
      console.error(error);
    } finally {
      setCreating(false);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
      <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: '#16a085', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Projects</h1>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>{projects.length} total project{projects.length !== 1 ? 's' : ''}</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            style={{ backgroundColor: '#16a085', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            + New Project
          </button>
        )}
      </div>

      {/* Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {projects.map(project => (
          <div key={project._id} style={{ backgroundColor: '#fff', borderRadius: '14px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'box-shadow 0.2s' }}
            onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'}
            onMouseOut={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.08)'}
          >
            {/* Color bar */}
            <div style={{ height: '5px', backgroundColor: '#16a085' }} />
            <div style={{ padding: '20px', flex: 1 }}>
              <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a', margin: '0 0 8px' }}>{project.name}</h3>
              <p style={{ color: '#64748b', fontSize: '13px', margin: 0, lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {project.description || 'No description provided.'}
              </p>
            </div>
            <div style={{ padding: '12px 20px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fafafa' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>👤 {project.createdBy?.name || 'Unknown'}</span>
              <Link to={`/projects/${project._id}`} style={{ fontSize: '13px', fontWeight: '600', color: '#16a085', textDecoration: 'none' }}>
                View Details →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#fff', borderRadius: '14px', border: '2px dashed #e2e8f0' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>📂</div>
          <h3 style={{ color: '#1e293b', fontWeight: '700', fontSize: '16px' }}>No projects yet</h3>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>Get started by creating a new project.</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 999 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '440px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '0 0 20px' }}>Create New Project</h2>
            <form onSubmit={handleCreateProject}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Project Name</label>
                <input
                  type="text" required
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  value={newProject.name}
                  onChange={e => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="e.g. Website Redesign"
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Description</label>
                <textarea
                  rows="3"
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                  value={newProject.description}
                  onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Brief project description..."
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '10px 18px', borderRadius: '8px', border: '1px solid #d1d5db', backgroundColor: '#fff', color: '#374151', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" disabled={creating} style={{ padding: '10px 18px', borderRadius: '8px', border: 'none', backgroundColor: '#16a085', color: '#fff', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
                  {creating ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
