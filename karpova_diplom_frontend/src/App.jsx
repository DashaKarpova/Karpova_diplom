import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import CreateContractPage from './pages/CreateContractPage';
/*import ContractsPage from './pages/ContractsPage';*/
import MainPage from './pages/MainPage'; 
import ServicesPage from './pages/Services'; 
import ContractDetailsPage from './pages/ContractDetailsPage'; 




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
        <Route path="/service" element={<ServicesPage />} />
        <Route path="/contract/:id" element={<ContractDetailsPage />} />

      </Routes>
    </Router>
  );
}

export default App;
