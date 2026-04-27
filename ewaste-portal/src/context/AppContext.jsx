import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  // Initialize state from localStorage or defaults
  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem('ewaste_requests');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "EW-2024-000256",
        category: "Laptop",
        weight: 2.5,
        distance: "1.2 km away",
        status: "COMPLETED",
        createdAt: new Date().toISOString(),
        ccAwarded: 25.6
      },
      {
        id: "EW-2024-000254",
        category: "Battery",
        weight: 0.5,
        distance: "1.5 km away",
        status: "IN_PROGRESS",
        createdAt: new Date().toISOString()
      },
      {
        id: "EW-2024-000260",
        category: "Monitor",
        weight: 4.0,
        distance: "2.8 km away",
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

  // Persist state to localStorage on changes
  useEffect(() => {
    localStorage.setItem('ewaste_requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('ewaste_userProfile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('ewaste_collectorProfile', JSON.stringify(collectorProfile));
  }, [collectorProfile]);

  useEffect(() => {
    localStorage.setItem('ewaste_recyclerProfile', JSON.stringify(recyclerProfile));
  }, [recyclerProfile]);

  // Actions
  const logEwaste = (category, weight) => {
    const newRequest = {
      id: `EW-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000).toString().padStart(6, '0')}`,
      category,
      weight: parseFloat(weight),
      distance: (Math.random() * 5 + 0.5).toFixed(1) + " km away", // Random distance for demo
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

  const deliverRequest = (id) => {
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: "DELIVERED" } : req
    ));
  };

  const processRequest = (id) => {
    setRequests(prev => prev.map(req => {
      if (req.id === id) {
        const ccAwarded = Number((req.weight * 10).toFixed(1));
        const earnings = Number((req.weight * 50).toFixed(0));
        const tonsProcessed = req.weight / 1000;

        // Update User
        setUserProfile(u => ({ ...u, carbonCredits: u.carbonCredits + ccAwarded }));
        
        // Update Collector
        setCollectorProfile(c => ({ ...c, earnings: c.earnings + earnings }));
        
        // Update Recycler
        setRecyclerProfile(r => ({ ...r, processedTons: r.processedTons + tonsProcessed }));

        return { ...req, status: "COMPLETED", ccAwarded };
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
      deliverRequest,
      processRequest
    }}>
      {children}
    </AppContext.Provider>
  );
};
