// src/components/AdminPanel.js
import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

const AdminPanel = () => {
  const [requests, setRequests] = useState([]);

useEffect(() => {
  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from('cv_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase fetch error:', error.message);
    } else {
      console.log("Supabase data:", data); // test üçün
      setRequests(data); // test üçün filter etmə
    }
  };

  fetchRequests();
}, []);

  const handleConfirm = async (userId) => {
    const { error } = await supabase
      .from('cv_requests')
      .update({ payment_confirmed: true })
      .eq('user_id', userId.toString());

    if (error) {
      alert('Təsdiqləmə zamanı xəta baş verdi');
      console.error(error);
    } else {
      alert(`Təsdiqləndi: ${userId}`);
      setRequests(prev => prev.filter(r => r.user_id !== userId));
    }
  };

  const handleReject = async (userId) => {
    alert(`Rədd edildi: ${userId}`);

    // Opsional: Supabase-dən silmək istəsən aşağısını aç
    // await supabase.from('cv_requests').delete().eq('user_id', userId);

    setRequests((prev) => prev.filter((r) => r.user_id !== userId));
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
              <tr key={req.user_id}>
                <td>{index + 1}</td>
                <td>{req.fullname} {req.fathername}</td>
                <td>{new Date(req.created_at).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleConfirm(req.user_id)} style={styles.confirm}>Təsdiq et</button>
                  <button onClick={() => handleReject(req.user_id)} style={styles.reject}>✖</button>
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
