const pagination = async (model) => {
	return async (req, res, next) => {
		const page = req.query.page || 1;
		const limit = req.query.limit || 10;
		const startIndex = (page - 1) * limit;
		try {
			const result = await model.find({}).limit(limit).skip(startIndex);
			if (result.length > 0) {
				res.paginatedResult = result;
				next();
			} 
		} catch {
			res.status(500).json({ message: "Server error" });
		}
	};
};

module.exports = pagination;