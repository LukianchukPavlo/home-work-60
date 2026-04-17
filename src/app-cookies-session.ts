// import express, { type Application, type Response, type NextFunction } from 'express';
// import cookieParser from 'cookie-parser';
// import session from 'express-session';

// const app = express();
// app.use(session({
//   secret: 'your-secret-key', // secret key needs to sign the session ID cookie, ensuring its integrity and security
//   resave: false, // it needs to avoid resaving the session if it hasn't been modified, which can improve performance and reduce unnecessary session store operations
//   saveUninitialized: true, // it needs to save uninitialized sessions, which can be useful for implementing features like login sessions or tracking user interactions before they are fully authenticated
//   cookie: {
//     maxAge: 1000 * 5, // 1000 * 60 * 60 * 24, // it needs to set the maxAge for the session cookie, which determines how long the session will be valid before it expires, enhancing security by limiting the lifespan of the session
//     secure: false, // it needs to configure the session cookie, setting secure to false allows the cookie to be sent over non-HTTPS connections, which is suitable for development but should be set to true in production for enhanced security
//     httpOnly: true // it needs to set the httpOnly flag on the session cookie, which helps to prevent client-side scripts from accessing the cookie, enhancing security against cross-site scripting (XSS) attacks
//   } 
// }));

// app.use(cookieParser());

// // Cookies
// app.get('/set-cookie', (req, res) => {
//   res.cookie('user', 'john_doe', { maxAge: 900000, httpOnly: true });

//   res.send('Cookie was set');
// });
// app.get('/get-cookie', (req, res) => {
//   const cookieValue = req.cookies.user;

//   res.send(`Cookie value: ${cookieValue}`);
// });

// app.post('/session/destroy', (req, res) => {
//   req.session.destroy((err) => {
//     if (err) {
//       return res.status(500).send('Error destroying session');
//     }
//     res.send('Session destroyed successfully');
//   });
// });


// app.listen(3000, () => {
//   console.log('Server is running on port 3000');
// });
