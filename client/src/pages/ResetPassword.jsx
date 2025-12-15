import React, { useContext, useState, useRef } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const { backendUrl } = useContext(AppContent);
  axios.defaults.withCredentials = true; // allow cookies to be sent with requests

  const navigate = useNavigate();

  // --- STATES ---
  const [email, setEmail] = useState(''); // stores the email input
  const [newPassword, setNewPassword] = useState(''); // stores new password input
  const [isEmailSent, setIsEmailSent] = useState(false); // true after OTP email is sent
  const [otp, setOtp] = useState(''); // stores the OTP entered by user
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false); // true after OTP is submitted

  const inputRefs = useRef([]); // ref array for each OTP input box

  // --- OTP INPUT HANDLERS ---

  // Moves focus automatically to next input box when user types
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus(); // focus next input
    }
  };

  // Handles backspace to move focus to previous input if current is empty
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus(); // focus previous input
    }
  };

  // Handles pasting OTP (like "123456") and filling inputs automatically
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text'); // get pasted text
    const pasteArray = paste.split(''); // split into characters
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char; // set each input value
      }
    });
  };

  // --- FORM SUBMIT HANDLERS ---

  // Send OTP to email
  const onSubmitEmail = async (e) => {
    e.preventDefault(); // prevent page reload
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/send-reset-otp', { email });
      // Show toast message based on success
      data.success ? toast.success(data.message) : toast.error(data.message);
      if (data.success) setIsEmailSent(true); // show OTP form
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Collect OTP from inputs and mark OTP submitted
  const onSubmitOtp = (e) => {
    e.preventDefault(); // prevent page reload
    const otpArray = inputRefs.current.map((input) => input.value); // get values of inputs
    setOtp(otpArray.join('')); // join into single string
    setIsOtpSubmitted(true); // show new password form
  };

  // Submit new password to backend
  const onSubmitNewPassword = async (e) => {
    e.preventDefault(); // prevent page reload
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/reset-password', {
        email,
        otp,
        newPassword,
      });
      data.success ? toast.success(data.message) : toast.error(data.message);

      if (data.success) {
        // Reset states so forms don't retain old values
        setEmail('');
        setNewPassword('');
        setOtp('');
        setIsEmailSent(false);
        setIsOtpSubmitted(false);

        navigate('/login'); // redirect to login page
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
      {/* Logo that navigates home */}
      <img
        onClick={() => navigate('/')}
        src={assets.mylogo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

      {/* --- EMAIL FORM --- */}
      {!isEmailSent && (
        <form
          onSubmit={onSubmitEmail} // triggers OTP email
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">Reset password</h1>
          <p className="text-center mb-6 text-indigo-300">Enter your email</p>

          {/* Email input with*/}
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.envelope_icon} alt="" className="w-4 h-4" />
            <input
              type="email"
              placeholder="Email"
              className="bg-transparent outline-none text-white"
              value={email} // bind to state
              onChange={(e) => setEmail(e.target.value)} // update state on change
              required
            />
          </div>
          <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 rounded-full cursor-pointer mt-3 text-white">
            Submit
          </button>
        </form>
      )}

      {/* --- OTP FORM --- */}
      {!isOtpSubmitted && isEmailSent && (
        <form onSubmit={onSubmitOtp} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
          <h1 className="text-white text-2xl font-semibold text-center mb-4">Reset password OTP</h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter the 6-digit code sent to your email
          </p>

          <div className="flex justify-between mb-8" onPaste={handlePaste}>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  type="text"
                  maxLength="1"
                  key={index}
                  required
                  className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
                  ref={(el) => (inputRefs.current[index] = el)} // store ref for focus control
                  onInput={(e) => handleInput(e, index)} // move focus to next input
                  onKeyDown={(e) => handleKeyDown(e, index)} // handle backspace focus
                />
              ))}
          </div>
          <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full cursor-pointer">
            Submit
          </button>
        </form>
      )}

      {/* --- NEW PASSWORD FORM --- */}
      {isOtpSubmitted && isEmailSent && (
        <form onSubmit={onSubmitNewPassword} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
          <h1 className="text-white text-2xl font-semibold text-center mb-4">New password</h1>
          <p className="text-center mb-6 text-indigo-300">Enter your new password</p>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock} alt="" className="w-4 h-4" />
            <input
              type="password"
              placeholder="Password"
              className="bg-transparent outline-none text-white"
              value={newPassword} // bind to state
              onChange={(e) => setNewPassword(e.target.value)} // update state
              required
            />
          </div>
          <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 rounded-full cursor-pointer mt-3 text-white">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
