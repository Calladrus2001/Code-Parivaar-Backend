const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Assuming you have a User model defined

async function checkTokenValidity(socket, next) {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("Authentication token not provided"));
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_HASH_KEY);
    const userId = decodedToken._id;

    // Check if the token is about to expire
    const currentTime = Math.floor(Date.now() / 1000);
    const tokenExpiration = decodedToken.exp;
    const timeToExpiration = tokenExpiration - currentTime;
    const refreshThreshold = 300; // 5 minutes (in seconds)

    if (timeToExpiration <= refreshThreshold) {
      const user = await User.findById(userId);
      const newToken = generateToken(user);

      // Save the new token in the User model and remove the old token
      const oldTokenIndex = user.jwtTokens.indexOf(token);
      if (oldTokenIndex !== -1) {
        user.jwtTokens.splice(oldTokenIndex, 1);
      }
      user.jwtTokens.push(newToken);
      await user.save();

      // Attach the new token to the socket for the client to update it
      socket.handshake.auth.token = newToken;
    }

    // Token is valid, proceed with the connection
    socket.userId = userId;
    next();
  } catch (error) {
    next(new Error("Authentication failed"));
  }
}

module.exports = checkTokenValidity;