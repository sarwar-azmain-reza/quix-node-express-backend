import express from 'express';
import database from '../db/mongodb.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
var router = express.Router();

const userCollection = database.collection("users");

try {
    router.post('/register', async (req, res) => {

        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10)

            const newUser = {
                email: req.body.email,
                role: 'user',
                password: hashedPassword,
            };
            // console.log(newUser)
            const query = { email: req.body.email };

            const foundUser = await userCollection.findOne(query);

            if (!foundUser) {
                console.log("User not found");
                const result = await userCollection.insertOne(newUser);
                return res.status(200).json({
                    success: true,
                    message: "Signup successful!",
                });
            }
            res.send({ success: false, alreadyStored: "Email Already in use!" });
        } catch (err) {
            console.log(err);
            res.json({ success: false, error: 'Duplicate email' })
        }
    });


    router.post('/login', async (req, res) => {
        const user = await userCollection.findOne({
            email: req.body.email,
        })

        if (!user) {
            return res.json({ success: false, error: 'Invalid login' });
        }

        const isPasswordValid = await bcrypt.compare(
            req.body.password,
            user.password
        )

        if (isPasswordValid) {
            const token = jwt.sign(
                {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN,
            }
            )

            return res.json({ success: true, user_token: token, message: 'Login Successful' })
        } else {
            return res.json({ success: false, user: false, message: 'Invalid login' })
        }
    });

}
catch (error) {
    console.error(error);
}

export default router;
