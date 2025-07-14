// "use client";

// import { useSignIn, useSignUp } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";
// import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// interface User {
//   id: string;
//   email: string;
//   username: string;
//   role: string;
// }

// interface AuthContextType {
//   user: User | null;
//   isLoading: boolean;
//   isAuthenticated: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   signup: (email: string, password: string, username: string) => Promise<void>;
//   logout: () => void;
//   verifyEmail: (code: string) => Promise<void>;
//   resetPassword: (email: string) => Promise<void>;
//   updatePassword: (password: string, confirmPassword: string) => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const { isLoaded, signIn, setActive } = useSignIn();
//   const { isLoaded: isLoadedSignUp, signUp, setActive: setActiveSignUp } = useSignUp();

//   const router = useRouter();

//   useEffect(() => {
//     // Check for existing session on mount
//     const checkAuth = async () => {
//       try {
//         // TODO: Check for existing token in localStorage/cookies
//         const token = localStorage.getItem("auth_token");
//         if (token) {
//           // TODO: Validate token with backend
//           // For now, just simulate a user
//           setUser({
//             id: "1",
//             email: "user@example.com",
//             username: "user",
//             role: "user",
//           });
//         }
//       } catch (error) {
//         console.error("Auth check failed:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     checkAuth();
//   }, []);

//   const login = async (email: string, password: string) => {
//     setIsLoading(true);
//     try {
//       // TODO: Replace with actual API call

//       // Start the sign-in process using the email and password provided

//       const signInAttempt = await signIn?.create({
//         identifier: email,
//         password,
//       });

//       // If sign-in process is complete, set the created session as active
//       // and redirect the user
//       if (signInAttempt?.status === "complete") {
//         await setActive?.({ session: signInAttempt?.createdSessionId });
//         router.push("/");
//       } else {
//         // If the status is not complete, check why. User may need to
//         // complete further steps.
//         console.error(JSON.stringify(signInAttempt, null, 2));
//       }

//       // Simulate API call
//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       // Simulate successful login
//       const userData = {
//         id: "1",
//         email,
//         username: email.split("@")[0],
//         role: "user",
//       };

//       setUser(userData);
//       localStorage.setItem("auth_token", "dummy_token");

//       // TODO: Redirect to dashboard
//     } catch (error) {
//       throw new Error("Login failed");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const signup = async (email: string, password: string, username: string) => {
//     setIsLoading(true);
//     try {
//       // Start the sign-up process using the email and password provided
//       await signUp?.create({
//         emailAddress: email,
//         password,
//       });

//       // Send the user an email with the verification code
//       await signUp?.prepareEmailAddressVerification({
//         strategy: "email_code",
//       });

//       // For now, just return success (verification will be handled separately)
//     } catch (error) {
//       throw new Error("Signup failed");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("auth_token");
//     // TODO: Redirect to login page
//   };

//   const verifyEmail = async (code: string) => {
//     setIsLoading(true);
//     try {
//       // TODO: Replace with actual API call
//       console.log("Verifying email:", { code });

//       // Simulate API call
//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       // Simulate successful verification
//       const userData = {
//         id: "1",
//         email: "user@example.com",
//         username: "user",
//         role: "user",
//       };

//       setUser(userData);
//       localStorage.setItem("auth_token", "dummy_token");
//     } catch (error) {
//       throw new Error("Verification failed");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const resetPassword = async (email: string) => {
//     setIsLoading(true);
//     try {
//       // TODO: Replace with actual API call
//       console.log("Resetting password:", { email });

//       // Simulate API call
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//     } catch (error) {
//       throw new Error("Password reset failed");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const updatePassword = async (password: string, confirmPassword: string) => {
//     setIsLoading(true);
//     try {
//       // TODO: Replace with actual API call
//       console.log("Updating password:", { password, confirmPassword });

//       // Simulate API call
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//     } catch (error) {
//       throw new Error("Password update failed");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const value = {
//     user,
//     isLoading,
//     isAuthenticated: !!user,
//     login,
//     signup,
//     logout,
//     verifyEmail,
//     resetPassword,
//     updatePassword,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// }
