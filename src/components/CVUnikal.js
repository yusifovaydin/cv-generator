// src/components/CVUnikal.js
import React, { useEffect, useState } from 'react';
import html2pdf from 'html2pdf.js';
import { supabase } from './supabaseClient';


const CVUnikal = () => {
  const [data, setData] = useState({});
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
  const uid = new URLSearchParams(window.location.search).get('uid');
  const savedData = localStorage.getItem('cvData');

      if (savedData) {
        setData(JSON.parse(savedData));
      }

      if (uid) {
        setUserId(uid);

        const checkPayment = async () => {
          const { data: req, error } = await supabase
            .from('cv_requests')
            .select('payment_confirmed')
            .eq('user_id', uid)
            .single();

          if (error) {
            console.error('Ödəniş statusu alınmadı:', error.message);
          } else if (req?.payment_confirmed) {
            setPaymentConfirmed(true);
          }
        };

        checkPayment();
      }
    }, []); // ← BU hissə çatışmır səndə!

  const downloadPDF = () => {
    const element = document.getElementById('unikal-cv-wrapper');
    html2pdf()
      .set({
        margin: 0.2,
        filename: 'cv-unikal.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          ignoreElements: (el) => el.id === 'pdf-download-btn',
        },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      })
      .from(element)
      .save();
  };

  const renderLine = (label, value) => (
    <div style={styles.row}>
      <div style={styles.label}>{label}</div>
      <div style={styles.value}>{value || ''}</div>
    </div>
  );

  return (
    <div style={{ position: 'relative' }}>
      <div
        id="unikal-cv-wrapper"
        style={{ ...styles.wrapper, ...(paymentConfirmed ? {} : styles.blurred) }}
      >
        <h2 style={styles.title}>İş üçün müraciət anketi (CV)</h2>

        <div style={styles.photoBox}>
          {data.photo && <img src={data.photo} alt="cv photo" style={styles.photo} />}
        </div>

        {renderLine('Soyadı', data.fullname?.split(' ')[1])}
        {renderLine('Adı', data.fullname?.split(' ')[0])}
        {renderLine('Atasının adı', data.fathername)}
        {renderLine('Təvəllüdü', data.birth)}
        {renderLine('Anadan olduğu yer', '')}
        {renderLine('Ailə vəziyyəti', data.marital)}
        {renderLine('Qeydiyyatda olduğu ünvanı', '')}
        {renderLine('Hal-hazırda yaşadığınız ünvan', data.address)}

        <h3 style={styles.section}>Telefon nömrəsi</h3>
        {renderLine('Ev', '')}
        {renderLine('Mobil', data.phone)}
        {renderLine('E-poçt', data.email)}

        <h3 style={styles.section}>Təhsil</h3>
        {data.educationList?.map((edu, i) => (
          <div key={i}>
            {renderLine('Təhsil müəssisəsi', edu.university)}
            {renderLine('Daxil olduğu il', edu.gradyears?.split('-')[0])}
            {renderLine('Bitirdiyi il', edu.gradyears?.split('-')[1])}
            {renderLine('Fakültə (ixtisas)', edu.faculty)}
          </div>
        ))}

        <h3 style={styles.section}>Xarici dillər</h3>
        {data.languageList?.map((lang, i) => (
          renderLine(lang.name, lang.level)
        ))}

        <h3 style={styles.section}>Kompüter bilikləri</h3>
        {renderLine('', data.itskills)}
      </div>

      {paymentConfirmed ? (
        <div id="pdf-download-btn" style={styles.downloadBtnWrap}>
          <button onClick={downloadPDF} style={styles.downloadBtn}>PDF kimi yüklə</button>
        </div>
      ) : (
        <div style={styles.overlay} id="pdf-download-btn">
          <div style={styles.paymentBox}>
            <h2>Ödəniş olunduqdan sonra PDF yükləyə bilərsiniz</h2>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>3 AZN</p>
            <p style={{ fontSize: '18px' }}>4098 5844 6468 5989</p>
            <a
              href="https://wa.me/994515972371"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.whatsappBtn}
            >
              Whatsapp vasitəsilə ödəniş qəbzini göndərin
            </a>
            <p style={{ marginTop: '10px' }}>Əlaqə: 0515972371</p>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  wrapper: {
    backgroundColor: '#fff',
    padding: '30px',
    fontFamily: 'Arial',
    fontSize: '14px',
    maxWidth: '850px',
    margin: '30px auto',
    border: '1px solid #ccc',
    borderRadius: '12px',
  },
  title: {
    textAlign: 'center',
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '20px'
  },
  section: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginTop: '25px',
    marginBottom: '10px'
  },
  row: {
    display: 'flex',
    borderBottom: '1px solid #eee',
    padding: '6px 0'
  },
  label: {
    width: '40%',
    fontWeight: 'bold'
  },
  value: {
    width: '60%'
  },
  photoBox: {
    position: 'absolute',
    top: '20px',
    right: '30px',
    border: '1px solid #000',
    width: '100px',
    height: '130px',
    overflow: 'hidden'
  },
  photo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  blurred: {
    filter: 'blur(2px)',
    pointerEvents: 'none',
    opacity: 0.9
  },
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    padding: '30px',
    textAlign: 'center'
  },
  paymentBox: {
    backgroundColor: '#fff',
    color: '#222',
    padding: '30px',
    borderRadius: '12px',
    maxWidth: '500px'
  },
  whatsappBtn: {
    display: 'inline-block',
    padding: '10px 16px',
    backgroundColor: '#28a745',
    color: '#fff',
    borderRadius: '8px',
    textDecoration: 'none',
    marginTop: '20px',
    fontWeight: 'bold'
  },
  downloadBtnWrap: {
    textAlign: 'center',
    marginTop: '30px'
  },
  downloadBtn: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer'
  }
};

export default CVUnikal;
