// import { jwtVerify, SignJWT } from "jose";

// import { env } from "@/lib/env";

// import { Session } from "../models/session";

// export const signJWT = async (session: Session) => {
//   const jwtToken = await new SignJWT(session)
//     .setProtectedHeader({ alg: "HS256" })
//     .setExpirationTime("1h")
//     .sign(new TextEncoder().encode(env.JWT_SECRET));
//   return jwtToken;
// };

// export const verifyJwt = async (authToken: string): Promise<Session | null> => {
//   if (!authToken) {
//     return null;
//   }

//   try {
//     const decoded = await jwtVerify(authToken, new TextEncoder().encode(env.JWT_SECRET), { algorithms: ["HS256"] });
//     return decoded.payload as Session;
//   } catch (error) {
//     console.log("Failed to verify");
//     console.log(error);
//     return null;
//   }
// };
