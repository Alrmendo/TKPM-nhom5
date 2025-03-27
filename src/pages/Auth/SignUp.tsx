import type React from "react"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

interface InputFieldProps {
  id: string
  label: string
  type: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
}

const InputField: React.FC<InputFieldProps> = ({ id, label, type, value, onChange, placeholder }) => {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-[#404040]">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-3 border border-[#dfdfdf] rounded-md"
      />
    </div>
  )
}

interface PasswordFieldProps {
  id: string
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
}

const PasswordField: React.FC<PasswordFieldProps> = ({ id, label, value, onChange, placeholder }) => {
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-[#404040]">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full p-3 border border-[#dfdfdf] rounded-md pr-10"
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#868686]"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      <p className="text-sm text-[#868686]">Use 8 or more characters with a mix of letters, numbers & symbols</p>
    </div>
  )
}

interface SocialButtonProps {
  icon: React.ReactNode
  text: string
  onClick: () => void
}

const SocialButton: React.FC<SocialButtonProps> = ({ icon, text, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full border border-[#dfdfdf] rounded-full py-3 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
    >
      {icon}
      <span className="text-[#404040]">{text}</span>
    </button>
  )
}

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add your form submission logic here
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
    // Add your social login logic here
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Mobile & Desktop: Hình ảnh */}
      <div className="w-full lg:w-1/2">
        <div className="h-64 lg:h-full relative">
          <img
            src="https://aocuoimailisa.vn/wp-content/uploads/2023/12/hinh-anh-cuoi-ngoai-canh-682x1024.jpg"
            alt="Bride in wedding dress"
            className="object-cover h-full w-full"
          />
        </div>
      </div>

      {/* Form đăng ký */}
      <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <h1 className="text-[#c3937c] text-4xl font-medium mb-2">Sign up</h1>
          <p className="mb-8 text-[#404040]">
            Already have an account?{" "}
            <a href="#" className="text-[#c3937c] hover:underline">
              Log in
            </a>
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <InputField
              id="username"
              label="User name"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
            />

            <InputField
              id="email"
              label="Email address"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
            />

            <PasswordField
              id="password"
              label="Password"
              value={formData.password}
              onChange={handleInputChange}
            />

            <button
              type="submit"
              className="w-full bg-[#ead9c9] text-[#404040] py-3 rounded-full hover:bg-[#c3937c] hover:text-white transition-colors"
            >
              Create an account
            </button>
          </form>

          <div className="my-6 text-center text-[#868686]">Or</div>

          <div className="space-y-4">
            <SocialButton
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              }
              text="Login with Google"
              onClick={() => handleSocialLogin("Google")}
            />

            <SocialButton
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="#1877F2"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              }
              text="Login with facebook"
              onClick={() => handleSocialLogin("Facebook")}
            />

            <SocialButton
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="#000000"
                >
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z" />
                </svg>
              }
              text="Login with Apple ID"
              onClick={() => handleSocialLogin("Apple")}
            />
          </div>

          <div className="mt-8 text-center text-sm">
            <p className="text-[#868686]">
              New to ENCOUNTED WEDDING?{" "}
              <a href="#" className="text-[#c3937c] hover:underline">
                Sign Up
              </a>
            </p>
            <p className="mt-2 text-[#868686]">
              Signing up means you agree to the{" "}
              <a href="#" className="text-[#c3937c] hover:underline">
                Privacy policy
              </a>
              ,{" "}
              <a href="#" className="text-[#c3937c] hover:underline">
                Terms of Services
              </a>{" "}
              and{" "}
              <a href="#" className="text-[#c3937c] hover:underline">
                Affiliate Terms
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


export default SignUp

