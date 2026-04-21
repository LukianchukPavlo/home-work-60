import 'cookie-session';
declare module 'cookie-session' {
  interface CookieSessionObject {
    jwt?: string;
  }
}

declare global {
  namespace Express {
    interface Request {
      session: CookieSessionInterfaces.CookieSessionObject & {
        jwt?: string;
      } | null;
    }
  }
}
