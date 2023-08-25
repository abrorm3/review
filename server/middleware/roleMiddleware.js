const jwt = require('jsonwebtoken');
const { secret } = require('../config');

module.exports = function (roles) {
  return function (req, res, next) {
    if (req.method === "OPTIONS") {
      next();
    }
    try {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return res.status(403).json({ message: "User is not authorized" });
      }
      const { roles: userRoles } = jwt.verify(token, secret);
      let hasRole = false;
      let isBlocked = false;

      if (roles.includes("BLOCK")) {
        // Check if the user has the BLOCK role
        if (userRoles.includes("BLOCK")) {
          isBlocked = true;
        } else {
          hasRole = true;
        }
      } else {
        // Check if the user has any of the specified roles
        userRoles.forEach(role => {
          if (roles.includes(role)) {
            hasRole = true;
          }
        });
      }

      req.userRoles = userRoles; // Store user roles in request object
      req.isBlocked = isBlocked; // Store isBlocked in request object

      next();
    } catch (err) {
      console.log(err);
      return res.status(403).json({ message: "User is not authorized" });
    }
  };
};