// utils/auth.js
export function isTokenValid(token) {
  if (!token) return false; // No token present

  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // Decode the token
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds   

    // lggoing time
    const timeRemaining=payload.exp-currentTime
    const minutesRemaining = Math.floor(timeRemaining / 60);
    const hoursRemaining = Math.floor(timeRemaining / 3600);
    const daysRemaining = Math.floor(timeRemaining / (3600 * 24));

    // console.log(`Token is expire in: ${daysRemaining} days, ${hoursRemaining} hours, ${minutesRemaining} minutes.`);

    // If the token has expired
    if (payload.exp < currentTime) {
    //   console.log("Token is expired.");
      return false;
    }
    // console.log("Token is valid.");
    return true; // Token is valid
  } catch (error) {
    console.error("Error decoding token:", error);
    return false; // Token decoding failed, so it's invalid
  }
}
