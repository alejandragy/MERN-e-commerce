import { Router } from 'express';
import UserManager from '../dao/UserManager.js';

const router = Router();
const userManager = new UserManager();


router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        await userManager.createUser({ first_name, last_name, email, age, password });
        req.session.failRegister = false;
        return res.redirect('/login')
    } catch (error) {
        req.session.failRegister = true;
        return res.status(500).send({ error: 'Error interno del servidor' });
    }
});

router.post('/login', async (req, res) => {
try{
    const email = req.body.email;
    const pass = req.body.password;
    const user = await userManager.getUserByEmail(email);
    if (!user || pass !== user.password){
        req.session.failLogin = true;
        return res.redirect('/login');
    } 
    delete user.password;
    req.session.user = user;
    return res.redirect('/');
}catch (error){
    req.session.failLogin = true;
    return res.status(500).send({ error: 'Error interno del servidor' });
}
});

export default router;