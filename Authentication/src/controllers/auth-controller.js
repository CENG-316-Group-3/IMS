const Student = require('../models/Student');
const makeLogin = require('../utils/obs-req');
const JWT = require('../utils/jwt');
const jwt = new JWT();

//student login-register
exports.login = async(req,res) =>{
    try {       
        const {email,password} = req.body;
        var isNew = false;
        const loginResponse = await makeLogin(email,password);
        if(loginResponse.data.status ==='success'){
            var student = await Student.findOne({where:{studentMail:email}});
            if(!student){
                const newStudent = await Student.create({
                    studentMail:loginResponse.data.loggedStudent.studentMail,
                    studentNumber:loginResponse.data.loggedStudent.studentNumber,
                    firstName:loginResponse.data.loggedStudent.firstName,
                    lastName:loginResponse.data.loggedStudent.lastName               
                });
                student = newStudent;
                isNew = true
                

            }
            //genereate token
            const token = await jwt.generateStudentToken(student);


            //set cookie
            res.cookie('token',token,{httpOnly:true,secure:true});
            res.status(200).json({
                status:'success',
                loggedStudent:student,
                token:token,
                isNew : isNew
        
                });
            
        }else{
            throw new Error('not found');
        }
    
    } catch (error) {
        res.status(400).json({
            status:'fail',
            error:error

        });
    }


}


//student logout
//LOGOUT
exports.logout = async(req,res) =>{
    try {
    
        //inaktif token
        res.cookie('token', '', { httpOnly: true, maxAge: 0 });
        res.status(200).json({
            status:'success',
            message:"logout successfull"
        })
        
    } catch (error) {
        res.status(400).json({
            error:error
        });
    }
}


//check-user
exports.checkUser = async(req,res) =>{
    try {
        const token = req.cookies.token; // take token from cookies
        console.log(token);

        if(!token){
            console.log('su an burda');
            res.status(401).json({ success: 'false' });
        }
        const decoded = await jwt.verifyToken(token)
        req.user = decoded;
        
        res.status(200).json({
            status:'success',
            user:decoded
        })
        
    } catch (error) {
        
        
    }
}