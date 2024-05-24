var jwt = require('jsonwebtoken');
const path = "./config.env"
require('dotenv').config({path:path});



class JWT{
    generateStudentToken(student){ 
        const payload = {studentMail : student.studentMail,role:'Student'};
        return jwt.sign(payload,process.env.SECRET_KEY,{expiresIn:"1h"})
    };
    verifyToken(token){
        return jwt.vverify(token,process.env.SECRET_KEY);
    };
    generateCompanyToken(company){
        const payload ={
            companyMail:company.companyMail,
            role:'Company'

        }
        return jwt.sign(payload,process.env.SECRET_KEY,{expiresIn:"1h"})
    };

    generateCoordinatorToken(coordinator){
        const payload ={
            coordinatorMail:coordinator.coordinatorMail,
            role:'Coordinator'

        }
        return jwt.sign(payload,process.env.SECRET_KEY,{expiresIn:"1h"})
    };
    
    generateSecretariatToken(secretariat){
        const payload ={
            departmentMail:secretariat.departmentMail,
            role:'Department Secretariat'

        }
        return jwt.sign(payload,process.env.SECRET_KEY,{expiresIn:"1h"})
    };

}

module.exports = JWT;