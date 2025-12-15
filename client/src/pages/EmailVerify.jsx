import React, { useContext, useEffect } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios';
import { AppContent } from '../context/AppContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const EmailVerify = () => {

    axios.defaults.withCredentials = true;
    const {backendUrl, isLoggedin, userData, getUserData} = useContext(AppContent);
    const navigate = useNavigate();

    const inputRefs = React.useRef([]);

    // Function to handle typing in an input box
    const handleInput = (e, index)=>{
        // If user typed something AND it's not the last input
        if(e.target.value.length > 0 && index < inputRefs.current.length - 1) {
            // Move focus to the next input box automatically
            inputRefs.current[index + 1].focus();
        }
    }
    // Function runs when a key is pressed inside an input box
    const handleKeyDown = (e, index) =>{
        // Check if the key pressed is BACKSPACE
        // AND the current input box is already empty
        // AND this is NOT the first input box
        if(e.key === 'Backspace' && e.target.value === '' && index > 0) {
            // Move focus to the PREVIOUS input box
            inputRefs.current[index - 1].focus();
        }
    }

    const handlePaste = (e) =>{
        const paste = e.clipboardData.getData('text'); // Get the text the user pasted (for example: "123456")
        const pasteArray = paste.split('');   // Split the pasted text into individual characters → ["1","2","3","4","5","6"]
        pasteArray.forEach((char, index) =>{ // Loop through each character and its position
            if(inputRefs.current[index]) {  // If an input box exists at this position
                inputRefs.current[index].value = char;  // Put the pasted character into that input box
            }
        })
    }

    const onSubmitHandler = async (e) =>{
        try {
           e.preventDefault(); // stop page reload
           const otpArray = inputRefs.current.map(e => e.value)  // Get all input values into an array
           const otp = otpArray.join('')  // Join the array into a single string (e.g. "123456")
           
           const {data} = await axios.post(backendUrl + '/api/auth/verify-account', {otp})
            
           if(data.success) {
            toast.success(data.message)
            getUserData()
             navigate('/')
           } else {
                toast.error(data.message)
           }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(()=>{
        // If the user is logged in
        // AND user data has been loaded
        // AND the account is already verified
        // THEN redirect the user to the home page
        isLoggedin && userData && userData.isAccountVerified && navigate('/')

        // This effect will run whenever:
        // - isLoggedin changes (login / logout)
        // - userData changes (after fetching user info)
    }, [isLoggedin, userData])
  return (
    <div>
       <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400'>
         <img 
                onClick={()=> navigate('/')}
                src={assets.mylogo} 
                alt="" 
                className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'
              /> 
              <form onSubmit={onSubmitHandler} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
                <h1 className='text-white text-2xl font-semibold text-center mb-4'>Email Verify OTP</h1>
                <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit code sent to your email</p>

                <div className='flex justify-between mb-8' onPaste={handlePaste}>
                    {/* Create 6 input boxes dynamically using an array and map */}
                    {Array(6).fill(0).map((_, index) => (
                     <input type="text" maxLength='1' key={index} required  
                     className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md' 

                     // Store this input element in the refs array for focus control
                     ref={e => inputRefs.current[index] = e}

                     // Runs when the user TYPES into the input box
                    // Used to move focus to the next input automatically
                     onInput={(e) => handleInput(e, index)}
                     
                     // Runs when the user PRESSES a key (like Backspace)
                    // Used to move focus to the previous input when deleting
                     onKeyDown={(e) => handleKeyDown(e, index)}/>
                     
))}

                </div>
                <button className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 
                text-white rounded-full cursor-pointer'>Verify email</button> 
                </form> 
                 
       </div>
    </div>
  )
}

export default EmailVerify