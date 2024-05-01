import { Router } from 'express';

import passport from 'passport';

const router = Router();

router.post('/register', passport.authenticate('register', { failureRedirect: '/api/users/failregister' }), async (req, res) => {
    res.redirect('/login');
});

router.get('/failregister', (req, res) => {
    res.status(400).send({
        status: 'error',
        message: 'Registro fallido'
    });
});

router.post('/login', passport.authenticate('login', { failureRedirect: '/api/users/faillogin' }), (req, res) => {
    if (!req.user) {
        return res.send(401).send({
            status: 'error',
            message: 'Error login'
        })
    }

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age
    }

    res.redirect('/products');
});

router.get('/faillogin', (req, res) => {
    res.status(400).send({
        status: 'error',
        message: 'Login fallido'
    })
})

router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (!error) {
            return res.redirect('/');;
        }
        res.send({
            status: 'Logout ERROR',
            body: error,
        });
    });
});

export default router;