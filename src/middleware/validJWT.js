require("dotenv").config()
const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function checkTokenValidity(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]; // Assuming 'Authorization: Bearer <token>'
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
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

      res.set('New-Token', newToken);
    }

    // Token is valid, proceed with the request
    req.userId = userId;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
}


module.exports = checkTokenValidity;