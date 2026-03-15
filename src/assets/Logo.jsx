import React from 'react';

const Logo = () => (
  <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
    <svg width="180" height="60" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Black Square Icon */}
      <rect width="45" height="45" rx="10" fill="#000000" />
      
      {/* White 'K' + Arrow Icon */}
      <path d="M15 12V33M15 22.5L25 12M15 22.5L26 33" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M28 10L32 10L32 14" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M24 18L32 10" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round"/>
      
      {/* Black Text */}
      <text x="58" y="30" style={{ fill: '#000000', fontSize: '26px', fontWeight: 'bold', fontFamily: 'Inter, sans-serif' }}>KARTIK</text>
      <text x="58" y="45" style={{ fill: '#333333', fontSize: '10px', fontWeight: '500', letterSpacing: '3px', fontFamily: 'Inter, sans-serif' }}>TRADING CO.</text>
    </svg>
  </div>
);

export default Logo;