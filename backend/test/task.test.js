const request = require('supertest');
const app = require('../server'); // Update path if different

describe('Task API', () => {
  it('should create a task', async () => {
    const res = await request(app).post('/api/tasks/create').send({
      userId: 1,
      title: 'Test Task',
      category: 'Work',
      deadline: '2025-07-06',
      time: '12:00',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('taskId');
  });

  it('should fetch all tasks for a user', async () => {
    const res = await request(app).get('/api/tasks/user/1');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should update an existing task', async () => {
    const createRes = await request(app).post('/api/tasks/create').send({
      userId: 1,
      title: 'Original Task',
      category: 'Work',
      deadline: '2025-07-06',
      time: '14:00',
    });

    const taskId = createRes.body.taskId;
    const updateRes = await request(app).put(`/api/tasks/update/${taskId}`).send({
      title: 'Updated Task',
      category: 'Personal',
      deadline: '2025-07-07',
      time: '15:00',
      completed: 0,
    });

    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body.message).toBe('Task updated');
  });
  it('should return only tasks matching a specific category', async () => {
    // Create tasks with different categories
    await request(app).post('/api/tasks/create').send({
      userId: 1,
      title: 'Work Task',
      category: 'Work',
      deadline: '2025-07-06',
      time: '13:00',
    });
  
    await request(app).post('/api/tasks/create').send({
      userId: 1,
      title: 'Personal Task',
      category: 'Personal',
      deadline: '2025-07-06',
      time: '14:00',
    });
  
    // Fetch all tasks
    const res = await request(app).get('/api/tasks/user/1');
    expect(res.statusCode).toBe(200);
  
    // Simulate filtering on frontend
    const workTasks = res.body.filter(t => t.category === 'Work');
    expect(workTasks.length).toBeGreaterThan(0);
    workTasks.forEach(task => {
      expect(task.category).toBe('Work');
    });
  });
  
});
