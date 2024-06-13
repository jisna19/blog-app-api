const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const bcrypt=require("bcryptjs")//for cypher
const {usermodel}=require("./models/blog")
const jwt=require("jsonwebtoken")

const app=express()
app.use(cors())
app.use(express.json())
mongoose.connect("mongodb+srv://jisna19:jisna9947@cluster0.fzxusrj.mongodb.net/blogDB?retryWrites=true&w=majority&appName=Cluster0")


const generateHashedPassword=async(password)=>{
    const salt=await bcrypt.genSalt(10)
    return bcrypt.hash(password,salt)

}

//api for signup
app.post("/signup",async (req,res)=>{
    let input=req.body
    let hashesdPassword=await generateHashedPassword(input.password)
    console.log(hashesdPassword)
    input.password=hashesdPassword
    let blog=new usermodel(input)
    blog.save()
    res.json({"status":"success"})
})

//api for signin
app.post("/signin",(req,res)=>{
    let input=req.body
    usermodel.find({"email":req.body.email}).then(
        (response)=>{
            if (response.length>0) {
                let dbPassword=response[0].password
                console.log(dbPassword)
                bcrypt.compare(input.password,dbPassword,(error,isMatch)=>{
                    if (isMatch) {
                        jwt.sign({email:input.email},"blog-app",{expiresIn:"1d"},
                        (error,token)=>{
                            if (error) {
                                res.json({"status":"unable to create token"})
                            } else {
                                res.json({"status":"success","userid":response[0]._id,"token":token})
                            }
                        })
                    } else {
                        res.json({"status":"incorrect"})
                    }
                })
            } else {
                res.json({"status":"user not found"})
            }
        }
    ).catch()
})

app.listen(8080,()=>{
    console.log("Server started")
})