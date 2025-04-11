//src/components/Loanding.js

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Loading = () => {
  const navigate = useNavigate();

  useEffect(() => {
  const selectedCV = localStorage.getItem('selectedCV');

  // Əgər heç nə seçilməyibsə, əsas səhifəyə qaytar
  if (!selectedCV) {
    navigate('/');
    return;
  }

  // 1.5 saniyə sonra Form-a yönləndir
  const timer = setTimeout(() => {
    navigate('/form', { replace: true });
  }, 1500);

  return () => clearTimeout(timer);
}, [navigate]);

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#2f3e74'
    }}>
      CV yüklənir...
    </div>
  );
};

export default Loading;
