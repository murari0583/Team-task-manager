import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const [{ data: tasksData }, { data: projectsData }] = await Promise.all([
          axios.get('http://localhost:5000/api/tasks', config),
          axios.get('http://localhost:5000/api/projects', config),
        ]);
        
        setTasks(tasksData);
        setProjects(projectsData);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  const myTasks = tasks.filter(t => t.assignedTo && t.assignedTo._id === user._id);
  const pendingTasks = myTasks.filter(t => t.status !== 'Done');
  const overdueTasks = pendingTasks.filter(t => new Date(t.dueDate) < new Date());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Welcome back, {user.name.split(' ')[0]}!</h1>
        <p className="mt-2 text-sm text-slate-600">Here's what's happening with your projects today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow-sm border border-slate-200 rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 truncate">Total Projects</dt>
                  <dd className="text-2xl font-bold text-slate-900">{projects.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow-sm border border-slate-200 rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 truncate">My Pending Tasks</dt>
                  <dd className="text-2xl font-bold text-slate-900">{pendingTasks.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm border border-slate-200 rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 truncate">Overdue Tasks</dt>
                  <dd className="text-2xl font-bold text-slate-900">{overdueTasks.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Projects */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-900">Recent Projects</h2>
            <Link to="/projects" className="text-sm font-medium text-primary hover:text-indigo-500">View all</Link>
          </div>
          <div className="space-y-4">
            {projects.slice(0, 3).map(project => (
              <div key={project._id} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                <h3 className="text-md font-semibold text-slate-800">{project.name}</h3>
                <p className="text-sm text-slate-500 truncate">{project.description}</p>
              </div>
            ))}
            {projects.length === 0 && <p className="text-sm text-slate-500">No projects found.</p>}
          </div>
        </div>

        {/* My Tasks */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-900">My Priority Tasks</h2>
            <Link to="/tasks" className="text-sm font-medium text-primary hover:text-indigo-500">View all</Link>
          </div>
          <div className="space-y-4">
            {pendingTasks.slice(0, 5).map(task => (
              <div key={task._id} className="flex justify-between items-center border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">{task.title}</h3>
                  <p className="text-xs text-slate-500">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  task.status === 'Todo' ? 'bg-slate-100 text-slate-600' : 
                  task.status === 'In Progress' ? 'bg-blue-100 text-blue-600' : 
                  'bg-green-100 text-green-600'
                }`}>
                  {task.status}
                </span>
              </div>
            ))}
            {pendingTasks.length === 0 && <p className="text-sm text-slate-500">No pending tasks. Great job!</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
