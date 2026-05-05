import Task from '../models/Task.js';

const normalizeAssignees = (assignedTo) => {
  if (Array.isArray(assignedTo)) {
    return [...new Set(assignedTo.filter(Boolean).map((id) => String(id)))];
  }
  if (assignedTo) {
    return [String(assignedTo)];
  }
  return [];
};

// @desc    Get all tasks (optionally filtered by project)
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res) => {
  try {
    const { project } = req.query;
    const filter = project ? { project } : {};
    
    const tasks = await Task.find(filter)
      .populate('project', 'name')
      .populate('assignedTo', 'name email');
      
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'name')
      .populate('assignedTo', 'name email');

    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private/Admin
export const createTask = async (req, res) => {
  try {
    const { title, description, project, assignedTo, status, dueDate } = req.body;
    const assignees = normalizeAssignees(assignedTo);

    const task = new Task({
      title,
      description,
      project,
      assignedTo: assignees,
      status: status || 'Todo',
      dueDate,
    });

    const createdTask = await task.save();
    res.status(201).json(createdTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
  try {
    const { title, description, assignedTo, status, dueDate } = req.body;
    const task = await Task.findById(req.params.id);

    if (task) {
      const assignedIds = normalizeAssignees(task.assignedTo);
      const isAssignedUser = assignedIds.includes(String(req.user._id));

      // Check if user is admin or the assigned user
      if (req.user.role !== 'Admin' && !isAssignedUser) {
        return res.status(401).json({ message: 'Not authorized to update this task' });
      }

      task.title = title || task.title;
      task.description = description || task.description;
      
      // Only Admin can assign/re-assign tasks
      if (req.user.role === 'Admin' && assignedTo !== undefined) {
        task.assignedTo = normalizeAssignees(assignedTo);
      }

      task.status = status || task.status;
      task.dueDate = dueDate || task.dueDate;

      const updatedTask = await task.save();
      res.json(updatedTask);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (task) {
      await task.deleteOne();
      res.json({ message: 'Task removed' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
