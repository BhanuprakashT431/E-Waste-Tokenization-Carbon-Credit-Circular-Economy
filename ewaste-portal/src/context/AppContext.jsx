import React, { createContext, useContext, useState, useEffect } from 'react';
import { analyzeItem } from '../utils/integrityAI';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

const generatePickupCode = () => Math.floor(1000 + Math.random() * 9000).toString();

export const AppProvider = ({ children }) => {
  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem('ewaste_requests');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "EW-2024-000256",
        category: "Laptop",
        weight: 2.5,
        distance: "1.2 km away",
        location: "12.9716° N, 77.5946° E · Bengaluru",
        pickupCode: "4821",
        status: "COMPLETED",
        createdAt: new Date().toISOString(),
        ccAwarded: 25.6
      },
      {
        id: "EW-2024-000254",
        category: "Battery",
        weight: 0.5,
        distance: "1.5 km away",
        location: "12.9352° N, 77.6245° E · Koramangala",
        pickupCode: "7364",
        status: "IN_PROGRESS",
        createdAt: new Date().toISOString()
      },
      {
        id: "EW-2024-000260",
        category: "Monitor",
        weight: 4.0,
        distance: "2.8 km away",
        location: "12.9698° N, 77.7500° E · Whitefield",
        pickupCode: "2917",
        status: "PENDING",
        createdAt: new Date().toISOString()
      }
    ];
  });

  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('ewaste_userProfile');
    if (saved) return JSON.parse(saved);
    return { name: "Riya", carbonCredits: 120.5 };
  });

  const [collectorProfile, setCollectorProfile] = useState(() => {
    const saved = localStorage.getItem('ewaste_collectorProfile');
    if (saved) return JSON.parse(saved);
    return { name: "Arjun", earnings: 1450 };
  });

  const [recyclerProfile, setRecyclerProfile] = useState(() => {
    const saved = localStorage.getItem('ewaste_recyclerProfile');
    if (saved) return JSON.parse(saved);
    return { name: "EcoProcess Team", processedTons: 2.45 };
  });

  useEffect(() => { localStorage.setItem('ewaste_requests', JSON.stringify(requests)); }, [requests]);
  useEffect(() => { localStorage.setItem('ewaste_userProfile', JSON.stringify(userProfile)); }, [userProfile]);
  useEffect(() => { localStorage.setItem('ewaste_collectorProfile', JSON.stringify(collectorProfile)); }, [collectorProfile]);
  useEffect(() => { localStorage.setItem('ewaste_recyclerProfile', JSON.stringify(recyclerProfile)); }, [recyclerProfile]);

  const logEwaste = (category, weight, location) => {
    const newRequest = {
      id: `EW-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000).toString().padStart(6, '0')}`,
      category,
      weight: parseFloat(weight),
      distance: (Math.random() * 5 + 0.5).toFixed(1) + " km away",
      location: location || "Location not shared",
      pickupCode: generatePickupCode(),
      status: "PENDING",
      createdAt: new Date().toISOString()
    };
    setRequests(prev => [newRequest, ...prev]);
  };

  const acceptRequest = (id) => {
    setRequests(prev => prev.map(req =>
      req.id === id ? { ...req, status: "IN_PROGRESS" } : req
    ));
  };

  // Returns true if code matches, false otherwise
  const confirmPickup = (id, enteredCode) => {
    const req = requests.find(r => r.id === id);
    if (!req) return false;
    if (req.pickupCode === enteredCode.trim()) {
      setRequests(prev => prev.map(r =>
        r.id === id ? { ...r, status: "PICKED_UP" } : r
      ));
      return true;
    }
    return false;
  };

  const deliverRequest = (id) => {
    setRequests(prev => prev.map(req =>
      req.id === id ? { ...req, status: "DELIVERED" } : req
    ));
  };

  const processRequest = (id, aiAnalysis) => {
    setRequests(prev => prev.map(req => {
      if (req.id === id) {
        const ccAwarded = aiAnalysis ? aiAnalysis.suggestedCC : Number((req.weight * 10).toFixed(1));
        const earnings = Number((req.weight * 50).toFixed(0));
        const tonsProcessed = req.weight / 1000;
        setUserProfile(u => ({ ...u, carbonCredits: u.carbonCredits + ccAwarded }));
        setCollectorProfile(c => ({ ...c, earnings: c.earnings + earnings }));
        setRecyclerProfile(r => ({ ...r, processedTons: r.processedTons + tonsProcessed }));
        return { ...req, status: "COMPLETED", ccAwarded, aiAnalysis: aiAnalysis || null };
      }
      return req;
    }));
  };

  return (
    <AppContext.Provider value={{
      requests,
      userProfile,
      collectorProfile,
      recyclerProfile,
      logEwaste,
      acceptRequest,
      confirmPickup,
      deliverRequest,
      processRequest
    }}>
      {children}
    </AppContext.Provider>
  );
};
