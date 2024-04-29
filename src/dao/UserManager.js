import userModel from './models/userModel.js';

class UserManager {
    async createUser(user){
        const { first_name, last_name, email, age, password } = user;

        try{
            const result = await userModel.create({
                first_name,
                last_name, 
                email,
                age,
                password
            })
            return result;
        } catch(error){
            console.error(error.message);
            throw new Error('Error al crear usuario');
        }
    }

    async getUserByEmail(email) {
        try {
            const user = await userModel.findOne({email: email});
            console.log(user);
            if (!user) {
                throw new Error(`El usuario no existe`);
            }
            return user;
        } catch (error) {
            console.error('Error al obtener usuario', error);
        }
    }
}

export default UserManager;