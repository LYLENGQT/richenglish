import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const OTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const inputRefs = useRef([]);

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  useEffect(() => {
    // Redirect back if no email provided
    if (!email) {
      toast.error("Please enter your email first");
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);

    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);

    // Focus last filled input or last input
    const lastIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const onSubmit = async () => {
    if (timeLeft <= 0) {
      toast.error("OTP has expired. Please request a new code.");
      return;
    }

    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      toast.error("Please enter all 6 digits");
      return;
    }

    try {
      const response = await axios.post("/auth/verify-otp", {
        otp: otpCode,
      });

      if (response.data) {
        toast.success("OTP verified successfully");
        navigate("/reset-password", { state: { email } });
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data?.error) {
        const message = error.response.data.error.message;
        toast.error(message);
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    }
  };

  const handleResendEmail = async () => {
    setIsResending(true);

    try {
      const response = await axios.post("/auth/resend-email", { email });

      if (response.data) {
        toast.success("OTP resent to your email");
        setOtp(["", "", "", "", "", ""]);
        setTimeLeft(300); // Reset timer to 5 minutes
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data?.error) {
        const message = error.response.data.error.message;
        toast.error(message);
      } else {
        toast.error("Failed to resend OTP. Please try again.");
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-950 py-12 px-4 sm:px-8 lg:px-12"
      data-aos="fade-up"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.2),_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(125,211,252,0.18),_transparent_55%)]" />

      <div
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white/95 shadow-2xl shadow-blue-900/25 backdrop-blur-lg lg:flex-row"
        data-aos="fade-up"
        data-aos-delay="120"
      >
        {/* Left Panel */}
        <div className="relative hidden w-full max-w-md flex-shrink-0 flex-col justify-between bg-gradient-to-b from-blue-600 via-blue-500 to-indigo-600 p-10 text-white lg:flex">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=900&q=80')] bg-cover bg-center opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-600/80 via-blue-600/70 to-indigo-700/85" />

          <div className="relative z-10 space-y-6">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-full border border-white/40 px-4 py-1 text-xs font-semibold uppercase tracking-[0.45em] text-white/80 transition hover:border-white hover:text-white"
            >
              Rich English
            </Link>
            <div className="space-y-5">
              <h2 className="text-3xl font-semibold leading-tight">
                Check your email for the code.
              </h2>
              <p className="text-white/75">
                We've sent a 6-digit verification code to your email address.
                Enter it below to verify your identity.
              </p>
            </div>
          </div>

          <div className="relative z-10 space-y-3 text-sm text-white/75">
            <p>Need a hand? Email us at support@richenglish.com</p>
            <p>© {new Date().getFullYear()} Rich English</p>
          </div>
        </div>

        {/* Right Panel - OTP Form */}
        <div
          className="w-full bg-white/95 px-8 py-12 sm:px-12 lg:px-16"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <div className="mx-auto w-full max-w-md">
            <Link
              to="/forgot-password"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back
            </Link>

            <div className="mt-8 flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-semibold text-blue-600">
                RE
              </div>
              <h1 className="mt-6 text-3xl font-semibold text-slate-900">
                Enter verification code
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                We sent a code to{" "}
                <span className="font-medium text-slate-700">{email}</span>
              </p>

              {/* Timer Display */}
              <div className="mt-4">
                {timeLeft > 0 ? (
                  <p className="text-sm font-medium text-blue-600">
                    Code expires in {formatTime(timeLeft)}
                  </p>
                ) : (
                  <p className="text-sm font-medium text-rose-500">
                    Code has expired
                  </p>
                )}
              </div>
            </div>

            <form className="mt-10 space-y-8" onSubmit={handleSubmit(onSubmit)}>
              {/* OTP Input Boxes */}
              <div className="flex justify-center gap-2 sm:gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl border-2 border-slate-200 bg-white text-center text-xl font-semibold text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    autoComplete="off"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || otp.some((d) => !d) || timeLeft <= 0}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                {isSubmitting
                  ? "Verifying..."
                  : timeLeft <= 0
                  ? "Code Expired"
                  : "Verify"}
              </button>

              <div className="text-center">
                <p className="text-sm text-slate-500">
                  Didn't receive the code?{" "}
                  <button
                    type="button"
                    onClick={handleResendEmail}
                    disabled={isResending}
                    className="font-semibold text-blue-600 transition hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed underline"
                  >
                    {isResending ? "Resending..." : "Resend Email"}
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTP;
