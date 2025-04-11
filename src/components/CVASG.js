// src/components/CVASG.js
import React, { useEffect, useState } from 'react';
import html2pdf from 'html2pdf.js';

const selectedCV = localStorage.getItem('selectedCV');

const CVPreview = () => {
  const [data, setData] = useState({});
  const [userId, setUserId] = useState(null);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem('userId');
    const savedData = localStorage.getItem('cvData');

    if (savedData) {
      setData(JSON.parse(savedData));
    }

    if (id) {
      setUserId(id);

      const confirmed = localStorage.getItem(`paymentConfirmed_${id}`);
      if (confirmed === 'true') {
        setPaymentConfirmed(true);
      }
    }

    const handleStorageChange = (e) => {
      if (e.key === `paymentConfirmed_${id}` && e.newValue === 'true') {
        setPaymentConfirmed(true);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [userId]); // Added userId to the dependency array

  const downloadPDF = () => {
  const element = document.getElementById('cv-pdf-only');
  html2pdf()
    .set({
      margin:[0,0.1, 0,0.1],
      filename: 'cv.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
          ignoreElements: (element) => {
          return element.id === 'pdf-download-btn';
        },
      },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      html2canvas: {
        scale: 2,
        ignoreElements: (element) => {
          return element.id === 'pdf-download-btn';
        },
      },
    })
    .from(element)
    .save();
};

  const handlePayment = () => {
  alert('Ödənişi etdikdən sonra zəhmət olmasa WhatsApp ilə qəbzi göndərin. Admin tərəfindən təsdiqləndikdən sonra PDF yükləmə aktiv olacaq.');
  };


  const renderRow = (label, value) => (
    <tr key={label}> {/* Added a key for each row */}
      <td style={styles.label}>{label}</td>
      <td style={styles.value}>{value || ''}</td>
    </tr>
  );

  return (
    <div style={{ position: 'relative' }} id="cv-pdf-only">
      <div
        id="cv-preview"
        style={{
          ...styles.wrapper,
          ...(paymentConfirmed ? {} : styles.blurred)
        }}

      >
        <div style={styles.headerBox}>
          <h3 style={styles.headerTitle}>
            “ASG” ŞİRKƏTLƏR QRUPUNA İŞƏ QƏBUL ÜÇÜN MÜRACİƏT BLANKI <br />
            CV FORM FOR APPLYING TO “ASG” GROUP OF COMPANIES
          </h3>
        </div>

        <div style={styles.topRow}>
          <div style={styles.positions}>
            <strong>
              İddia etdiyiniz vəzifə(lər) / Positions you apply for:
            </strong>
            <ul style={{ marginTop: '5px' }}>
              <li>{data.position1 || ''}</li> {/* Added data fields */}
              <li>{data.position2 || ''}</li>
              <li>{data.position3 || ''}</li>
            </ul>
          </div>
          <div style={styles.photoBox}>
            {data.photo && (
              <img src={data.photo} alt="Şəkil" style={styles.photo} />
            )}
          </div>
        </div>

        <table style={styles.table}>
          <tbody>
            <tr>
              <td colSpan="2" style={styles.section}>
                ŞƏXSİ MƏLUMAT / PERSONAL INFORMATION
              </td>
            </tr>
            {renderRow(
              'Soyadı, adı, atasının adı / Full name:',
              `${data.fullname || ''} ${data.fathername || ''}`
            )}
            {renderRow(
              'Doğum yeri və tarixi / Date and place of birth:',
              data.birth
            )}
            {renderRow('Vətəndaşlığı / Citizenship:', data.citizenship)}
            {renderRow('Ailə vəziyyəti / Marital status:', data.marital)}
            {renderRow(
              'Herbi mükəlləfiyyəti / Military status:',
              data.military
            )}
            {renderRow(
              'Sürücülük vəsiqəsi / Driving license:',
              data.drivingLicense
            )}
            {renderRow(
              'Gözlənilən əmək haqqı / Expected salary:',
              data.expectedSalary
            )}
            <tr>
              <td colSpan="2" style={{ padding: '0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={styles.label}>Əlaqə / contacts:</th>
                      <th style={styles.iconCell}>📞</th>
                      <th style={styles.iconCell}>📱</th>
                      <th style={styles.iconCell}>📧</th>
                      <th style={styles.iconCell}>📍</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td></td>
                      <td style={styles.value}>{data.phone || ''}</td>
                      <td style={styles.value}>{data.mobile || ''}</td> {/* Added mobile */}
                      <td style={styles.value}>{data.email || ''}</td>
                      <td style={styles.value}>{data.address || ''}</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>

            <tr>
              <td colSpan="2" style={styles.section}>
                TƏHSİL / EDUCATION
              </td>
            </tr>
            {renderRow(
              'Ali təhsil / High education:',
              `${data.university || ''}, ${data.faculty || ''}, ${
                data.gradyears || ''
              }`
            )}
            {renderRow('Orta təhsil / Secondary education:', data.school)}

            <tr>
              <td colSpan="2" style={styles.section}>
                DİL BİLİYİ / LANGUAGE SKILLS
              </td>
            </tr>
            {renderRow('AZ / ENG / RU / Other:', data.languages)}

            <tr>
              <td colSpan="2" style={styles.section}>
                KOMPÜTER BİLİYİ / IT SKILLS
              </td>
            </tr>
            {renderRow(
              'Word, Excel, Outlook, PowerPoint və s.:',
              data.itskills
            )}

            <tr>
              <td colSpan="2" style={styles.section}>
                İŞ TƏCRÜBƏSİ / WORK EXPERIENCE
              </td>
            </tr>
            {data.experience &&
              data.experience.map((exp, index) => (
                <React.Fragment key={index}>
                  {renderRow('Şirkət / Company:', exp.company)}
                  {renderRow('Vəzifə / Position:', exp.position)}
                  {renderRow('Başlama tarixi / Start date:', exp.startDate)}
                  {renderRow('Bitmə tarixi / End date:', exp.endDate || 'Hal-hazırda')}
                  {renderRow('Əsas vəzifə və öhdəliklər / Responsibilities:', exp.responsibilities)}
                  {index < data.experience.length - 1 && (
                    <tr>
                      <td colSpan="2" style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px', marginBottom: '10px' }}></td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            {!data.experience && renderRow('Son işlər:', '')}

            <tr>
              <td colSpan="2" style={styles.section}>
                TƏLİMLƏR / TRAININGS
              </td>
            </tr>
                        {Array.isArray(data.trainings) && data.trainings.length > 0 ? (
              data.trainings.map((training, index) => (
                <React.Fragment key={index}>
                  {renderRow('Təlimin adı / Training name:', training.name)}
                  {renderRow('Təşkilat / Institution:', training.institution)}
                  {renderRow('Tarix / Date:', training.date)}
                  {index < data.trainings.length - 1 && (
                    <tr>
                      <td colSpan="2" style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px', marginBottom: '10px' }}></td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              renderRow('Son təlimlər:', '')
            )}


            <tr>
              <td colSpan="2" style={styles.section}>
                DİGƏR BACARIQLAR / OTHER SKILLS
              </td>
            </tr>
            {renderRow('Qeyd edin:', data.skills)}
          </tbody>
        </table>
      </div>
      {paymentConfirmed ? (
        <div className="pdf-download-wrapper" id="pdf-download-btn" style={styles.pdfDownloadWrapper}>
          <button className="pdf-download-btn" onClick={downloadPDF}>
            PDF kimi yüklə
          </button>
        </div>
      ) : (
        <div style={styles.overlay} id="pdf-download-btn">
          <div style={styles.paymentBox}>
            <h2>Ödəniş olunduqdan sonra PDF yükləyə bilərsiniz</h2>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>4 AZN</p>
            <p style={{ fontSize: '18px' }}>5522 0993 6030 7078</p>
            <a
              href="https://wa.me/994515972371"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.whatsappBtn}
            >
              Whatsapp vasitəsilə ödəniş qəbzini göndərin
            </a>
            <p style={{ marginTop: '10px' }}>Bizimlə əlaqə: 0515972371</p>
          </div>
        </div>
      )}
    </div>

  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(74, 104, 247, 0.95)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '30px',
    color: '#fff'
  },
  paymentBox: {
    backgroundColor: '#fff',
    color: '#222',
    padding: '40px',
    borderRadius: '20px',
    boxShadow: '0 0 25px rgba(0,0,0,0.3)',
    maxWidth: '500px',
    width: '90%',
    fontSize: '18px'
  },
  whatsappBtn: {
    display: 'inline-block',
    marginTop: '20px',
    padding: '12px 20px',
    backgroundColor: 'white',
    color: 'green',
    fontWeight: 'bold',
    borderRadius: '12px',
    textDecoration: 'none',
    fontSize: '18px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)'
  },
  preview: (confirmed) => ({
    opacity: confirmed ? 1 : 0.3,
    filter: confirmed ? 'none' : 'blur(1.5px)',
    userSelect: 'none',
    pointerEvents: confirmed ? 'auto' : 'none',
    padding: '30px',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    maxWidth: '900px',
    margin: '0 auto',
    borderRadius: '10px'
  }),
  photo: {
    width: '120px',
    height: '150px',
    objectFit: 'cover',
    border: '1px solid #000',
    pointerEvents: 'none',
    userSelect: 'none'
  },
  downloadBtn: {
    marginTop: '30px',
    padding: '12px 24px',
    backgroundColor: '#28a745',
    color: '#fff',
    fontSize: '16px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  blurred: {
    opacity: '1',
    filter: 'blur(1px)',
    pointerEvents: 'none',
  },
  wrapper: {
    maxWidth: '850px',
    margin: '40px auto',
    padding: '20px',
    backgroundColor: '#fff',
    fontFamily: 'Arial',
    fontSize: '13px',
    border: '1px solid #999',
  },
  headerBox: {
    backgroundColor: '#4573c4',
    color: '#fff',
    textAlign: 'center',
    padding: '15px 10px',
    border: '1px solid #4573c4',
    marginBottom: '20px',
  },
  headerTitle: {
    margin: 0,
    fontSize: '17px',
    fontWeight: 'bold',
    lineHeight: '1.5',
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  positions: {
    flex: 1,
  },
  photoBox: {
    width: '120px',
    height: '150px',
    border: '1px solid #000',
    overflow: 'hidden',
    textAlign: 'center',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  section: {
    backgroundColor: '#ddd',
    fontWeight: 'bold',
    padding: '8px',
    fontSize: '14px',
  },
  label: {
    width: '40%',
    border: '1px solid #aaa',
    padding: '6px',
    verticalAlign: 'top',
  },
  value: {
    border: '1px solid #aaa',
    padding: '6px',
    verticalAlign: 'top',
  },
  iconCell: {
    border: '1px solid #aaa',
    textAlign: 'center',
    fontSize: '18px',
    padding: '6px',
  },
  payBtn: {
    marginTop: '30px',
    padding: '18px 24px',
    backgroundColor: '#fff',
    color: '#28a745',
    fontSize: '20px',
    border: 'none',
    borderRadius: '24px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
    pdfDownloadWrapper: {
    margin: '30px auto 0',
    textAlign: 'center',
  }
};

export default CVPreview;