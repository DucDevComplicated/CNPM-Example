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

const verifyToken = (req, res, next) => {
    // const token = req.cookies.token;
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

const isAdmin = (req, res, next) => {
    const user = users.find((user) => user.username === req.user.username);
    if (!user || !user.isAdmin) {
        return res.status(403).json({ message: "Access denied" });
    }
    return next();
};

const isAuth = (req, res, next) => {
    const user = users.find((user) => user.username === req.user.username);
    if (!user) {
        return res.status(403).json({ message: "Access denied" });
    }
    return next();
};

const isAdminOrAuth = (req, res, next) => {
    const user = users.find((user) => user.username === req.user.username);
    if (!user) {
        return res.status(403).json({ message: "Access denied" });
    }
    if (user.isAdmin || user.username === req.params.username) {
        return next();
    }
    return res.status(403).json({ message: "Access denied" });
};

app.get("/users", [verifyToken, isAdmin], (req, res) => {
    return res.status(200).json({
        message: "Get all users successfully",
        users,
    });
});

app.get("/users/:username", [verifyToken, isAdminOrAuth], (req, res) => {
    const user = users.find((user) => user.username === req.params.username);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
        message: "Get user successfully",
        user,
    });
});

app.post("/signup", (req, res) => {
    if (!req.body.username || !req.body.password || req.body.isAdmin == null) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    const user = users.find((user) => user.username === req.body.username);
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
        expiresIn: "1h",
    });

    // res.cookie("token", token, { maxAge: 30 * 1000 });
    res.status(200).json({ message: "Login successfully", user, token });
});

app.post("/logout", isAuth, (req, res) => {
    // res.clearCookie("token");
    res.status(200).json({ message: "Logout successfully" });
});

const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";
app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
