import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Tasks = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTasks(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${taskId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="flex justify-center mt-10"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div></div>;

  const columns = ['Todo', 'In Progress', 'Done'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-screen flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">All Tasks</h1>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
        {columns.map(status => (
          <div key={status} className="bg-slate-100 rounded-lg p-4 flex flex-col h-full border border-slate-200">
            <h2 className="font-semibold text-slate-700 mb-4 flex justify-between items-center">
              {status}
              <span className="bg-slate-200 text-slate-600 py-1 px-2 rounded-full text-xs">
                {tasks.filter(t => t.status === status).length}
              </span>
            </h2>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {tasks.filter(t => t.status === status).map(task => (
                <div key={task._id} className="bg-white p-4 rounded shadow-sm border border-slate-200 flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-slate-900 text-sm">{task.title}</h3>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">{task.description}</p>
                  
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                    <div className="text-xs text-slate-500">
                      Project: <span className="font-medium">{task.project?.name}</span>
                    </div>
                    {/* Status dropdown for changing status directly */}
                    <select 
                      className="text-xs bg-slate-50 border border-slate-200 rounded p-1 focus:ring-primary focus:border-primary"
                      value={task.status}
                      onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    >
                      {columns.map(col => (
                        <option key={col} value={col}>{col}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
              {tasks.filter(t => t.status === status).length === 0 && (
                <div className="text-center py-4 text-sm text-slate-400 border-2 border-dashed border-slate-200 rounded">
                  No tasks
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
