import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

const StatCard = ({ label, value, color, icon }) => (
  <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
    <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px', fontWeight: '500' }}>{label}</div>
    </div>
  </div>
);

const statusStyle = (status) => {
  if (status === 'Done') return { backgroundColor: '#d1fae5', color: '#065f46' };
  if (status === 'In Progress') return { backgroundColor: '#dbeafe', color: '#1e40af' };
  return { backgroundColor: '#f1f5f9', color: '#475569' };
};

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [usersCount, setUsersCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const isAdmin = user.role === 'Admin';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const reqs = [
          axios.get(`${API_BASE}/tasks`, config),
          axios.get(`${API_BASE}/projects`, config),
        ];
        
        if (isAdmin) {
          reqs.push(axios.get(`${API_BASE}/auth/users`, config));
        }

        const responses = await Promise.all(reqs);
        setTasks(responses[0].data);
        setProjects(responses[1].data);
        if (isAdmin) setUsersCount(responses[2].data.length);

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, isAdmin]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: '#16a085', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  // Member Calculations
  const myTasks = tasks.filter(t => t.assignedTo && t.assignedTo._id === user._id);
  const myPendingTasks = myTasks.filter(t => t.status !== 'Done');
  const myOverdueTasks = myPendingTasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date());
  
  // Admin Calculations
  const allPendingTasks = tasks.filter(t => t.status !== 'Done');
  const allOverdueTasks = allPendingTasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date());

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
          {isAdmin ? `Admin Dashboard` : `Welcome back, ${user.name.split(' ')[0]}! 👋`}
        </h1>
        <p style={{ color: '#64748b', marginTop: '6px', fontSize: '14px' }}>
          {isAdmin ? "Here's an overview of all system activity." : "Here's what's happening with your projects today."}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {isAdmin ? (
          <>
            <StatCard label="Total Projects" value={projects.length} color="#16a085" icon="📁" />
            <StatCard label="Total Users" value={usersCount} color="#3b82f6" icon="👥" />
            <StatCard label="Total Tasks" value={tasks.length} color="#f59e0b" icon="📋" />
            <StatCard label="Total Overdue" value={allOverdueTasks.length} color="#ef4444" icon="⚠️" />
          </>
        ) : (
          <>
            <StatCard label="Total Projects" value={projects.length} color="#16a085" icon="📁" />
            <StatCard label="My Pending Tasks" value={myPendingTasks.length} color="#f59e0b" icon="⏳" />
            <StatCard label="Overdue Tasks" value={myOverdueTasks.length} color="#ef4444" icon="⚠️" />
            <StatCard label="Tasks Completed" value={myTasks.filter(t => t.status === 'Done').length} color="#10b981" icon="✅" />
          </>
        )}
      </div>

      {/* Two column content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Recent Projects */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Recent Projects</h2>
            <Link to="/projects" style={{ fontSize: '13px', color: '#16a085', textDecoration: 'none', fontWeight: '600' }}>View all →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {projects.slice(0, 4).map(project => (
              <div key={project._id} style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>{project.name}</div>
                <div style={{ color: '#64748b', fontSize: '12px', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{project.description || 'No description'}</div>
              </div>
            ))}
            {projects.length === 0 && <p style={{ color: '#94a3b8', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>No projects yet.</p>}
          </div>
        </div>

        {/* Pending Tasks */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: 0 }}>{isAdmin ? 'All Pending Tasks' : 'My Pending Tasks'}</h2>
            <Link to="/tasks" style={{ fontSize: '13px', color: '#16a085', textDecoration: 'none', fontWeight: '600' }}>View all →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(isAdmin ? allPendingTasks : myPendingTasks).slice(0, 5).map(task => (
              <div key={task._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: '8px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div>
                  <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '13px' }}>{task.title}</div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '2px' }}>
                    {task.dueDate && <span style={{ color: '#94a3b8', fontSize: '11px' }}>Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                    {isAdmin && task.assignedTo && <span style={{ color: '#16a085', fontSize: '11px', fontWeight: '600' }}>👤 {task.assignedTo.name}</span>}
                  </div>
                </div>
                <span style={{ ...statusStyle(task.status), padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', whiteSpace: 'nowrap' }}>
                  {task.status}
                </span>
              </div>
            ))}
            {(isAdmin ? allPendingTasks : myPendingTasks).length === 0 && <p style={{ color: '#94a3b8', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>🎉 All tasks done! Great job.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
