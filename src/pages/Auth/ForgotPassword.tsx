import type React from "react"
import { useState, type FormEvent } from "react"
import { Mail } from "lucide-react"
import LOGO from '../../assets/LOGO.svg';

interface ForgotPasswordProps {
  onSubmit?: (email: string) => void
  onReturnToSignIn?: () => void
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onSubmit, onReturnToSignIn }) => {
  const [email, setEmail] = useState<string>("")

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit(email)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5] p-4">
      <div className="w-full max-w-md rounded-2xl border border-[#dfdfdf] bg-white p-8 shadow-sm">
        <div className="mb-8 flex justify-center">
          <div className="relative h-16 w-64">
            <img src={LOGO} alt="Enchanted Weddings" className="h-full w-full object-contain" />
          </div>
        </div>

        <h1 className="mb-4 text-center text-xl font-medium text-[#000000]">Forgot your password</h1>

        <p className="mb-6 text-center text-[#404040]">
          Please enter your email address associated with your account. We'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <div className="flex w-full items-center rounded-md border border-[#cbcbcb] px-3 py-2 focus-within:border-[#c3937c] focus-within:ring-1 focus-within:ring-[#c3937c]">
              <Mail className="mr-2 h-5 w-5 text-[#868686]" />
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 border-0 bg-transparent outline-none placeholder:text-[#868686] focus:outline-none focus:ring-0"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="mb-6 w-full rounded-[100px] bg-[#e3b186] py-3 text-[#505050] font-[600] hover:bg-[#dfdfdf] transition-colors cursor-pointer" 
          >
            Send
          </button>
        </form>

        <div className="text-center">
          <button onClick={onReturnToSignIn} className="mb-6 w-full rounded-[100px] font-[600] bg-[#f5f5f5] py-3 text-[#505050] hover:bg-[#dfdfdf] transition-colors cursor-pointer">
            Return to sign in
          </button>
        </div>
      </div>
    </div>
  )
}
// mb-6 w-full rounded-[100px] bg-[#f5f5f5] py-3 text-[#505050] hover:bg-[#dfdfdf] transition-colors cursor-pointer

export default ForgotPassword

