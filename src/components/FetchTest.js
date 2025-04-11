import React, { useEffect, useState } from 'react';

const FetchTest = () => {
  const [response, setResponse] = useState('🔄 Sorğu göndərilir...');

  useEffect(() => {
    const uid = '1744383401981'; // test ediləcək UID
    const API_URL = `https://yxfzbjtgzdzilleajfzc.supabase.co/rest/v1/cv_requests?user_id=eq.${uid}`;
    const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4ZnpianRnemR6aWxsZWFqZnpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzNjc5ODEsImV4cCI6MjA1OTk0Mzk4MX0.IHs-kBCmQJyygIjBWg0Chg_dVDQkXC-mPPUsLbrBJBM'; // buraya öz `anon` açarını yapışdır

    fetch(API_URL, {
      headers: {
        apikey: API_KEY,
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log("🧪 Fetch ilə cavab:", data);
        if (!data || data.length === 0) {
          setResponse('❌ Heç bir nəticə gəlmədi.');
        } else {
          setResponse('✅ Məlumat tapıldı: ' + JSON.stringify(data[0]));
        }
      })
      .catch(err => {
        console.error("❌ Fetch xətası:", err);
        setResponse('❌ Fetch xətası: ' + err.message);
      });
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '20px' }}>
      {response}
    </div>
  );
};

export default FetchTest;
