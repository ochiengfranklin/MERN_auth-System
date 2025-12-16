import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
const port = process.env.PORT || 4000;
connectDB();

// Allowed origins for CORS
const allowedOrigins = [
    'http://localhost:5173',
    'https://mern-auth-system-neih.onrender.com',
    'https://mern-auth-system-gamma.vercel.app'
];

// CORS middleware
app.use(cors({
    origin: function(origin, callback){
        if(allowedOrigins.includes(origin) || !origin) {
            callback(null, true); // allow request
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// API endpoints
app.get('/', (req, res) => {
    res.send('Api working fine');
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.listen(port, () => {
    console.log(`Server listening on PORT: ${port}`);
});
