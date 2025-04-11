// src/components/AdminPanel.js
import React, { useEffect, useState } from 'react';

const AdminPanel = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const savedRequests = JSON.parse(localStorage.getItem('cvRequests')) || [];
    setRequests(savedRequests);
  }, []);

  const handleConfirm = (userId) => {
    localStorage.setItem(`paymentConfirmed_${userId}`, 'true');
    alert(`Təsdiqləndi: ${userId}`);
    setRequests(prev => prev.filter(r => r.userId !== userId));
    localStorage.setItem('cvRequests', JSON.stringify(requests.filter(r => r.userId !== userId)));
  };

  const handleReject = (userId) => {
    alert(`Rədd edildi: ${userId}`);
    setRequests(prev => prev.filter(r => r.userId !== userId));
    localStorage.setItem('cvRequests', JSON.stringify(requests.filter(r => r.userId !== userId)));
  };

  return (
    <div style={styles.container}>
      <h2>CV Təsdiq Paneli</h2>
      {requests.length === 0 ? (
        <p>Hazırda təsdiq gözləyən müraciət yoxdur.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Ad Soyad Ata adı</th>
              <th>Göndərilmə vaxtı</th>
              <th>Əməliyyat</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req, index) => (
              <tr key={req.userId}>
                <td>{index + 1}</td>
                <td>{req.fullname} {req.fathername}</td>
                <td>{req.createdAt}</td>
                <td>
                  <button onClick={() => handleConfirm(req.userId)} style={styles.confirm}>Təsdiq et</button>
                  <button onClick={() => handleReject(req.userId)} style={styles.reject}>✖</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '900px',
    margin: '50px auto',
    padding: '20px',
    fontFamily: 'Arial',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '8px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px'
  },
  confirm: {
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: '8px'
  },
  reject: {
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    padding: '6px 10px',
    borderRadius: '5px',
    cursor: 'pointer'
  }
};

export default AdminPanel;