import * as React from "react"

// import { cn } from "@/lib/utils"
// import { Input } from "./input"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { Input } from "./modifiedInput"

export interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  }

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({className,  ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    return (
      <Input 
        type={showPassword ? "text" : "password"} 
        
        suffix={showPassword ? (<button type="button" className="p-2 border border-input rounded-md" onClick={()=> setShowPassword(!showPassword)}><EyeIcon className="select-none w-5 h-5 text-gray-700"  /> </button>): (<button type="button" className="p-2 border border-input rounded-md" onClick={()=> setShowPassword(!showPassword)}><EyeOffIcon className="select-none w-5 h-5  text-gray-400" /></button>)} 
        className={className} 
        {...props} 
        ref={ref} 
      />
    )
  }
)
PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
