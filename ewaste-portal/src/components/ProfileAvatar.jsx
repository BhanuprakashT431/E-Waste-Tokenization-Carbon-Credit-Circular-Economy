/**
 * ProfileAvatar — shows the logged-in user's initials with role-themed color.
 * Replaces all hardcoded pravatar.cc images.
 */
import React from 'react';
import { useAuth } from '../context/AuthContext';

const ROLE_COLORS = {
  user:      { bg: 'linear-gradient(135deg,#059669,#10B981)', text: 'white' },
  collector: { bg: 'linear-gradient(135deg,#5B21B6,#7C3AED)', text: 'white' },
  recycler:  { bg: 'linear-gradient(135deg,#1D4ED8,#3B82F6)', text: 'white' },
  esg:       { bg: 'linear-gradient(135deg,#0F766E,#14B8A6)', text: 'white' },
};

export function ProfileAvatar({ size = 52 }) {
  const { currentUser } = useAuth();
  const name    = currentUser?.name || '?';
  const role    = currentUser?.role || 'user';
  const colors  = ROLE_COLORS[role] || ROLE_COLORS.user;

  // Build up to 2 initials from the name
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('');

  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: colors.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: colors.text, fontWeight: 900, fontSize: size * 0.38,
      flexShrink: 0, boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
      letterSpacing: 0.5, userSelect: 'none',
    }}>
      {initials}
    </div>
  );
}

/**
 * useAuthProfile — returns the full registered user object for the current session.
 */
export function useAuthProfile() {
  const { getProfile, currentUser } = useAuth();
  const profile = getProfile();
  return {
    name:        profile?.name        || profile?.companyName || currentUser?.name || 'User',
    email:       profile?.email       || '',
    phone:       profile?.phone       || '',
    address:     profile?.address     || '',
    id:          profile?.id          || '',
    role:        profile?.role        || '',
    companyName: profile?.companyName || '',
    department:  profile?.department  || '',
    zone:        profile?.zone        || '',
    vehicleType: profile?.vehicleType || '',
    licenseNumber: profile?.licenseNumber || '',
    facilityAddress: profile?.facilityAddress || '',
    gstNumber:   profile?.gstNumber   || '',
    registeredAt: profile?.registeredAt || '',
  };
}
