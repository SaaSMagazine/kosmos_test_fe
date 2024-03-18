import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Moment from 'moment';

const NewTaskModal = ({ showModal, handleCloseModal, handleTaskSubmit, selectedTask }) => {
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    deadline: '',
    priority: 'low',
    status: 'to do',
    creatorId: localStorage.getItem('userId'),
    assigneeId: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleTaskSubmit(newTask);
  };

  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
      <Modal.Title>{selectedTask ? 'Редактирование задачи' : 'Новая задача'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Название</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={selectedTask && selectedTask.title ? selectedTask.title : newTask.title}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Описание</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={selectedTask && selectedTask.description ? selectedTask.description : newTask.description}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Срок выполнения</Form.Label>
            <Form.Control
              type="datetime-local"
              name="deadline"
              value={selectedTask && selectedTask.deadline ? Moment(selectedTask.deadline).format('yyyy-MM-DDThh:mm:ss') : newTask.deadline}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Приоритет</Form.Label>
            <Form.Select
              name="priority"
              value={selectedTask && selectedTask.priority ? selectedTask.priority : newTask.priority}
              onChange={handleChange}
              required
            >
              <option value="high">Высокий</option>
              <option value="medium">Средний</option>
              <option value="low">Низкий</option>
            </Form.Select>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Статус</Form.Label>
            <Form.Select
              name="status"
              value={selectedTask && selectedTask.status ? selectedTask.status : newTask.status}
              onChange={handleChange}
              required
            >
              <option value="to do">К выполнению</option>
              <option value="in progress">В процессе</option>
              <option value="done">Выполнено</option>
              <option value="cancelled">Отменено</option>
            </Form.Select>
          </Form.Group>


          <Form.Group className="mb-3">
            <Form.Label>ID исполнителя</Form.Label>
            <Form.Control
              type="number"
              name="assigneeId"
              value={selectedTask && selectedTask.assigneeId ? selectedTask.assigneeId : newTask.assigneeId}
              onChange={handleChange}
              required
            />
          </Form.Group>

        </Form>
      </Modal.Body>
      <Modal.Footer>
      <Button variant="secondary" onClick={handleCloseModal}>
            Закрыть
          </Button>
          <Button variant="primary" type="submit">
            {selectedTask ? 'Сохранить' : 'Создать задачу'}
          </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewTaskModal;
