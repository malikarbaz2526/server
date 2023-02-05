
const express=require('express')
const mongoose=require('mongoose')
const app = express()
const cors = require('cors');



app.use(cors());
// =============MIDDLEWARE USE WHEN  POST DATA START====

app.use(express.urlencoded(extended=true))
// middleware use when data post in json formet 
app.use(express.json())


mongoose.connect(
    "mongodb+srv://Arbazs:Nadra786&@cluster0.eiemqke.mongodb.net/dasboard-user"
)

const db = mongoose.connection

db.on('error', (error) => {
    console.log(error)
})

db.once('connected', () => {
    console.log('Database Connected');
})

// ===DB Schema Auth Start======

const dataSchema = new mongoose.Schema({
    name:{
        type:String,
       required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
        
    }
})

const productSchema = new mongoose.Schema({
    name:{
        type:String,
       required:true
    },
    url:{
        type:String,
        
        required:true
    },
   quantity:{
        type:Number,
        required:true
        
    },
    price:{
        type:Number,
        required:true
        
    },

},
{
timestamps:true,
versionKey:false,
id:true,
toJSON:{
    transform(doc,ret){
        ret.id = ret._id
        delete ret._id
    }
}
}
)

// ===DB Schema End======


// ======== DB MODEL START=====
const userModel = new mongoose.model("userlist",dataSchema)
const productModel = new mongoose.model("product-list",productSchema)
// ======== DB MODEL END=====



// DB Auth CREATE
app.post("/user_save", async(req,res)=>{
    const user = new userModel({
        name:req.body.name,
        email:req.body.email,
        password:req.body.pwd,
    })
    
    // try and catch equal to axios.then and axios.catch
    
    try{
        const output = await user.save()
        res.status(200).json(output)
    }
    catch(error){
        res.status(400).json({
            msg:"Error occured",
            logs:error.message
        })
    }
    
       
    })
    
    app.post("/user_login", async(req,res)=>{
        const user = await userModel.findOne({
          
            email:req.body.email,
           
        })
        
       
        if(user){
            if(user.password===req.body.pwd){
                res.status(200).json( {Userdata:user, msg:"User Signin Successfully"})
            }else{
                res.status(400).json({
                    msg:"Incorrect password"
                })
            }
        }else{
            res.status(400).json({
                msg:"User not found"
            })
        }
           

        })
        

// DB product data CREATE
app.post("/product_save", async(req,res)=>{
    const product = new productModel({
        name:req.body.name,
       
        url:req.body.url,
        quantity:req.body.quantity,
        price:req.body.price,
    })
    
    // try and catch equal to axios.then and axios.catch
    
    try{
        const output = await product.save()
        res.status(200).json(output)
    }
    catch(error){
        res.status(400).json({
            msg:"Error occured",
            logs:error.message
        })
    }
    
       
    })
    app.get('/productAll', async (req, res) => {
        try{
            const data = await productModel.find();
            res.json(data)
          
        
        }catch(error){
            res.status(500).json({message: error.message})
        }
    })


app.listen(5000||process.env.PORT,()=>{
    console.log("Server Connected")
})

