import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

import { users } from "./db.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const verifyToken = async (req, res, next) => {
    const token = req.body.token;
    if (!token) {
        return res.status(403).json({ message: "Missing token" });
    }
    jwt.verify(token, "secret", (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }
        req.user = decoded;
        return next();
    });
};

// Routes
app.get("/users", verifyToken, (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
    }
    res.status(200).json({
        message: "Get all users successfully",
        users,
    });
});

app.post("/signup", (req, res) => {
    if (!req.body.id || !req.body.name || !req.body.age) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    const user = users.find((user) => user.id === req.body.id);
    if (user) {
        return res.status(400).json({ message: "Username already exists" });
    }
    users.push(req.body);
    res.status(200).json({ message: "Signup successfully" });
});

app.post("/login", (req, res) => {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const user = users.find((user) => user.username === req.body.username);
    if (!user) {
        return res
            .status(400)
            .json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ username: user.username }, "secret", {
        expiresIn: "30s",
    });

    res.cookie("token", token, { maxAge: 30 * 1000 });
    res.status(200).json({ message: "Login successfully", user, token });
});

app.post("/logout", (req, res) => {
    res.status(200).json({ message: "Logout successfully" });
});

const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";
app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
