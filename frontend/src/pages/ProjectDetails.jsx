import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', assignedTo: '', dueDate: '' });

  useEffect(() => {
    fetchProjectData();
    if (user.role === 'Admin') fetchUsers();
  }, [id, user]);

  const fetchProjectData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const [{ data: projectData }, { data: tasksData }] = await Promise.all([
        axios.get(`http://localhost:5000/api/projects/${id}`, config),
        axios.get(`http://localhost:5000/api/tasks?project=${id}`, config)
      ]);
      setProject(projectData);
      setTasks(tasksData);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/auth/users', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/tasks', { ...newTask, project: id }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setShowTaskModal(false);
      setNewTask({ title: '', description: '', assignedTo: '', dueDate: '' });
      fetchProjectData();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="flex justify-center mt-10"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div></div>;
  if (!project) return <div className="text-center mt-10">Project not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <Link to="/projects" className="text-sm text-primary hover:underline mb-2 inline-block">&larr; Back to Projects</Link>
          <h1 className="text-3xl font-bold text-slate-900">{project.name}</h1>
          <p className="mt-2 text-slate-600">{project.description}</p>
        </div>
        {user.role === 'Admin' && (
          <button 
            onClick={() => setShowTaskModal(true)}
            className="bg-primary hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            + Add Task
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mb-8 p-6">
         <h2 className="text-lg font-semibold text-slate-900 mb-4">Project Members</h2>
         <div className="flex gap-2 flex-wrap">
           {project.members && project.members.length > 0 ? project.members.map(member => (
             <span key={member._id} className="bg-indigo-50 text-primary px-3 py-1 rounded-full text-sm font-medium">
               {member.name}
             </span>
           )) : <span className="text-sm text-slate-500">No members assigned.</span>}
         </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mb-4">Tasks</h2>
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <ul className="divide-y divide-slate-200">
          {tasks.map(task => (
            <li key={task._id} className="p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">{task.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">{task.description}</p>
                  <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                    <span>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</span>
                    <span>Assigned to: {task.assignedTo ? task.assignedTo.name : 'Unassigned'}</span>
                  </div>
                </div>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  task.status === 'Todo' ? 'bg-slate-100 text-slate-800' : 
                  task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                  'bg-green-100 text-green-800'
                }`}>
                  {task.status}
                </span>
              </div>
            </li>
          ))}
          {tasks.length === 0 && (
            <li className="p-4 text-center text-sm text-slate-500">No tasks in this project yet.</li>
          )}
        </ul>
      </div>

      {/* Create Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Add Task to Project</h2>
            <form onSubmit={handleCreateTask}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Task Title</label>
                  <input 
                    type="text" required 
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 focus:border-primary focus:ring-primary sm:text-sm"
                    value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Description</label>
                  <textarea 
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 focus:border-primary focus:ring-primary sm:text-sm" rows="2"
                    value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})}
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Assign To</label>
                  <select 
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 focus:border-primary focus:ring-primary sm:text-sm bg-white"
                    value={newTask.assignedTo} onChange={e => setNewTask({...newTask, assignedTo: e.target.value})}
                  >
                    <option value="">Unassigned</option>
                    {users.map(u => (
                      <option key={u._id} value={u._id}>{u.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Due Date</label>
                  <input 
                    type="date"
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 focus:border-primary focus:ring-primary sm:text-sm"
                    value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button type="button" onClick={() => setShowTaskModal(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-indigo-700">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
