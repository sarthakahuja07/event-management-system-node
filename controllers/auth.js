const Users = require("../models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
	const { username, password, email } = req.body;

	if (!username) {
		return res.status(400).json({
			message: "Invalid username"
		});
	}
	if (!password) {
		return res.status(400).json({
			message: "Invalid Password"
		});
	}

	const hashedPassword = await bcrypt.hash(
		password,
		parseInt(process.env.BCRYPT_SALT)
	);

	const user = new Users({
		username,
		password: hashedPassword,
		email
	});
	try {
		const newUser = await user.save();
		if (newUser) {
			return res.status(201).json(newUser);
		} else {
			return res.status(500).json({
				message: "User not created"
			});
		}
	} catch (err) {
		return res.status(500).json({
			message: err
		});
	}
};

const loginUser = async (req, res) => {
	const { username, password } = req.body;
	const user = await Users.findOne({ username });

	if (!user) {
		return res.status(401).json("user not found");
	}

	if (await bcrypt.compare(password, user.password)) {
		const token = jwt.sign(
			{
				id: user._id,
				username: user.username
			},
			process.env.JWT_SECRET,
			{ expiresIn: "365d" }
		);
		const { password, ...others } = user._doc;
		res.cookie("jwt", token, { httpOnly: true });
		return res.status(200).json({ ...others, token });
	}

	res.status(401).json("Wrong credentials!");
};

const changePassword = async (req, res) => {
	const { password } = req.body;

	if (!password || typeof password !== "string") {
		return res.status(400).json({
			message: "Invalid Password"
		});
	}
	const _id = req.user.id;
	const hasedPassowrd = await bcrypt.hash(
		password,
		parseInt(process.env.BCRYPT_SALT)
	);

	try {
		const updatedUser = await Users.updateOne(
			{ _id },
			{
				$set: { hasedPassowrd }
			}
		);
		res.status(200).json(updatedUser);
	} catch {
		return res.status(500).json({
			message: "Server Error"
		});
	}
};

const logoutUser = async (req, res) => {
	//  logout the user by destroying the token
	//  and return a success message

	res.cookie("jwt", "", { maxAge: 1 });
	res.redirect("/");
};

module.exports = {
	registerUser,
	loginUser,
	changePassword,
	logoutUser
};
