import React from 'react';

const UserProfile = () => {
  // ડમી યુઝર ડેટા
  const user = {
    name: 'Rahul Patel',
    role: 'Frontend Developer',
    email: 'rahul@example.com',
    location: 'Ahmedabad, India',
    bio: 'Learning React and Git! Building cool web applications step by step.'
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        {/* પ્રોફાઈલ અવતાર (ફોટો અથવા આઈકન) */}
        <div style={styles.avatar}>
          {user.name.charAt(0)}
        </div>

        {/* યુઝર વિગતો */}
        <h2 style={styles.name}>{user.name}</h2>
        <p style={styles.role}>{user.role}</p>
        
        <div style={styles.divider}></div>

        <div style={styles.infoGroup}>
          <p style={styles.infoText}><strong>Email:</strong> {user.email}</p>
          <p style={styles.infoText}><strong>Location:</strong> {user.location}</p>
          <p style={styles.bio}>{user.bio}</p>
        </div>

        <button style={styles.button} onClick={() => alert('Profile Updated!')}>
          Edit Profile
        </button>

      </div>
    </div>
  );
};

// CSS Styles Object
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#eef2f7',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
    width: '100%',
    maxWidth: '350px',
    textAlign: 'center'
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#4318ff',
    color: '#ffffff',
    fontSize: '36px',
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0 auto 16px auto',
    boxShadow: '0 4px 12px rgba(67, 24, 255, 0.3)'
  },
  name: {
    margin: '0 0 4px 0',
    color: '#1b2559',
    fontSize: '22px',
    fontWeight: 'bold'
  },
  role: {
    margin: '0',
    color: '#a3edd9',
    fontSize: '14px',
    fontWeight: '600',
    color: '#707e94'
  },
  divider: {
    height: '1px',
    backgroundColor: '#e0e5f2',
    margin: '20px 0'
  },
  infoGroup: {
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  infoText: {
    margin: '0',
    fontSize: '14px',
    color: '#2b3674'
  },
  bio: {
    margin: '8px 0 0 0',
    fontSize: '13px',
    color: '#a3aed0',
    lineHeight: '1.5'
  },
  button: {
    marginTop: '20px',
    width: '100%',
    padding: '10px',
    backgroundColor: '#111c44',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  }
};

export default UserProfile;