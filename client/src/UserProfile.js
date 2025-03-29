// src/components/UserProfile.js
import { useState, useEffect } from "react";

function UserProfile() {
  // Initial profile data (can be empty or fetched from localStorage)
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Load profile data from localStorage when the component mounts
  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem("userProfile"));
    if (savedProfile) {
      setProfile(savedProfile);
    }
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  // Save profile data to localStorage and update the state
  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("userProfile", JSON.stringify(profile));
    alert("Profile updated successfully!");
  };

  return (
    <div
      style={{
        background: "linear-gradient(to right, red, red, orange)",
        color: "white",
        padding: "20px",
        borderRadius: "8px",
        fontFamily: 'sans-serif'
      }}
    >
      <h2 style={{ textAlign: "center" }}>User Profile</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Name:</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc", backgroundColor:'white', color:'black' }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Email:</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc", backgroundColor:'white', color:'black' }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Phone:</label>
          <input
            type="tel"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc", backgroundColor:'white', color:'black' }}
          />
        </div>
        <button
          type="submit"
          style={{
            backgroundColor: "darkred",
            color: "white",
            padding: "10px 15px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Update Profile
        </button>
      </form>

      <h3 style={{ marginTop: "20px" }}>Current Profile Data:</h3>
      <p>Name: {profile.name}</p>
      <p>Email: {profile.email}</p>
      <p>Phone: {profile.phone}</p>
    </div>
  );
}

export default UserProfile;