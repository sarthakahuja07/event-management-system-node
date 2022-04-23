const Events = require("../models/events");

const getAllEvents = async (req, res, next) => {
	try {
		const events = await Events.find({
			$or: [
				{ creator: req.user.id },
				{
					attendees: {
						$in: [req.user.id]
					}
				}
			]
		})
			.populate({ path: "creator", select: "username" })
			.populate({ path: "attendees", select: "username" });
		if (events.length > 0) {
			res.status(200).json(events);
		} else {
			res.status(404).json({ message: "No events found" });
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: "Server error" });
	}
};

const getPaginatedEvents = async (req, res, next) => {
	const page = req.query.page || 1;
	const limit = req.query.limit || 10;
	const startIndex = (page - 1) * limit;
	// get list of events from db where a user is creator or attendee
	try {
		const events = await Events.find({
			$or: [
				{ creator: req.user.id },
				{
					attendees: {
						$in: [req.user.id]
					}
				}
			]
		})
			.limit(limit)
			.skip(startIndex)
			.populate({ path: "creator", select: "username" })
			.populate({ path: "attendees", select: "username" });
		if (events.length > 0) {
			res.status(200).json(events);
		} else {
			res.status(404).json({ message: "No events found" });
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: "Server error" });
	}
};

const createEvent = async (req, res, next) => {
	const Event = new Events({ ...req.body, creator: req.user.id });
	try {
		const newEvent = await Event.save();
		res.status(201).json(newEvent);
	} catch {
		res.status(400).json({ message: "Error creating event" });
	}
};

const getSortedEvents = async (req, res, next) => {
	const sort = req.query.sort || "date";
	// get list of events from db where a user is creator or attendee
	try {
		const events = await Events.find({
			$or: [
				{ creator: req.user.id },
				{
					attendees: {
						$in: [req.user.id]
					}
				}
			]
		})
			.sort({ [sort]: 1 })
			.populate({ path: "creator", select: "username" })
			.populate({ path: "attendees", select: "username" });
		if (events.length > 0) {
			res.status(200).json(events);
		} else {
			res.status(404).json({ message: "No events found" });
		}
	} catch {
		res.status(500).json({ message: "Server error" });
	}
};

const getSearchedEvent = async (req, res, next) => {
	const search = req.query.key;
	const regex = new RegExp("\\b" + search, "i");
	// get list of events from db where a user is creator or attendee and search term matches the title of event
	try {
		const events = await Events.find({
			$or: [
				{ creator: req.user.id },
				{
					attendees: {
						$in: [req.user.id]
					}
				}
			],
			title: {
				$regex: regex
			}
		})
			.populate({ path: "creator", select: "username" })
			.populate({ path: "attendees", select: "username" });
		if (events.length > 0) {
			res.status(200).json(events);
		} else {
			res.status(404).json({ message: "No events found" });
		}
	} catch {
		res.status(500).json({ message: "Server error" });
	}
};

const dateFilteredEvents = async (req, res, next) => {
	const startDate = req.query.startDate;
	const endDate = req.query.endDate;
	try {
		const events = await Events.find({
			$or: [
				{ creator: req.user.id },
				{
					attendees: {
						$in: [req.user.id]
					}
				}
			],
			date: {
				$gte: startDate,
				$lte: endDate
			}
		})
			.populate({ path: "creator", select: "username" })
			.populate({ path: "attendees", select: "username" });
		if (events.length > 0) {
			res.status(200).json(events);
		} else {
			res.status(404).json({ message: "No events found" });
		}
	} catch {
		res.status(500).json({ message: "Server error" });
	}
};

const getEventById = async (req, res, next) => {
	const id = req.params.id;
	try {
		const event = await Events.findById(id).populate(
			{ path: "creator", select: "name" },
			{ path: "attendees", select: "name" }
		);

		if (event) {
			res.status(200).json(event);
		} else {
			res.status(404).json({ message: "Event not found" });
		}
	} catch {
		res.status(500).json({ message: "Error getting event" });
	}
};

const updateEventById = async (req, res, next) => {
	// Check if current user is the creator of the event
	const event = await Events.findById(req.params.id);
	if (event.creator.toString() !== req.user.id.toString()) {
		return res.status(401).json({ message: "User not authorized" });
	}
	// Update event
	try {
		const updatedEvent = await Events.findByIdAndUpdate(
			req.params.id,
			{ $set: req.body },
			{ new: true }
		);
		res.status(200).json(updatedEvent);
	} catch {
		res.status(500).json({ message: "Error updating event" });
	}
};

const inviteAttendee = async (req, res, next) => {
	const id = req.params.id;
	const userId = req.body.userId;
	try {
		const event = await Events.findById(id);
		if (event) {
			event.attendees.push(userId);
			const updatedEvent = await Events.findByIdAndUpdate(
				id,
				{ $set: event },
				{ new: true }
			);
			if (updatedEvent) {
				res.status(200).json(updatedEvent);
			} else {
				res.status(404).json({ message: "Event not found" });
			}
		} else {
			res.status(404).json({ message: "Event not found" });
		}
	} catch {
		res.status(500).json({ message: "Error updating event" });
	}
};

module.exports = {
	getPaginatedEvents,
	createEvent,
	getSortedEvents,
	getSearchedEvent,
	getEventById,
	dateFilteredEvents,
	updateEventById,
	getAllEvents,
	inviteAttendee
};
