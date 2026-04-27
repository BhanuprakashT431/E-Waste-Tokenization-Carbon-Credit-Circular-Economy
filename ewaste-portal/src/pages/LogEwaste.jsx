import React, { useState } from 'react';
import { Camera, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function LogEwaste() {
  const navigate = useNavigate();
  const { logEwaste } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("Laptop");
  const [weight, setWeight] = useState("2.5");

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      logEwaste(category, weight);
      setLoading(false);
      navigate('/user/dashboard');
    }, 1000);
  };

  return (
    <div>
      <h2 style={{fontSize: 20, fontWeight: 700, marginBottom: 8}}>What are you disposing?</h2>
      <p style={{color: '#6B7280', fontSize: 14, marginBottom: 24}}>Upload image of the device</p>

      <form onSubmit={handleSubmit}>
        <div className="upload-box">
          <Camera />
          <span style={{fontWeight: 500, color: '#4B5563'}}>Upload Image</span>
        </div>

        <div className="input-group">
          <label className="input-label">Select Category</label>
          <select 
            className="input-field" 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Laptop">Laptop</option>
            <option value="Mobile Phone">Mobile Phone</option>
            <option value="Tablet">Tablet</option>
            <option value="Battery">Battery</option>
            <option value="Monitor">Monitor</option>
            <option value="CPU">CPU</option>
          </select>
        </div>

        <div className="input-group">
          <label className="input-label">Estimated Weight (kg)</label>
          <input 
            type="number" 
            step="0.1" 
            className="input-field" 
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn-primary" style={{marginTop: 32}} disabled={loading}>
          {loading ? 'ANALYZING...' : 'SUBMIT'}
        </button>
      </form>
    </div>
  );
}
