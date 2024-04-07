require('express-async-errors');

const User = require('../models/User')
const AppError = require('../utils/AppError');
const {
	generateAccessToken,
	generateRefreshToken,
} = require('../utils/generateJWT');
const verifyToken = require('../utils/verifyToken');

const register = async (req, res, next) => {
	const user = req.body;
	console.log(user);
	const email = user.email;
	const OldUser = await User.findOne({ email: email });

	if (OldUser) {
		return next(new AppError('User already exists', 400));
	}
	const newUser = await User.create(user);

	const [token, refreshToken] = await Promise.all([
		generateAccessToken(newUser),
		generateRefreshToken(newUser),
	]);

	res.status(201).json({
		status: 'success',
		token,
		refreshToken,
		data: {
			user,
		},
	});
};

const login = async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password)
		return next(new AppError('Please provide email and password', 400));

	const user = await User.findOne({ email: email }).select('+password');
	if (!user) {
		return next(new AppError('User does not exist', 400));
	}

	const isMatch = await user.comparePassword(password);
	if (!isMatch) {
		return next(new AppError('Invalid credentials', 400));
	}

	const [token, refreshToken] = await Promise.all([
		generateAccessToken(user),
		generateRefreshToken(user),
	]);

	// Set the refresh token in a cookie
	res.cookie('refreshToken', refreshToken, {
		httpOnly: true, // Prevent access from client-side scripts
		secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
		sameSite: 'strict', // Prevent CSRF attacks
		maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days in milliseconds
	});

	res.status(200).json({
		status: 'success',
		message: 'Login successful',
		token,
		refreshToken,
		user: user._id,
	});
};

const updateUserPassword = async (req, res, next) => {
	const password = req.body.password;
	const newPassword = req.body.newPassword;

	const user = await User.findById(req.user.id).select('+password');

	const isCorrectPass = user.comparePassword(password);
	if (!isCorrectPass) {
		return next(new AppError('wrong password!', 400));
	}

	user.password = newPassword;

	await user.save();
	res.status(203).json({
		status: 'success',
		message: 'password updated successfully',
	});
};


const refreshToken = async (req, res, next) => {
	const refreshToken = req.cookies.refreshToken;
	if (!refreshToken) {
		return next(createError(400, 'Refresh token is required'));
	}

	const decoded = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
	if (!decoded || decoded === 'TokenExpiredError') {
		return next(createError(401, 'Invalid refresh token'));
	}

	const user = await User.findById(decoded.userId);
	if (!user) {
		return next(createError(404, 'User not found'));
	}

	const [newToken, newRefreshToken] = await Promise.all([
		generateAccessToken(user),
		generateRefreshToken(user),
	]);

	// Set the refresh token in a cookie
	res.cookie('refreshToken', refreshToken, {
		httpOnly: true, // Prevent access from client-side scripts
		secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
		sameSite: 'strict', // Prevent CSRF attacks
		maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days in milliseconds
	});

	res.status(200).json({
		status: 'success',
		user,
		token: newToken,
		refreshToken: newRefreshToken,
	});
};

const logout = async (req, res, next) => {
	res.clearCookie('refreshToken');
	res.status(200).json({
		status: 'success',
		message: 'Logout successful',
	});
}

module.exports = { login, register, refreshToken, updateUserPassword, logout}