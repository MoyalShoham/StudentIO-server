import { Request, Response } from "express";
import User from "../models/user_model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import dotenv from "dotenv";

dotenv.config();
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';




// var GoogleStrategy = require('passport-google-oauth20').Strategy;


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {

    console.log('Google profile:', profile);
    console.log('Google accessToken:', accessToken);
    console.log('Google refreshToken:', refreshToken);
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      user = new User({
        googleId: profile.id,
        full_name: profile.displayName,
        email: profile.emails[0].value,
        profile_picture: profile.photos[0].value,
        tokens: [accessToken, refreshToken]
      });
      await user.save();
    }

    done(null, user);
  } catch (error) {
    done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

const googleLogin = (req, res) => {
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res);
};

const googleLoginCallback = (req, res, next) => {
  passport.authenticate('google', { failureRedirect: '/login' }, async (err, user) => {
    if (err) {
      console.error('Google authentication error:', err);
      return next(err);
    }
    if (!user) {
      console.error('No user found after Google authentication.');
      return res.redirect('/login');
    }

    req.logIn(user, async (err) => {
      if (err) {
        console.error('Login error:', err);
        return next(err);
      }

      const { accessToken, refreshToken } = generateTokens(user._id.toString());

      if (user.tokens == null) {
        user.tokens = [refreshToken];
      } else {
        user.tokens.push(refreshToken);
      }

      await user.save();

      res.status(200).json({
        accessToken: accessToken,
        refreshToken: refreshToken,
        user
      });
    });
  })(req, res, next);
};


const edit_profile = async (req: Request, res: Response) => {
    const {full_name, profile_picture, gender, email, student } = req.body;
    const _id = req.body.user;
    const newUser = await User.findByIdAndUpdate(_id, 
        {profile_picture: profile_picture, full_name: full_name, gender: gender, email: email, student: student})
    return res.status(200).send(newUser);
};

const delete_profile = async (req: Request, res: Response) => {
    const _id = req.body.user;
    const newUser = await User.findByIdAndDelete(_id);
    return res.status(200).send(newUser);
}

const register = async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;
    const full_name = req.body.full_name;
    const profile_picture = req.body.profile_picture;
    const gender = req.body.gender;
    const faculty = req.body.faculty;
    const year = req.body.year;

    console.log("register");

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

        const newUser = await User.create({
            email: email,
            password: hashedPassword,
            profile_picture: profile_picture,
            full_name: full_name,
            gender: gender,
            faculty: faculty,
            year: year
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
        const res1 = await User.findByIdAndUpdate(user._id, {tokens: []});
        console.log(res1);
        const { accessToken, refreshToken } = generateTokens(user._id.toString());

        if (user.tokens == null) {
            user.tokens = [refreshToken];
        } else {
            user.tokens.push(refreshToken);
        }
        await user.save();
        return res.status(200).send({
            accessToken: accessToken,
            refreshToken: refreshToken,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).send(error.message);
    }
}

const logout = async (req: Request, res: Response) => {
    
    const user = await User.findById(req.body.user);
    if (user.tokens.length > 0){
        await User.findByIdAndUpdate(req.body.user, {tokens: []});
        return res.status(200).send("logged out");
    } else {
        console.log("you already logged out");
        return res.status(400).send("you already logged out");
    }

    
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

const getUsers = async (req: Request, res: Response) => {
    console.log("getUsers");
    const users = await User.find();
    const otherUsers = users.filter(user => user._id != req.body.user);
    return res.status(200).send(otherUsers);
}
const getUser = async (req: Request, res: Response) => {
    console.log("getUser");
    const user = await User.findById(req.body.user);
    return res.status(200).send(user);

}

const getUserById = async (req: Request, res: Response) => {
    console.log(req.params.id)
    const user = await User.findById(req.params.id);
    console.log(user);
    return res.status(200).send(user);
}

const userCheck = async (req: Request, res: Response) => {
    console.log("userCheck");
    return res.status(200).send("user is logged in");
}


export default {
    register,
    login,
    logout,
    refresh,
    edit_profile,
    delete_profile,
    getUsers,
    getUserById,
    getUser,
    userCheck,
    googleLogin,
    googleLoginCallback

}