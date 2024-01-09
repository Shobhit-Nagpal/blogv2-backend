const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

exports.admin_post = [
    body("username", "Username should be a minimum of 4 character").trim().isLength({ min: 4 }).escape(),
    body("password", "Password should be a minimum of 8 characters").trim().isLength({ min: 8 }).escape(),
    asyncHandler(async(req, res, next) => {   

        const errors = validationResult(req);

        const { username, password } = req.body;

        if (!errors.isEmpty()) {
            res.status(400).json({ "message": "Bad request", error: errors.array() });
            return;
        }


        if (String(username) === String(ADMIN_USERNAME) && String(password) === String(ADMIN_PASSWORD)) {
            jwt.sign({
                data: {
                    isAdmin: true
                }
            }, 
            JWT_ACCESS_SECRET, 
            {expiresIn: "1 days"},
            function(err, token) {
                if (err) {
                    res.status(500).json({error: err});
                }

                res.status(200).cookie("token", token).json({"message": "Logged in!"});

            });
        } else {
            res.status(401).json({error: "Wrong credentials"});
        }

    })
];
