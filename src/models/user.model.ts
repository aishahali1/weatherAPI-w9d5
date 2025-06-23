import { Schema, Document, ObjectId, model } from "mongoose";
import bcrypt from 'bcryptjs'

export interface UserDocument extends Document {
  email: string
  passwordHash: string
  role: 'user' | 'admin'
  createdAt: Date
  updatedAt: Date
 comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema = new Schema<UserDocument>(
    {
        email:{type: String, unique: true, required: true},
        passwordHash:{type: String,required: true},
        role:{type: String, enum: ['user', 'admin'], default: 'user', required: true}
       },
        {timestamps: true }
)

UserSchema.pre<UserDocument>('save', async function (next) {
if (!this.isModified('passwordHash')) return next();

  try {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
    next();
  } catch (e) {
    next(e as Error);
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

 const UserCollection = model <UserDocument>('User', UserSchema)
 export default UserCollection