// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CVForm from './components/CVForm';
import AdminPanel from './components/AdminPanel';
import CVSelector from './components/CVSelector';
import Loading from './components/Loading';
import CVUnikal from './components/CVUnikal';
import CVASG from './components/CVASG';
import PaymentTest from './components/PaymentTest';
import FetchTest from './components/FetchTest';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CVSelector/>} />
        <Route path="/form" element={<CVForm/>} />
        <Route path="/asg" element={<CVASG/>} />
        <Route path="/admin" element={<AdminPanel/>} />
        <Route path="/loading" element={<Loading/>} />
        <Route path="/preview-unikal" element={<CVUnikal/>} />
        <Route path="/payment-test" element={<PaymentTest />} />
        <Route path="/fetch-test" element={<FetchTest />} />
      </Routes>
    </Router>
  );
}

export default App;