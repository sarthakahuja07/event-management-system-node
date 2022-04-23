const Users = require("../models/users");

const getUserList = async (req, res, next) => {
	try {
		const users = await Users.find();
		if (users) {
			res.status(200).json(users);
		} else {
			res.status(404).json({ message: "No users found" });
		}
	} catch {
		res.status(500).json({ message: "Server error" });
	}
};

const getUserById = async (req, res, next) => {
	const id = req.params.id;
	try {
		const user = await Users.findById(id);
		if (user) {
			res.status(200).json(user);
		} else {
			res.status(404).json({ message: "User not found" });
		}
	} catch {
		res.status(500).json({ message: "Server error" });
	}
};

module.exports = {
    getUserList,
    getUserById
}