import React, { useState } from 'react';
import { login } from '../api/user';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';  // Импорт стилей для страницы входа

function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ login: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(form.login, form.password);

      // Сохраняем данные пользователя в localStorage
      localStorage.setItem('userId', user.id);
      localStorage.setItem('fullName', `${user.lastname} ${user.firstname} ${user.patronymic}`);

      onLogin(); // флаг авторизации
      navigate('/create'); // переход на создание договора
    } catch {
      alert('Неверный логин или пароль');
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleSubmit}>
        <h2>Вход</h2>
        <input name="login" placeholder="Логин" onChange={handleChange} />
        <input type="password" name="password" placeholder="Пароль" onChange={handleChange} />
        <button type="submit">Войти</button>
      </form>
    </div>
  );
}

export default LoginPage;
