import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from './lib/supabase';
import { useEffect, useState } from 'react';

// Import your components here
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import QuartersListing from './components/QuartersListing';
import BookingProcess from './components/BookingProcess';
import MaintenanceRequests from './components/MaintenanceRequests';
import Services from './components/Services';
import UtilityBills from './components/UtilityBills';
import MiniMart from './components/MiniMart';
import Profile from './components/Profile';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center mb-6">BIT Quarters Management</h1>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={['google']}
            queryParams={{
              access_type: 'offline',
              prompt: 'consent',
              hd: 'bitsathy.ac.in'
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/quarters" element={<QuartersListing />} />
          <Route path="/booking" element={<BookingProcess />} />
          <Route path="/maintenance" element={<MaintenanceRequests />} />
          <Route path="/services" element={<Services />} />
          <Route path="/bills" element={<UtilityBills />} />
          <Route path="/mart" element={<MiniMart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
