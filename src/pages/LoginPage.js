import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Alert } from 'react-bootstrap';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    login: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
  
      if (response.ok) {
        const { message, token, id } = await response.json();

        localStorage.setItem('token', token);
        localStorage.setItem('userId', id);
        localStorage.setItem('message', message);

        navigate('/tasks');
      } else {

        const errorData = await response.json();
        setError(errorData.message);
      }
    } catch (error) {

      setError('Произошла ошибка при подключении к серверу');
    }
  
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>Вход в систему</Card.Title>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          {/* Форма входа */}
          <Form.Group className="mb-3">
            <Form.Label>Логин</Form.Label>
            <Form.Control
              type="text"
              name="login"
              value={credentials.login}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Пароль</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Войти
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default LoginPage;
