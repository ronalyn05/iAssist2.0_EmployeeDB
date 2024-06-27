// utils.js

// Function to generate a unique password
const generateUniquePassword = () => {
    return 'Test@' + Math.random().toString(36).slice(-8);
  };
  
  // Export the generateUniquePassword function
  module.exports = {
    generateUniquePassword
  };
  