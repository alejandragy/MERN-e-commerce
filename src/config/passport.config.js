import passport from 'passport';
import local from 'passport-local';
import GitHubStrategy from 'passport-github2';

import userModel from '../dao/models/userModel.js';
import { createHash, isValidPassword } from '../utils.js';

const localStrategy = local.Strategy;
const initializatePassport = () => {
    const CLIENT_ID = 'Iv1.13f5d3062bf07de1';
    const SECRET_ID = 'ecf907fe941ec2a2c17027af4122c25b47acceb4';

    passport.use('github', new GitHubStrategy({
        clientID: CLIENT_ID,
        clientSecret: SECRET_ID,
        callbackURL: 'http://localhost:8080/api/users/githubcallback'
    },
    async (accesToken, refreshToken, profile, done)=>{
        try{
            console.log(profile);
            let user = await userModel.findOne({username: profile._json.login});
            if (!user){
                let newUser = {
                    username: profile._json.login,
                    first_name: profile._json.name,
                    password: ''
                }
                let result = await userModel.create(newUser);
                done(null, result);
            } 
            else {
                done(null, user);
            }
        }catch (error){
            return done(error);
        }
    }))

    passport.use('register', new localStrategy(
        {
            passReqToCallback: true,
            usernameField: 'email'
        },
        async (req, username, password, done) => {
            const {first_name, last_name, email, age} = req.body;
            try{
                let user = await userModel.findOne({email: username});
                if (user){
                    console.log('Ya existe el usuario');
                    return done(null, false);
                }
                const newUser = {first_name, last_name, email, age, password: createHash(password)} 
                const result = await userModel.create(newUser);

                return done(null, result);
            } catch (error){
                return done(error.message);
            }
        }
    ))

    passport.use('login', new localStrategy(
        {
            usernameField: 'email'
        },
        async (username, password, done) => {
            try{
                const user = await userModel.findOne({email: username});
                if (!user){
                    const errorMessage = 'Usuario inexistente';
                    console.log(errorMessage);
                    return done(errorMessage);
                }

                if(!isValidPassword(user,  password)){
                    return done('Usuario o contraseña incorrectos');
                }

                return done(null, user);
            }catch (error){
                return done(error.message);
            }
        }
    ));

    passport.serializeUser((user, done) => done(null, user._id));

    passport.deserializeUser(async (id, donde) => {
        const user = await userModel.findById(id);
        donde(null, user);
    })
}

export default initializatePassport;