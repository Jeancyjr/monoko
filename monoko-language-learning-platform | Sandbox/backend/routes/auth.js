const express = require('express');
const { validate } = require('../middleware/validation');
const { 
  registerUser, 
  loginUser, 
  refreshToken, 
  logoutUser,
  authenticate 
} = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/register - Register new user
router.post('/register', validate('registerUser'), async (req, res) => {
  try {
    const result = await registerUser(req.body);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: result.user,
        accessToken: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Registration Failed',
      message: error.message
    });
  }
});

// POST /api/auth/login - User login
router.post('/login', validate('loginUser'), async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: result.user,
        accessToken: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Login Failed',
      message: error.message
    });
  }
});

// POST /api/auth/refresh - Refresh access token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken: refreshTokenString } = req.body;
    
    if (!refreshTokenString) {
      return res.status(400).json({
        success: false,
        error: 'Missing Token',
        message: 'Refresh token is required'
      });
    }
    
    const result = await refreshToken(refreshTokenString);
    
    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        user: result.user,
        accessToken: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Token Refresh Failed',
      message: error.message
    });
  }
});

// POST /api/auth/logout - Logout user
router.post('/logout', async (req, res) => {
  try {
    const { refreshToken: refreshTokenString } = req.body;
    
    if (refreshTokenString) {
      logoutUser(refreshTokenString);
    }
    
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Logout Failed',
      message: error.message
    });
  }
});

// GET /api/auth/me - Get current user profile
router.get('/me', authenticate, (req, res) => {
  try {
    const { password, ...userWithoutPassword } = req.user;
    
    res.json({
      success: true,
      data: {
        user: userWithoutPassword
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Profile Fetch Failed',
      message: error.message
    });
  }
});

// POST /api/auth/change-password - Change user password
router.post('/change-password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Missing Data',
        message: 'Current password and new password are required'
      });
    }
    
    // Validate new password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/;
    if (newPassword.length < 8 || !passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        error: 'Weak Password',
        message: 'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character'
      });
    }
    
    // For demo purposes, just return success
    // In production, implement proper password change logic
    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Password Change Failed',
      message: error.message
    });
  }
});

// POST /api/auth/verify-email - Verify email address (placeholder)
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Missing Token',
        message: 'Verification token is required'
      });
    }
    
    // Placeholder for email verification
    res.json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Email Verification Failed',
      message: error.message
    });
  }
});

// POST /api/auth/forgot-password - Request password reset
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Missing Email',
        message: 'Email address is required'
      });
    }
    
    // Placeholder for password reset
    res.json({
      success: true,
      message: 'Password reset instructions sent to your email'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Password Reset Failed',
      message: error.message
    });
  }
});

// POST /api/auth/reset-password - Reset password with token
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Missing Data',
        message: 'Reset token and new password are required'
      });
    }
    
    // Placeholder for password reset
    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Password Reset Failed',
      message: error.message
    });
  }
});

module.exports = router;
