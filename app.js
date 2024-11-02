import express from 'express';
import multer from 'multer';
import Tesseract from 'tesseract.js';
import path from 'path';


const app=express();
const port=3000;


app.use(express.static("public"));

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'public/uploads/');
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+path.extname(file.originalname));
    },
});

const upload=multer({
    storage:storage,
    fileFilter:(req,file,cb)=>{
        const filetypes=/jpeg|jpg|png|gif/;
        const mimetype=filetypes.test(file.mimetype);
        const extname=filetypes.test(path.extname(file.originalname).toLowerCase());

        if(mimetype && extname){
            return cb(null,true);
        }
        cb("Error:file upload only support "+filetypes);
    },
})

app.get('/',(req,res)=>{
    res.sendFile("index.html")
});

app.post("/upload",upload.single('image'),(req,res)=>{
    try{
        const imagePath = `public/uploads/${req.file.filename}`;
        Tesseract.recognize(imagePath, 'eng', {
            logger: (m) => console.log(m), 
        })
            .then(({ data: { text } }) => {
                res.json({
                    message:text,
                    filename:req.file.filename,
                });
                console.log("Extracted Text:");
                console.log(text);
            })
            .catch((error) => {
                console.error("Error extracting text:", error);
                res.status(500).send("Error in extracting text");
            });
       
        
    }catch(err){
        res.status(500).send("Server Error");
    }
    
});



app.listen(port,()=>{
    console.log(`server is listned on ${port}`);
})