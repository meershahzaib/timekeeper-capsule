
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [view, setView] = useState<"login" | "signup" | "reset">("login");
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center mb-2">
            {view === "login" && "Welcome Back"}
            {view === "signup" && "Create an Account"}
            {view === "reset" && "Reset Password"}
          </DialogTitle>
        </DialogHeader>
        
        {view === "reset" ? (
          <>
            <ResetPasswordForm onSuccess={() => onClose()} />
            <div className="text-center mt-4">
              <button 
                onClick={() => setView("login")}
                className="text-sm text-primary hover:underline"
              >
                Back to login
              </button>
            </div>
          </>
        ) : (
          <>
            <Tabs defaultValue="login" value={view} onValueChange={(v) => setView(v as "login" | "signup")}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <LoginForm onSuccess={() => onClose()} />
                <div className="text-center mt-4">
                  <button 
                    onClick={() => setView("reset")}
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              </TabsContent>
              
              <TabsContent value="signup">
                <SignupForm onSuccess={() => onClose()} />
              </TabsContent>
            </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
