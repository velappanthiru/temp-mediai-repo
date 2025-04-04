import { setCookie, getCookie, deleteCookie } from 'cookies-next';

const cookie_token = 'mediai_token';

export const setCookiesByName = (name, input) => {
  const expires = new Date();
  expires.setDate(expires.getDate() + 365);
  const maxAge = 365 * 24 * 60 * 60;
  const path = '/';

  setCookie(name, input, {
    path,
    expires,
    maxAge,
    // domain:
    //   process.env.NEXT_PUBLIC_ENVIRONMENT === 'local'
    //     ? 'localhost'
    //     : process.env.NEXT_PUBLIC_COOKIE_DOMAIN_NAME,
    secure: false,
  });
};

// export const setCookies = (input) => {
//   const expires = new Date();
//   expires.setDate(expires.getDate() + 7); // Set expiry to 7 days from now
//   const maxAge = 7 * 24 * 60 * 60; // Max-Age in seconds (7 days)
//   const path = '/';

//   setCookie(cookie_token, input, {
//     path,
//     expires,
//     maxAge,
//     domain:
//       process.env.NEXT_PUBLIC_ENVIRONMENT === 'local'
//         ? 'localhost'
//         : process.env.NEXT_PUBLIC_COOKIE_DOMAIN_NAME,
//     secure: true,
//   });
// };

export const setCookies = (accessToken, role) => {
  const expires = new Date();
  expires.setDate(expires.getDate() + 7); // Set expiry to 7 days from now
  const maxAge = 7 * 24 * 60 * 60; // Max-Age in seconds (7 days)
  const path = '/';

  const cookieData = {
    accessToken,
    role, // Set the role in the cookie data
  };

  setCookie(cookie_token, JSON.stringify(cookieData), {
    path,
    expires,
    maxAge,
    // domain:
    //   process.env.NEXT_PUBLIC_ENVIRONMENT === 'local'
    //     ? 'localhost'
    //     : process.env.NEXT_PUBLIC_COOKIE_DOMAIN_NAME,
    secure: false, // Ensure this is set for HTTPS production environment
    // httpOnly: true, // Optional: Makes the cookie inaccessible to JavaScript (security measure)
    // sameSite: 'Strict', // Optional: Helps prevent CSRF attacks
  });
};

export const removeCookiesByName = (name) => {
  deleteCookie(name, {
    path: '/',
    // domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN_NAME,
  });
};
export const getCookiesByName = (referralcode) => {
  return getCookie(referralcode);
};

export const getCookies = () => {
  return getCookie(cookie_token);
};

export const removeCookies = () => {
  deleteCookie(cookie_token, {
    path: '/',
    // domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN_NAME,
  });
};


export const setAccessTokenCookie = (token) => {
  const expires = new Date();
  expires.setHours(expires.getHours() + 1); // Set expiration time to 1 hour from now

  setCookie('accessToken', token, {
    path: '/',
    secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
    expires, // Expiry time set to 1 hour
    maxAge: 3600, // 1 hour in seconds
    // domain: process.env.NEXT_PUBLIC_ENVIRONMENT === 'local' ? 'localhost' : process.env.NEXT_PUBLIC_COOKIE_DOMAIN_NAME,
  });
};



export const getAccessTokenCookie = () => {
  // Retrieve the token from the cookies
  const token = getCookie('accessToken');

  return token;
};


export const removeAccessTokenCookies = () => {
  deleteCookie('accessToken', {
    path: '/',
    // domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN_NAME,
  });
};
