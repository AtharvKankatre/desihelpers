import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // The backend redirects here with tokens as query parameters
    const { access_token, refresh_token } = req.query;

    if (access_token && refresh_token) {
        // Set cookies for the tokens
        // Note: In production, use httpOnly cookies for security
        res.setHeader('Set-Cookie', [
            `accessToken=${access_token}; Path=/; Max-Age=${2 * 24 * 60 * 60}; SameSite=Lax`,
            `refreshToken=${refresh_token}; Path=/; Max-Age=${2 * 24 * 60 * 60}; SameSite=Lax`,
            `isActive=true; Path=/; Max-Age=${2 * 24 * 60 * 60}; SameSite=Lax`,
        ]);

        // Redirect to home page after successful login
        res.redirect(302, '/Landing?login=success');
    } else {
        // If tokens are missing, redirect to login with error
        res.redirect(302, '/Login?error=google_auth_failed');
    }
}
