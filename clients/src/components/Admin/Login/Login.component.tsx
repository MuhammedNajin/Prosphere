import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { z } from 'zod'; 
import { adminLoginThunk } from '../../../redux';
import { useNavigate } from 'react-router-dom';


const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const handleSubmit = () => {
    try {
    
      loginSchema.parse({ email, password });
      
      dispatch(adminLoginThunk({ email, password }))
      .unwrap()
      .then(() => {
        navigate('/admin')
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        
        const formattedErrors = error.issues.reduce((acc, issue) => {
          acc[issue.path[0] as 'email' | 'password'] = issue.message;
          return acc;
        }, {} as { email?: string; password?: string });
        console.log(formattedErrors);
        
        setErrors(formattedErrors);
      }
    }
  };

  return (
    <div className="flex h-screen">
      <div className="m-auto rounded-lg flex">
        {/* Left side */}
        <div className="p-8 w-1/2">
          <h2 className="text-2xl font-semibold text-blue-500 mb-2">Welcome to Application</h2>
          <h2 className="text-2xl font-semibold text-blue-500 mb-4">Name</h2>
          <p className="text-gray-600 mb-8">A platform of high technology potential to help youth</p>
          
          <div className="mb-8">
            <div className="w-64 h-64 mx-auto rounded-full flex items-center justify-center object-cover">
             <img className='' src="/Loginpage.image.png" alt="" />
            </div>
          </div>
        </div>
        
      
        <div className="p-8 w-1/2 flex flex-col justify-between">
          <div>
            <img src="/api/placeholder/100/50" alt="Intel logo" className="mb-8" />
            
            <p className="text-gray-600 mb-4">Enter your username and password / PIN</p>
            
           <div className='mb-2'>
           <input
              type="text"
              value={email}
              onChange={(e) => {
                setErrors({...errors, email: ''})
                setEmail(e.target.value)
              }}
              placeholder="USERNAME"
              className={`w-full p-2 mb-4 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
           </div>
            {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email}</p>}
            
            <input
              value={password}
              onChange={(e) =>{
                setErrors({...errors, password: ''})
                setPassword(e.target.value)
              }}
              type="password"
              placeholder="PASSWORD / PIN"
              className={`w-full p-2 mb-4 border rounded ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.password && <p className="text-red-500 text-sm mb-2">{errors.password}</p>}
            
            <button onClick={handleSubmit} className="w-full bg-blue-500 text-white p-2 rounded mb-4">
              LOGIN
            </button>
            
            <div className="flex justify-between items-center">
              <label className="flex items-center text-sm text-gray-600">
                <input type="checkbox" className="mr-2" />
                Keep me Logged In
              </label>
              <a href="#" className="text-sm text-blue-500">Forgot Password?</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;