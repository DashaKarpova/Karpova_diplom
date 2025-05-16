import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import CreateContractPage from './pages/CreateContractPage';
/*import ContractsPage from './pages/ContractsPage';*/
import MainPage from './pages/MainPage'; 
import ContractDetailsPage from './pages/ContractDetailsPage'; 
import ServicesPage from './pages/Services';




function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('userId'));

  return (
    <Router>
      <Routes>
        {/* Главный вход: если залогинен — переход на /main */}
        <Route path="/" element={
          isLoggedIn ? <Navigate to="/main" /> : <LoginPage onLogin={() => setIsLoggedIn(true)} />
        } />

        {/* Страницы */}
        <Route path="/main" element={<MainPage />} />            
        <Route path="/create" element={<CreateContractPage />} />
        <Route path="/contract/:id" element={<ContractDetailsPage />} />
        <Route path="/contract/:id/service" element={<ServicesPage />} />

      </Routes>
    </Router>
  );
}

export default App;
