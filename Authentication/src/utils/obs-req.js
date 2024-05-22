const axios = require('axios');

const makeLogin = async(email,password) =>{
    try {
        const response = await axios.post('http://localhost:4000/iyte/obs-api/login',{
            email:email,
            password:password
        });
        return response
    } catch (error) {
        throw error;
    }
}

module.exports = makeLogin;