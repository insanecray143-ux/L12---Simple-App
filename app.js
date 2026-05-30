const express = require('express');
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// In-memory array, as required for the lesson
let tasks = [
  {
    id: 1,
    title: 'Revise Software Application Development',
    subject: 'C237',
    dueDate: '2026-06-01',
    priority: 'High',
    status: 'Pending',
    description: 'Review Express routes, EJS pages and form handling.'
  },
  {
    id: 2,
    title: 'Complete worksheet questions',
    subject: 'School Work',
    dueDate: '2026-06-03',
    priority: 'Medium',
    status: 'Completed',
    description: 'Check answers before submitting.'
  }
];
let nextId = 3;

app.get('/', (req, res) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'Completed').length;
  const pendingTasks = tasks.filter(task => task.status === 'Pending').length;

  res.render('index', { totalTasks, completedTasks, pendingTasks });
});

app.get('/tasks', (req, res) => {
  const filter = req.query.filter || 'All';
  let filteredTasks = tasks;

  if (filter !== 'All') {
    filteredTasks = tasks.filter(task => task.priority === filter || task.status === filter);
  }

  res.render('tasks', { tasks: filteredTasks, filter });
});

app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/add', (req, res) => {
  const { title, subject, dueDate, priority, description } = req.body;

  const newTask = {
    id: nextId++,
    title,
    subject,
    dueDate,
    priority,
    status: 'Pending',
    description
  };

  tasks.push(newTask);
  res.render('confirmation', { message: 'Task added successfully!', task: newTask });
});

app.get('/edit/:id', (req, res) => {
  const taskId = Number(req.params.id);
  const task = tasks.find(item => item.id === taskId);

  if (!task) {
    return res.status(404).send('Task not found');
  }

  res.render('edit', { task });
});

app.post('/edit/:id', (req, res) => {
  const taskId = Number(req.params.id);
  const task = tasks.find(item => item.id === taskId);

  if (!task) {
    return res.status(404).send('Task not found');
  }

  task.title = req.body.title;
  task.subject = req.body.subject;
  task.dueDate = req.body.dueDate;
  task.priority = req.body.priority;
  task.status = req.body.status;
  task.description = req.body.description;

  res.render('confirmation', { message: 'Task updated successfully!', task });
});

app.post('/complete/:id', (req, res) => {
  const taskId = Number(req.params.id);
  const task = tasks.find(item => item.id === taskId);

  if (task) {
    task.status = task.status === 'Completed' ? 'Pending' : 'Completed';
  }

  res.redirect('/tasks');
});

app.post('/delete/:id', (req, res) => {
  const taskId = Number(req.params.id);
  tasks = tasks.filter(item => item.id !== taskId);
  res.redirect('/tasks');
});

app.listen(PORT, () => {
  console.log(`Study Buddy Task Tracker running at http://localhost:${PORT}`);
});
