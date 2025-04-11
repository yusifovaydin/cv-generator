// src/components/CVForm.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';


const CVForm = () => {
  const [formData, setFormData] = useState({
    marital: '',
    customMarital: '',
    showCustomMarital: false,
    fullname: '',
    fathername: '',
    birth: '',
    citizenship: '',
    email: '',
    marital: '',
    phone: '',
    address: '',
    university: '',
    faculty: '',
    gradyears: '',
    school: '',
    languages: '',
    itskills: '',
    experience: '',
    trainings: '',
    skills: '',
    photo: null
  });

  const [educationList, setEducationList] = useState([]);
  const [currentEducation, setCurrentEducation] = useState({
    university: '',
    faculty: '',
    gradyears: ''
  });

  const [languageList, setLanguageList] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState({
    name: '',
    level: ''
  });

  const [experienceList, setExperienceList] = useState([]);
  const [currentExperience, setCurrentExperience] = useState({
    company: '',
    position: '',
    responsibilities: '',
    startEndDate: '',
    reason: ''
  });

  const [schoolList, setSchoolList] = useState([]);
  const [currentSchool, setCurrentSchool] = useState({
    name: '',
    years: ''
  });


  const navigate = useNavigate();

  useEffect(() => {
    const selectedCV = localStorage.getItem('selectedCV');
    if (!selectedCV) {
      navigate('/');
    }

    const handlePopState = () => {
      navigate('/', { replace: true });
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleChange = (e) => {
  const { name, value, type, files } = e.target;
  if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else if (name === 'marital') {
      setFormData({
        ...formData,
        marital: value,
        showCustomMarital: value === 'Digər',
        customMarital: value === 'Digər' ? '' : value
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleLanguageAdd = () => {
    if (currentLanguage.name && currentLanguage.level) {
      setLanguageList([...languageList, currentLanguage]);
      setCurrentLanguage({ name: '', level: '' });
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = Date.now();
    const createdAt = new Date().toLocaleString();
    let updatedData = { ...formData, userId, createdAt, educationList, languageList, schoolList};

    if (formData.marital === 'Digər') {
        updatedData.marital = formData.customMarital;
      }
    if (formData.photo) {
      const base64Photo = await convertImageToBase64(formData.photo);
      updatedData.photo = base64Photo;
    }

    // CV məlumatlarını saxla
    localStorage.setItem('cvData', JSON.stringify(updatedData));
    localStorage.setItem('userId', userId);

    // Təsdiq gözləyən siyahıya əlavə et
    const existingRequests = JSON.parse(localStorage.getItem('cvRequests')) || [];
    const newRequest = {
      userId,
      fullname: formData.fullname,
      fathername: formData.fathername,
      createdAt
    };
    localStorage.setItem('cvRequests', JSON.stringify([...existingRequests, newRequest]));

    try {
      const { error } = await supabase.from('cv_requests').insert([
        {
          user_id: userId.toString(),
          fullname: formData.fullname,
          fathername: formData.fathername,
          created_at: new Date().toISOString(),
          payment_confirmed: false 
        }
      ]);

      if (error) {
        console.error('Supabase insert error:', error.message);
      } else {
        console.log('Məlumat uğurla Supabase-ə əlavə olundu');
      }
    } catch (err) {
      console.error('Supabase bağlantı xətası:', err.message);
    }

        // CV detallarını Supabase-ə əlavə et
    await supabase.from('cv_details').insert([
      {
        user_id: userId.toString(),
        photo: updatedData.photo || '',
        email: updatedData.email || '',
        phone: updatedData.phone || '',
        address: updatedData.address || '',
        education: educationList, // array of education objects
        school: schoolList, // array of school objects
        languages: languageList, // array of language objects
        experience: experienceList, // array of experience objects
        trainings: updatedData.trainings || '',
        skills: updatedData.skills || '',
        itskills: updatedData.itskills || ''
      }
    ]);

    const selectedCV = localStorage.getItem('selectedCV');

    if (selectedCV === 'asg') {
      navigate(`/asg?uid=${userId}`);
    } else if (selectedCV === 'unikal') {
      navigate(`/preview-unikal?uid=${userId}`);
    }

  };

  const styles = {
    form: {
      maxWidth: '600px',
      margin: '30px auto',
      padding: '20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '12px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    heading: {
      textAlign: 'center',
      marginBottom: '20px',
      color: '#343a40'
    },
    input: {
      padding: '10px',
      fontSize: '16px',
      borderRadius: '8px',
      border: '1px solid #ccc'
    },
    textarea: {
      padding: '10px',
      fontSize: '16px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      minHeight: '80px'
    },
    button: {
      backgroundColor: '#007bff',
      color: '#fff',
      padding: '12px',
      fontSize: '16px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer'
    }
  };

  return (


    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.heading}>CV Məlumatları</h2>
      

      <label>Ad və Soyad:</label>
      <input name="fullname" value={formData.fullname} onChange={handleChange} style={styles.input} required />

      <label>Ata adı:</label>
      <input name="fathername" value={formData.fathername} onChange={handleChange} style={styles.input} />

      <label>Doğum Tarixi:</label>
      <input name="birth" value={formData.birth} onChange={handleChange} style={styles.input} required />

      <label>Vətəndaşlıq:</label>
      <input name="citizenship" value={formData.citizenship} onChange={handleChange} style={styles.input} />

      <label>E-mail:</label>
      <input name="email" value={formData.email} onChange={handleChange} style={styles.input} />

      <label>Ailə vəziyyəti:</label>
        <select
          name="marital"
          value={formData.marital}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="">Seçin...</option>
          <option value="Evli">Evli</option>
          <option value="Subay">Subay</option>
          <option value="Digər">Digər</option>
        </select>
        {formData.showCustomMarital && (
          <input
            name="customMarital"
            placeholder="Digər - qeyd edin"
            value={formData.customMarital}
            onChange={handleChange}
            style={styles.input}
          />
        )}
      <label>Telefon:</label>
      <input
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        style={styles.input}
        placeholder="(055 XXX XX XX)"
        type="tel"
        pattern="[0-9]{3}[0-9]{3}[0-9]{2}[0-9]{2}"
        maxLength="10"
      />


      <label>Ünvan:</label>
      <input name="address" value={formData.address} onChange={handleChange} style={styles.input} />

      <label>Şəkil yüklə:</label>
      <input type="file" name="photo" accept="image/*" onChange={handleChange} style={styles.input} />

      <label>Ali təhsil:</label>
        <input
          name="university"
          placeholder="Universitetin adı"
          value={currentEducation.university}
          onChange={(e) => setCurrentEducation({ ...currentEducation, university: e.target.value })}
          style={styles.input}
        />
        <input
          name="faculty"
          placeholder="Fakültə / İxtisas"
          value={currentEducation.faculty}
          onChange={(e) => setCurrentEducation({ ...currentEducation, faculty: e.target.value })}
          style={styles.input}
        />
        <input
          name="gradyears"
          placeholder="Qəbul və bitirdiyi illər"
          value={currentEducation.gradyears}
          onChange={(e) => setCurrentEducation({ ...currentEducation, gradyears: e.target.value })}
          style={styles.input}
        />
        <button type="button" onClick={() => {
          setEducationList([...educationList, currentEducation]);
          setCurrentEducation({ university: '', faculty: '', gradyears: '' });
        }} style={{ ...styles.button, backgroundColor: '#28a745' }}>
          Əlavə et
        </button>

        <ul>
          {educationList.map((edu, index) => (
            <li key={index}>
              <strong>{edu.university}</strong> - {edu.faculty} ({edu.gradyears})
            </li>
          ))}
        </ul>

      <label>Orta məktəb və illər:</label>
      <input
        name="name"
        placeholder="Məktəbin adı"
        value={currentSchool.name}
        onChange={(e) => setCurrentSchool({ ...currentSchool, name: e.target.value })}
        style={styles.input}
      />
      <input
        name="years"
        placeholder="Qəbul və bitirdiyi illər (məs. 2010-2021)"
        value={currentSchool.years}
        onChange={(e) => setCurrentSchool({ ...currentSchool, years: e.target.value })}
        style={styles.input}
      />
      <button
        type="button"
        onClick={() => {
          if (currentSchool.name && currentSchool.years) {
            setSchoolList([...schoolList, currentSchool]);
            setCurrentSchool({ name: '', years: '' });
          }
        }}
        style={{ ...styles.button, backgroundColor: '#17a2b8' }}
      >
        Əlavə et
      </button>

      <ul>
        {schoolList.map((school, index) => (
          <li key={index}>
            <strong>{school.name}</strong> ({school.years})
          </li>
        ))}
      </ul>


      <label>Dil bilikləri:</label>
      <div style={{ display: 'flex', gap: '10px' }}>
        <select
          value={currentLanguage.name}
          onChange={(e) => setCurrentLanguage({ ...currentLanguage, name: e.target.value })}
          style={styles.input}
        >
          <option value="">Dil seçin</option>
          <option value="Azərbaycan">Azərbaycan</option>
          <option value="Rus">Rus</option>
          <option value="Türk">Türk</option>
          <option value="İngilis">İngilis</option>
          <option value="Ərəb">Ərəb</option>
        </select>

        <select
          value={currentLanguage.level}
          onChange={(e) => setCurrentLanguage({ ...currentLanguage, level: e.target.value })}
          style={styles.input}
        >
          <option value="">Səviyyə</option>
          <option value="A1">A1</option>
          <option value="A2">A2</option>
          <option value="B1">B1</option>
          <option value="B2">B2</option>
          <option value="C1">C1</option>
          <option value="C2">C2</option>
        </select>

        <button type="button" onClick={handleLanguageAdd} style={{ ...styles.button, backgroundColor: '#28a745' }}>
          Əlavə et
        </button>
      </div>

      <ul>
        {languageList.map((lang, idx) => (
          <li key={idx}>
            <strong>{lang.name}</strong> - {lang.level}
          </li>
        ))}
      </ul>


      <label>Kompüter bilikləri:</label>
      <textarea name="itskills" value={formData.itskills} onChange={handleChange} style={styles.textarea} />

      <label>İş təcrübəsi:</label>
      <input
        name="company"
        placeholder="İş yerinin adı"
        value={currentExperience.company}
        onChange={(e) => setCurrentExperience({ ...currentExperience, company: e.target.value })}
        style={styles.input}
       />

      <input
        name="position"
        placeholder="Vəzifə"
        value={currentExperience.position}
        onChange={(e) => setCurrentExperience({ ...currentExperience, position: e.target.value })}
        style={styles.input}
       />

      <input
        name="responsibilities"
        placeholder="Vəzifə öhdəlikləri"
        value={currentExperience.responsibilities}
        onChange={(e) => setCurrentExperience({ ...currentExperience, responsibilities: e.target.value })}
        style={styles.input}
       />

      <input
        name="startEndDate"
        placeholder="İşə qəbul və çıxma tarixi"
        value={currentExperience.startEndDate}
        onChange={(e) => setCurrentExperience({ ...currentExperience, startEndDate: e.target.value })}
        style={styles.input}
       />

      <input
        name="reason"
        placeholder="İşdən çıxma səbəbi"
        value={currentExperience.reason}
        onChange={(e) => setCurrentExperience({ ...currentExperience, reason: e.target.value })}
        style={styles.input}
       />

      <button
        type="button"
        onClick={() => {
          setExperienceList([...experienceList, currentExperience]);
          setCurrentExperience({
            company: '',
            position: '',
            responsibilities: '',
            startEndDate: '',
            reason: ''
          });
        }}
        style={{ ...styles.button, backgroundColor: '#28a745' }}
      >
        Əlavə et
      </button>

      <ul>
        {experienceList.map((exp, index) => (
          <li key={index}>
            <strong>{exp.company}</strong> — {exp.position} ({exp.startEndDate})<br />
            <em>Öhdəliklər:</em> {exp.responsibilities}<br />
            <em>Səbəb:</em> {exp.reason}
          </li>
        ))}
      </ul>


      <label>Təlimlər:</label>
      <textarea name="trainings" value={formData.trainings} onChange={handleChange} style={styles.textarea} />

      <label>Digər bacarıqlar:</label>
      <textarea name="skills" value={formData.skills} onChange={handleChange} style={styles.textarea} />

      <button type="submit" style={styles.button}>CV Hazırla</button>
    </form>
  );
};

export default CVForm;
