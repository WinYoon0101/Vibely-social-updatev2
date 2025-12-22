//Thiết lập Google OAuth2.0 với Passport.js
const passport = require('passport');
const User = require('../model/User');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

passport.use(new GoogleStrategy({
   clientID: process.env.GOOGLE_CLIENT_ID,
   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
   callbackURL: process.env.GOOGLE_CALLBACK_URL,
   passReqToCallback: true
},
   async (req, accessToken, refreshToken, profile, done) => {
      const { emails, displayName, photos } = profile;
      try {
         if (!emails || !emails[0]?.value) {
            return done(new Error('Không thể lấy thông tin email từ Google'));
         }

         //Kiểm tra người dùng đã tồn tại hay chưa
         let user = await User.findOne({ email: emails[0].value });

         if (user) {
            if (!user.profilePicture) {
               user.profilePicture = photos[0]?.value;
               await user.save();
            }
            return done(null, user);
         }

         //Nếu người dùng chưa tồn tại, tạo một user mới với thông tin từ Google
         user = await User.create({
            username: displayName,
            email: emails[0].value,
            profilePicture: photos[0]?.value,
            role: 'user',
            postsCount: 0,
            followerCount: 0,
            followingCount: 0,
            bio: null,
            coverPicture: null,
            password: Math.random().toString(36).slice(-8),
            gender: 'other',
            dateOfBirth: new Date('2000-01-01')
         });

         if (!user) {
            return done(new Error('Không thể tạo người dùng mới'));
         }

         return done(null, user);
      } catch (error) {
         console.error('Google OAuth Error:', error);
         return done(error);
      }
   }
));
module.exports = passport;