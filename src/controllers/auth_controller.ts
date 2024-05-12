import { Request, Response } from "express";
import User from "../models/user_model";
import Student from "../models/student_model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



const edit_profile = async (req: Request, res: Response) => {
    const {full_name, profile_picture, gender, email, password, student } = req.body;
    const _id = req.params.id;

    console.log("full_name" + full_name + " _id" + _id + " profile_picture" + profile_picture)
    const newUser = await User.findByIdAndUpdate(_id, 
        {profile_picture: profile_picture, full_name: full_name, gender: gender, email: email, password: password, student: student})
    return res.status(200).send(newUser);
};

const delete_profile = async (req: Request, res: Response) => {
    const _id = req.params.id;
    const userRef = await User.findById(_id);
    try{
        await Student.findByIdAndDelete(userRef.student);
    }catch(error){ res.status(400).send(error.message); }
    const newUser = await User.findByIdAndDelete(_id);
    return res.status(200).send(newUser);
}

const register = async (req: Request, res: Response) => {
    console.log(req.body);
    const email = req.body.email;
    const password = req.body.password;
    const full_name = req.body.full_name;
    const profile_picture = req.body.profile_picture;
    const gender = req.body.gender;
    const { faculty, year } = req.body.student


    if (email == null || password == null) {
        return res.status(400).send("missing email or password");
    }

    try {
        const user = await User.findOne({ email: email });
        if (user) {
            return res.status(400).send("user already exists");
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newStudent =  await Student.create({
            faculty: faculty,
            year: year,
        });


        const newUser = await User.create({
            email: email,
            password: hashedPassword,
            profile_picture: profile_picture,
            full_name: full_name,
            gender: gender,
            student: newStudent
        });

        return res.status(200).send(newUser);
    } catch (error) {
        console.log(error);
        return res.status(400).send(error.message);
    }
}


const generateTokens = (userId: string): { accessToken: string, refreshToken: string } => {
    const accessToken = jwt.sign({
        _id: userId
    }, process.env.TOKEN_SECRET, {
        expiresIn: process.env.TOKEN_EXPIRATION
    });

    const refreshToken = jwt.sign({
        _id: userId,
        salt: Math.random()
    }, process.env.REFRESH_TOKEN_SECRET);

    return {
        accessToken: accessToken,
        refreshToken: refreshToken
    }
}

const login = async (req: Request, res: Response) => {
    console.log("login");

    const email = req.body.email;
    const password = req.body.password;

    if (email == null || password == null) {
        return res.status(400).send("missing email or password");
    }

    try {
        const user = await User.findOne({ email: email });

        if (user == null) {
            return res.status(400).send("invalid email or password");
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(400).send("invalid email or password");
        }

        const { accessToken, refreshToken } = generateTokens(user._id.toString());

        if (user.tokens == null) {
            user.tokens = [refreshToken];
        } else {
            user.tokens.push(refreshToken);
        }
        await user.save();
        return res.status(200).send({
            accessToken: accessToken,
            refreshToken: refreshToken
        });
    } catch (error) {
        console.log(error);
        return res.status(400).send(error.message);
    }
}

const logout = (req: Request, res: Response) => {
    res.status(400).send("logout");
}

const refresh = async (req: Request, res: Response) => {
    //extract token from http header
    const authHeader = req.headers['authorization'];
    const refreshTokenOrig = authHeader && authHeader.split(' ')[1];

    if (refreshTokenOrig == null) {
        return res.status(401).send("missing token");
    }

    //verify token
    jwt.verify(refreshTokenOrig, process.env.REFRESH_TOKEN_SECRET, async (err, userInfo: { _id: string }) => {
        if (err) {
            return res.status(403).send("invalid token");
        }

        try {
            const user = await User.findById(userInfo._id);
            if (user == null || user.tokens == null || !user.tokens.includes(refreshTokenOrig)) {
                if (user.tokens != null) {
                    user.tokens = [];
                    await user.save();
                }
                return res.status(403).send("invalid token");
            }

            //generate new access token
            const { accessToken, refreshToken } = generateTokens(user._id.toString());

            //update refresh token in db
            user.tokens = user.tokens.filter(token => token != refreshTokenOrig);
            user.tokens.push(refreshToken);
            await user.save();

            //return new access token & new refresh token
            return res.status(200).send({
                accessToken: accessToken,
                refreshToken: refreshToken
            });
        } catch (error) {
            console.log(error);
            return res.status(400).send(error.message);
        }
    });

}


export default {
    register,
    login,
    logout,
    refresh,
    edit_profile,
    delete_profile
}