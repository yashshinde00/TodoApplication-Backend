const jwt = require("jsonwebtoken");
require("dotenv").config(); // Import environment variables

const JWT_SECRET = process.env.JWT_SECRET; // Get the JWT secret key from env

function auth(req, res, next) {
    const token = req.headers.token;

    if (!token) {
        return res.status(401).json({
            message: "No token provided. Unauthorized access.",
        });
    }

    try {
        const response = jwt.verify(token, JWT_SECRET); // Verify the token
        if (response) {
            req.userId = response.id; // Attach user ID to the request object
            next();
        }
    } catch (error) {
        return res.status(403).json({
            message: "Incorrect creds",
        });
    }
}

module.exports = {
    auth,
};
