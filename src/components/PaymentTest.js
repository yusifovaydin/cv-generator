import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

const PaymentTest = () => {
  const [message, setMessage] = useState('🔄 Yoxlanılır...');

  useEffect(() => {
    const rawUid = new URLSearchParams(window.location.search).get('uid');
    const uid = String(rawUid?.trim());
    console.log("🔍 UID:", `"${uid}"`, typeof uid);

    if (!uid) {
      setMessage('❌ UID tapılmadı. Linkdə ?uid=... olmalıdır.');
      return;
    }

    const checkPayment = async () => {
      const { data, error } = await supabase
      .from('cv_requests')
      .select('*')
      .eq('user_id', uid);


      console.log("📦 Supabase cavabı:", data);

      if (error) {
        setMessage(`❌ Supabase xətası: ${error.message}`);
      } else if (!data || data.length === 0) {
        setMessage('❌ Heç bir istifadəçi tapılmadı.');
      } else if (data[0].payment_confirmed === true) {
        setMessage('✅ Ödəniş TƏSDİQLƏNİB');
      } else {
        setMessage('❌ Ödəniş hələ TƏSDİQLƏNMƏYİB');
      }
    };

    checkPayment();
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '20px', fontWeight: 'bold' }}>
      {message}
    </div>
  );
};

export default PaymentTest;
