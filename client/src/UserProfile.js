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
    <div>
      <h2>User Profile</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="tel"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Update Profile</button>
      </form>

      <h3>Current Profile Data:</h3>
      <p>Name: {profile.name}</p>
      <p>Email: {profile.email}</p>
      <p>Phone: {profile.phone}</p>
    </div>
  );
}

export default UserProfile;
