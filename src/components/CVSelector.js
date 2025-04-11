// src/components/CVSelector.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CVSelector = () => {
  const navigate = useNavigate();

  const handleSelect = (type) => {
    localStorage.setItem('selectedCV', type);
    navigate('/loading', { replace: true });
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f2f5fc',
      padding: '20px'
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: '#2f3e74'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '30px',
      justifyContent: 'center'
    },
    cvCard: {
      border: '1px solid #ccc',
      borderRadius: '12px',
      overflow: 'hidden',
      maxWidth: '400px',
      boxShadow: '0 0 15px rgba(0,0,0,0.1)',
      cursor: 'pointer',
      transition: 'transform 0.3s',
    },
    image: {
      width: '100%',
      display: 'block',
    },
    label: {
      backgroundColor: '#2f3e74',
      color: 'white',
      padding: '12px',
      textAlign: 'center',
      fontSize: '18px',
      fontWeight: 'bold'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>CV Dizayn Seçimi</div>
      <div style={styles.grid}>
        <div style={styles.cvCard} onClick={() => handleSelect('asg')}>
          <div style={styles.label}>ASG CV</div>
          <img
            src="/images/asg-cv-sample.png"
            alt="ASG CV Preview"
            style={styles.image}
          />
        </div>

        <div style={styles.cvCard} onClick={() => handleSelect('unikal')}>
          <div style={styles.label}>Unikal CV</div>
          <img
            src="/images/unikal.png"
            alt="Unikal CV Preview"
            style={styles.image}
          />
        </div>
      </div>
    </div>
  );
};

export default CVSelector;
