const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const bcrypt=require("bcryptjs")//for cypher
const {usermodel}=require("./models/blog")

const app=express()
app.use(cors())
app.use(express.json())
mongoose.connect("mongodb+srv://jisna19:jisna9947@cluster0.fzxusrj.mongodb.net/blogDB?retryWrites=true&w=majority&appName=Cluster0")


const generateHashedPassword=async(password)=>{
    const salt=await bcrypt.genSalt(10)
    return bcrypt.hash(password,salt)

}

app.post("/signup",async (req,res)=>{
    let input=req.body
    let hashesdPassword=await generateHashedPassword(input.password)
    console.log(hashesdPassword)
    input.password=hashesdPassword
    let blog=new usermodel(input)
    blog.save()
    res.json({"status":"success"})
})


app.listen(8080,()=>{
    console.log("Server started")
})