import mongoose from 'mongoose'

export const connect = async ():Promise<void>=>{
    try{
        const uri = process.env.MONGODB_URI
          if(!uri){
         throw new Error('MONGODB_URI is not defined in the environment variables');
        }
        await mongoose.connect(uri)
        console.log("connected to Database");
        
    }catch (e){
     console.error('Database connection error:', e);
     
    }
}