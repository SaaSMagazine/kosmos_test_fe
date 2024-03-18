import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, ListGroup, Tabs, Tab } from 'react-bootstrap';
import moment from 'moment';

import NewTaskModal from '../components/TaskModal'; 

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [key, setKey] = useState('noGroup');
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:8080/api/v1/tasks', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          
          setTasks(data.tasks);
        } else {
          throw new Error('Failed to fetch tasks');
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);

      }
    };

    fetchTasks();
  }, [navigate]);

  // Группировка задач по дате завершения
  const groupTasksByDeadline = (tasks) => {
    const today = moment().startOf('day');
    const endOfWeek = moment().endOf('week');

    const todayTasks = tasks.filter(task =>
      moment(task.deadline).isSame(today, 'day')
    );
    const weekTasks = tasks.filter(task =>
      moment(task.deadline).isAfter(today) && moment(task.deadline).isBefore(endOfWeek)
    );
    const futureTasks = tasks.filter(task =>
      moment(task.deadline).isAfter(endOfWeek)
    );

    return { todayTasks, weekTasks, futureTasks };
  };

  // Группировка задач по ответственным
  const groupTasksByAssignee = (tasks) => {
    return tasks.reduce((acc, task) => {
      acc[task.assigneeId] = acc[task.assigneeId] || [];
      acc[task.assigneeId].push(task);
      return acc;
    }, {});
  };

  // Сортировка задач по дате последнего обновления
  const sortTasksByUpdate = (tasks) => {
    return tasks.slice().sort((a, b) => moment(b.updatedAt).diff(moment(a.updatedAt)));
  };


  const renderTasks = (key) => {
    switch (key) {
      case 'today':
      case 'week':
      case 'future':
        const { todayTasks, weekTasks, futureTasks } = groupTasksByDeadline(tasks);
        if (key === 'today') return renderTaskList(todayTasks);
        if (key === 'week') return renderTaskList(weekTasks);
        if (key === 'future') return renderTaskList(futureTasks);
        break;
      case 'assignee':
        const groupedByAssignee = groupTasksByAssignee(tasks);
        return Object.keys(groupedByAssignee).map(assigneeId => (
          <div key={assigneeId}>
            <h3>Ответственный: {assigneeId}</h3>
            {renderTaskList(groupedByAssignee[assigneeId])}
          </div>
        ));
      case 'noGroup':
        const sortedTasks = sortTasksByUpdate(tasks);
        return renderTaskList(sortedTasks);
      default:
        return null;
    }
  };


    const renderTaskList = (tasks) => (
      <ListGroup className="mt-3">
        {tasks && tasks.map && tasks.map((task) => (
          <ListGroup.Item
            key={task.id}
            variant={task.status === 'done' ? 'success' : moment(task.deadline) < Date.now() ? 'danger' : 'secondary'}
            onClick={() => handleTaskClick(task)}
            action
          >
            {task.title} - {task.priority} - {moment(task.deadline).format('DD.MM.YYYY HH:mm') } - {task.assignee['firstName']} - {task.status}
          </ListGroup.Item>
        ))}
      </ListGroup>
    );
  

  const handleTaskClick = (task) => {
    setCurrentTask(task);
    setShowModal(true);
  };

  const handleNewTaskClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleTaskSubmit = async (taskData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/v1/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(taskData)
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log(data.message); // "Task created successfully"
        handleCloseModal();
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Ошибка при создании задачи:', error);
    }
  };

  const handleTaskUpdate = async (taskData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/v1/tasks' + taskData.id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(taskData)
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log(data.message); 
        handleCloseModal();
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Ошибка при обновлении задачи:', error);
    }
  };
  

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="container mt-4">
      <Button variant="primary" onClick={handleNewTaskClick}>
        Новая задача
      </Button>
      <Button variant="secondary" onClick={handleLogout} className="float-end">
        Выйти
      </Button>

      <div className="container mt-4">

        <Tabs activeKey={key} onSelect={(k) => setKey(k)}>
          <Tab eventKey="noGroup" title="Без группировок">
            {renderTasks('noGroup')}
          </Tab>
          <Tab eventKey="today" title="На сегодня">
            {renderTasks('today')}
          </Tab>
          <Tab eventKey="week" title="На неделю">
            {renderTasks('week')}
          </Tab>
          <Tab eventKey="future" title="На будущее">
            {renderTasks('future')}
          </Tab>
          <Tab eventKey="assignee" title="По ответственным">
            {renderTasks('assignee')}
          </Tab>
        </Tabs>

      </div>


      <NewTaskModal
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        handleTaskSubmit={handleTaskSubmit}
        handleTaskUpdate={handleTaskUpdate}
        selectedTask={currentTask}
      />

    </div>
  );
};

export default TaskPage;
