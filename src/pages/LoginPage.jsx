import React, { FormEvent, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  User,
  Heart,
  LayoutDashboard
} from "lucide-react";
import BrandLogo from "../components/BrandLogo";
import { stateList, locationsByState } from "../lib/locationData";
import { clinicalQuotes } from "../lib/cardioMockData";

const roles = ["Cardiologist", "Patient / Citizen", "Medical Researcher"];

export default function LoginPage({ onNavigateToHome, onLoginSuccess }) {
  // Mode: "login" or "signup"
  const [isSignUp, setIsSignUp] = useState(false);
  // Step: "form" or "otp"
  const [signUpStep, setSignUpStep] = useState("form");

  // Form states
  const [name, setName] = useState("");
  const [selectedState, setSelectedState] = useState(stateList[0]);
  const [selectedDistrict, setSelectedDistrict] = useState(locationsByState[stateList[0]][0]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Cardiologist");
  const [operatorCode, setOperatorCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // OTP states
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpCountdown, setOtpCountdown] = useState(60);
  const otpInputRefs = useRef([]);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Testimonial quote carousel index
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Update district options when state changes
  useEffect(() => {
    const list = locationsByState[selectedState] || [];
    if (list.length > 0) {
      setSelectedDistrict(list[0]);
    }
  }, [selectedState]);

  // OTP Countdown timer
  useEffect(() => {
    let timer;
    if (signUpStep === "otp" && otpCountdown > 0) {
      timer = setInterval(() => {
        setOtpCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [signUpStep, otpCountdown]);

  // Auto-advance quote carousel every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % clinicalQuotes.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleSendOtp = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password || (isSignUp && !name)) {
      setError("Please fill in all required fields.");
      return;
    }

    if (role === "Cardiologist" && operatorCode.length > 0 && operatorCode !== "CLINIC2026") {
      // Optional check demo code
    }

    // Generate random 6-digit OTP demo
    const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(mockOtp);
    setSignUpStep("otp");
    setOtpCountdown(60);
    setSuccessMessage(`Demo Verification OTP sent to ${email}: [ ${mockOtp} ]`);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const entered = otpDigits.join("");
    if (entered.length < 6) {
      setError("Please enter the complete 6-digit OTP code.");
      return;
    }

    if (entered !== generatedOtp && entered !== "123456") {
      setError("Invalid OTP verification code. Try demo code '123456' or the generated code above.");
      return;
    }

    setSuccessMessage("Authentication successful! Opening CardioVision Studio...");
    
    setTimeout(() => {
      onLoginSuccess({
        name: isSignUp ? name : (email.split("@")[0] || "Dr. User"),
        email,
        role,
        state: selectedState,
        district: selectedDistrict,
      });
    }, 1000);
  };

  const handleOtpDigitChange = (index, val) => {
    if (!/^\d*$/.test(val)) return;

    const nextDigits = [...otpDigits];
    nextDigits[index] = val.slice(-1);
    setOtpDigits(nextDigits);

    if (val && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] flex items-center justify-center p-4 sm:p-6 relative overflow-y-auto">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.12)_0%,_transparent_70%)] pointer-events-none" />

      {/* Top back button */}
      <button
        onClick={onNavigateToHome}
        className="absolute top-6 left-6 h-10 px-4 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-sky-300 hover:border-sky-500/40 text-xs font-mono font-bold flex items-center gap-2 transition-all backdrop-blur-md cursor-pointer z-50"
      >
        <ArrowLeft size={16} /> Back to Landing Page
      </button>

      {/* Split Card Container */}
      <div className="w-full max-w-4xl bg-slate-900/95 border border-sky-500/20 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10 my-12">
        {/* Left Visual Card (5 Cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 p-8 flex flex-col justify-between relative overflow-hidden min-h-[340px] lg:min-h-[560px]">
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-40" />
          
          <div className="relative z-10">
            <BrandLogo showText={true} title="CARDIOVISION" subtitle="CLINICAL AUTH" size={42} />
            
            <div className="mt-8">
              <span className="px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-300 font-mono text-[10px] font-bold uppercase tracking-widest inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
                SPLIT-CARD CLINICAL AUTH
              </span>
            </div>
          </div>

          {/* Quote Slider */}
          <div className="relative z-10 my-8">
            <h3 className="text-lg font-bold text-white leading-snug transition-all duration-500">
              "{clinicalQuotes[quoteIndex].title}"
            </h3>
            <p className="text-xs text-sky-200/80 font-sans mt-2 leading-relaxed">
              {clinicalQuotes[quoteIndex].subtitle}
            </p>

            <div className="flex gap-1.5 mt-6">
              {clinicalQuotes.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setQuoteIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    quoteIndex === idx ? "w-6 bg-sky-400" : "w-1.5 bg-white/20"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>HIPAA Compliant</span>
            <span>256-Bit Encrypted Session</span>
          </div>
        </div>

        {/* Right Form Card (7 Cols) */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          {/* Header Switcher */}
          <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
            <div className="flex gap-6 font-mono text-sm font-bold">
              <button
                onClick={() => {
                  setIsSignUp(false);
                  setSignUpStep("form");
                  setError("");
                }}
                className={`pb-1 transition-all cursor-pointer ${
                  !isSignUp ? "text-sky-400 border-b-2 border-sky-400" : "text-slate-400 hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setIsSignUp(true);
                  setSignUpStep("form");
                  setError("");
                }}
                className={`pb-1 transition-all cursor-pointer ${
                  isSignUp ? "text-sky-400 border-b-2 border-sky-400" : "text-slate-400 hover:text-white"
                }`}
              >
                Create Account
              </button>
            </div>
          </div>

          {/* Error / Success Notifications */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
              <ShieldAlert size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
              <ShieldCheck size={16} className="shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form Step: Input Details */}
          {signUpStep === "form" ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              {/* Role selector */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-sky-300/80 mb-1.5">
                  Select User Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {roles.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`h-9 px-2 rounded-lg text-[11px] font-mono font-bold transition-all border cursor-pointer truncate ${
                        role === r
                          ? "bg-sky-500/20 border-sky-400 text-sky-300"
                          : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {isSignUp && (
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-sky-300/80 mb-1.5">
                    Full Practitioner / Patient Name
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="Dr. Sarah Jenkins"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-10 pl-10 pr-4 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* State & Location Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-sky-300/80 mb-1.5">
                    State / Region
                  </label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-white/15 text-white text-xs focus:outline-none focus:border-sky-400 cursor-pointer"
                  >
                    {stateList.map((st) => (
                      <option key={st} value={st} className="bg-slate-900 text-white">
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-sky-300/80 mb-1.5">
                    Clinical Center / City
                  </label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-white/15 text-white text-xs focus:outline-none focus:border-sky-400 cursor-pointer"
                  >
                    {(locationsByState[selectedState] || []).map((loc) => (
                      <option key={loc} value={loc} className="bg-slate-900 text-white">
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-sky-300/80 mb-1.5">
                  Clinical Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="doctor@hospital.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-sky-300/80 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-10 pl-10 pr-10 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Practitioner Code if Cardiologist */}
              {role === "Cardiologist" && (
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-amber-300/90 mb-1.5">
                    Medical NPI / Access Code (Optional Demo: CLINIC2026)
                  </label>
                  <div className="relative">
                    <KeyRound size={16} className="absolute left-3.5 top-3 text-amber-400/60" />
                    <input
                      type="password"
                      placeholder="CLINIC2026"
                      value={operatorCode}
                      onChange={(e) => setOperatorCode(e.target.value)}
                      className="w-full h-10 pl-10 pr-4 rounded-xl bg-amber-500/5 border border-amber-500/30 text-amber-200 text-xs placeholder:text-amber-300/30 focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full h-11 mt-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-sky-500/20 active:scale-95 cursor-pointer"
              >
                <span>Send OTP Verification</span>
                <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            /* OTP Verification Step */
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="text-center">
                <div className="h-12 w-12 rounded-full bg-sky-500/20 border border-sky-400/40 text-sky-300 flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck size={24} />
                </div>
                <h4 className="text-lg font-bold text-white">Enter OTP Code</h4>
                <p className="text-xs text-slate-400 font-sans mt-1">
                  We sent a 6-digit clinical verification code to <span className="text-sky-300 font-mono">{email}</span>
                </p>
              </div>

              {/* 6 Digit Inputs */}
              <div className="flex justify-center gap-2 my-4">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpInputRefs.current[idx] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                    className="w-10 h-12 text-center rounded-xl bg-white/5 border border-white/20 text-white font-mono text-lg font-bold focus:border-sky-400 focus:bg-sky-500/10 focus:outline-none transition-all"
                  />
                ))}
              </div>

              <div className="text-center font-mono text-xs text-slate-400">
                {otpCountdown > 0 ? (
                  <span>Resend code in {otpCountdown}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
                      setGeneratedOtp(mockOtp);
                      setOtpCountdown(60);
                      setSuccessMessage(`New OTP sent: [ ${mockOtp} ]`);
                    }}
                    className="text-sky-400 hover:underline flex items-center gap-1 mx-auto cursor-pointer"
                  >
                    <RotateCcw size={12} /> Resend OTP Code
                  </button>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setSignUpStep("form")}
                  className="w-1/3 h-11 rounded-xl border border-white/20 text-slate-300 hover:text-white text-xs font-mono font-bold cursor-pointer"
                >
                  Edit Details
                </button>
                <button
                  type="submit"
                  className="w-2/3 h-11 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-sky-500/20"
                >
                  Verify &amp; Enter Studio <Check size={16} />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
