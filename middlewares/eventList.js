const Events = require("../models/Events");

const eventList = () =>{
    return (req, res, next) => {
        try {
			const events = await Events.find({
				$or: [
					{ creator: req.user._id },
					{
						attendees: {
							$in: [req.user._id]
						}
					}
				]
			});
			if (events) {
                res.userEvents = events;
			}
		} catch {
			res.status(500).json({ message: "Server error" });
		}
    }
}