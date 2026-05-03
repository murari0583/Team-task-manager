import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', assignedTo: '', dueDate: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchProjectData();
    if (user.role === 'Admin') fetchUsers();
  }, [id, user]);

  const fetchProjectData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const [{ data: projectData }, { data: tasksData }] = await Promise.all([
        axios.get(`${API_BASE}/projects/${id}`, config),
        axios.get(`${API_BASE}/tasks?project=${id}`, config)
      ]);
      setProject(projectData);
      setTasks(tasksData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/auth/users`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await axios.post(`${API_BASE}/tasks`, { ...newTask, project: id }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setShowTaskModal(false);
      setNewTask({ title: '', description: '', assignedTo: '', dueDate: '' });
      fetchProjectData();
    } catch (error) {
      console.error(error);
    } finally {
      setCreating(false);
    }
  };

  const statusStyle = (status) => {
    if (status === 'Done') return { backgroundColor: '#d1fae5', color: '#065f46' };
    if (status === 'In Progress') return { backgroundColor: '#dbeafe', color: '#1e40af' };
    return { backgroundColor: '#f1f5f9', color: '#475569' };
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
      <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: '#16a085', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  if (!project) return <div style={{ textAlign: 'center', marginTop: '40px', color: '#64748b' }}>Project not found</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Link to="/projects" style={{ fontSize: '14px', color: '#16a085', textDecoration: 'none', fontWeight: '600', display: 'inline-block', marginBottom: '12px' }}>
          &larr; Back to Projects
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px' }}>{project.name}</h1>
            <p style={{ color: '#64748b', fontSize: '15px', margin: 0, lineHeight: 1.5, maxWidth: '600px' }}>{project.description}</p>
          </div>
          {user.role === 'Admin' && (
            <button 
              onClick={() => setShowTaskModal(true)}
              style={{ backgroundColor: '#16a085', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
            >
              + Assign New Task
            </button>
          )}
        </div>
      </div>

      {/* Project Members */}
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 16px' }}>Project Members</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {project.members && project.members.length > 0 ? project.members.map(member => (
            <span key={member._id} style={{ backgroundColor: '#f1f5f9', color: '#334155', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', border: '1px solid #e2e8f0' }}>
              👤 {member.name}
            </span>
          )) : <span style={{ fontSize: '14px', color: '#94a3b8' }}>No members assigned.</span>}
        </div>
      </div>

      {/* Tasks List */}
      <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '0 0 16px' }}>Project Tasks ({tasks.length})</h2>
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {tasks.map((task, index) => (
            <li key={task._id} style={{ padding: '20px', borderBottom: index === tasks.length - 1 ? 'none' : '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', backgroundColor: '#fff' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: '0 0 6px' }}>{task.title}</h3>
                <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 12px', lineHeight: 1.5 }}>{task.description}</p>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500', backgroundColor: '#f8fafc', padding: '4px 8px', borderRadius: '6px', border: '1px solid #f1f5f9' }}>
                    📅 Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                  </span>
                  <span style={{ fontSize: '12px', color: '#0f172a', fontWeight: '600', backgroundColor: '#f8fafc', padding: '4px 8px', borderRadius: '6px', border: '1px solid #f1f5f9' }}>
                    👤 Assigned to: {task.assignedTo ? task.assignedTo.name : 'Unassigned'}
                  </span>
                </div>
              </div>
              <span style={{ ...statusStyle(task.status), padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                {task.status}
              </span>
            </li>
          ))}
          {tasks.length === 0 && (
            <li style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>No tasks in this project yet.</li>
          )}
        </ul>
      </div>

      {/* Admin Create Task Modal */}
      {showTaskModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 999 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '440px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <span style={{ backgroundColor: '#16a085', color: '#fff', fontSize: '10px', fontWeight: '800', padding: '3px 8px', borderRadius: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Admin</span>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Assign New Task</h2>
            </div>
            <form onSubmit={handleCreateTask}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Task Title</label>
                <input 
                  type="text" required 
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})}
                  placeholder="e.g. Design Homepage"
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Description</label>
                <textarea 
                  rows="2"
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                  value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})}
                  placeholder="Brief task details..."
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Assign To</label>
                <select 
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', backgroundColor: '#fff', cursor: 'pointer' }}
                  value={newTask.assignedTo} onChange={e => setNewTask({...newTask, assignedTo: e.target.value})}
                >
                  <option value="">Unassigned</option>
                  {users.map(u => (
                    <option key={u._id} value={u._id}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Due Date</label>
                <input 
                  type="date"
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setShowTaskModal(false)} style={{ padding: '10px 18px', borderRadius: '8px', border: '1px solid #d1d5db', backgroundColor: '#fff', color: '#374151', fontWeight: '600', fontSize: '14px', cursor: 'pointer', width: '100%' }}>Cancel</button>
                <button type="submit" disabled={creating} style={{ padding: '10px 18px', borderRadius: '8px', border: 'none', backgroundColor: '#16a085', color: '#fff', fontWeight: '600', fontSize: '14px', cursor: 'pointer', width: '100%' }}>
                  {creating ? 'Assigning...' : 'Assign Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
