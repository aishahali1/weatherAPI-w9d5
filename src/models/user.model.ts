import { Schema, Document, ObjectId, model } from "mongoose";
import bcrypt from 'bcryptjs'

export interface UserDocument extends Document {
  _id: ObjectId
  email: string
  passwordHash: string
  role: 'user' | 'admin'
  createdAt: Date
  updatedAt: Date
 comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema = new Schema<UserDocument>(
    {
        email:{
         type: String,
         unique: true,
         required: true,
         trim: true,
        },
        passwordHash:{
         type: String,
         required: true,
        },
        role:{
          type: String,
          enum: ['user', 'admin'],
          default: 'user',
          required: true,
        }
       },
        {
            timestamps: true,
            toJSON:{
                virtuals: true,
                versionKey: false,
                transform: function(doc, ret){
                    return{
                        id: ret.id,
                        email: ret.email,
                        role: ret.role,
                        createdAt: ret.createdAt,
                        updatedAt: ret.updatedAt,
                    }
                }
            },
            toObject:{
                virtuals: true,
                versionKey: false,
                transform: function (doc, ret){
                 return{
                        id: ret.id,
                        email: ret.email,
                        role: ret.role,
                        createdAt: ret.createdAt,
                        updatedAt: ret.updatedAt,
                    }
                }
            }
        }
)

// UserSchema.pre('save', async function (next) {
//     if (!this.isModified('passwordHash')) return next()

//     try{
//     const salt = await bcrypt.genSalt(10)
//     this.passwordHash = await bcrypt.hash(this.passwordHash, salt)
//     return next()
//     }catch (e: any){
//      return next(e)
//     }
// })

// UserSchema.methods.comparePassword = async function (Password: string): Promise <boolean>{
// return bcrypt.compare(Password, this.PasswordHash)
// }

UserSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (e) {
    next(e as Error);
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

export const UsersCollection = model <UserDocument>('User', UserSchema)