import mongoose, { Model, Document } from 'mongoose';

// User Interfaces
export interface UserAttrs {
  username: string;
  email: string;
  avatar?: string;
  role?: string;
  status?: 'online' | 'offline' | 'away';
  lastSeen?: Date;
  phone?: string;
  about?: string;
}

export interface UserDoc extends Document {
  username: string;
  email: string;
  avatar: string | null;
  role: string | null;
  status: 'online' | 'offline' | 'away';
  lastSeen: Date;
  phone: string | null;
  about: string | null;
}

export interface UserModel extends Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// User Schema
const UserSchema = new mongoose.Schema<UserDoc, UserModel>({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  avatar: {
    type: String,
    default: null
  },
  role: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'away'],
    default: 'offline'
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  phone: {
    type: String,
    default: null
  },
  about: {
    type: String,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Static build method for User
UserSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

// Create model
const User = mongoose.model<UserDoc, UserModel>('User', UserSchema);

export default User;