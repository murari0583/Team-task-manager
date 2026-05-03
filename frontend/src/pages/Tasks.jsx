import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

const columns = ['Todo', 'In Progress', 'Done'];

const colColors = {
  'Todo': { bg: '#f1f5f9', header: '#64748b', dot: '#94a3b8' },
  'In Progress': { bg: '#eff6ff', header: '#2563eb', dot: '#3b82f6' },
  'Done': { bg: '#f0fdf4', header: '#16a34a', dot: '#22c55e' },
};

const Tasks = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchTasks(); }, [user]);

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/tasks`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTasks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.put(`${API_BASE}/tasks/${taskId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
      <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: '#16a085', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Task Board</h1>
        <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>{tasks.length} total task{tasks.length !== 1 ? 's' : ''}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {columns.map(status => {
          const col = colColors[status];
          const columnTasks = tasks.filter(t => t.status === status);
          return (
            <div key={status} style={{ backgroundColor: col.bg, borderRadius: '14px', padding: '16px', border: '1px solid #e2e8f0', minHeight: '400px' }}>
              {/* Column Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: col.dot }} />
                  <span style={{ fontWeight: '700', color: col.header, fontSize: '14px' }}>{status}</span>
                </div>
                <span style={{ backgroundColor: '#fff', color: col.header, fontSize: '12px', fontWeight: '700', padding: '2px 10px', borderRadius: '20px', border: `1px solid ${col.dot}30` }}>
                  {columnTasks.length}
                </span>
              </div>

              {/* Task Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {columnTasks.map(task => (
                  <div key={task._id} style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '14px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', margin: '0 0 6px' }}>{task.title}</h3>
                    {task.description && (
                      <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 10px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {task.description}
                      </p>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '8px', marginTop: '4px' }}>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                        📁 {task.project?.name || 'N/A'}
                      </span>
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                        style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#374151', cursor: 'pointer', outline: 'none' }}
                      >
                        {columns.map(col => (
                          <option key={col} value={col}>{col}</option>
                        ))}
                      </select>
                    </div>
                    {task.dueDate && (
                      <div style={{ fontSize: '11px', color: new Date(task.dueDate) < new Date() ? '#ef4444' : '#94a3b8', marginTop: '6px', fontWeight: '500' }}>
                        📅 Due: {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
                {columnTasks.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '30px 10px', border: '2px dashed #e2e8f0', borderRadius: '10px', color: '#94a3b8', fontSize: '13px' }}>
                    No tasks here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tasks;
