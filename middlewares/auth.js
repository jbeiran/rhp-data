const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
    try {
        //console.log("Request object in auth middleware:", req);
        const token = req.header("Authorization");
        //console.log("Access token in auth middleware:", token);
        if (!token) return res.status(400).json({ msg: "Invalid Authentication." });

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.status(400).json({ msg: "Invalid Authentication." });

            //console.log("User object in auth middleware:", user);
            req.user = user;
            next();
        });
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}

module.exports = auth