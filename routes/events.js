const express = require("express");
const router = express.Router();

const {
	verifyToken,
	verifyTokenAndAuthorization
} = require("../middlewares/authenticate");

const {
	getPaginatedEvents,
	createEvent,
	getSortedEvents,
	getAllEvents,
	getSearchedEvent,
	getEventById,
	dateFilteredEvents,
	updateEventById,
	inviteAttendee
} = require("../controllers/event");

router.route("/paginate").get(verifyToken,getPaginatedEvents).post(verifyToken,createEvent);
router.route("/all").get(verifyToken,getAllEvents);
router.route("/search").get(verifyToken,getSearchedEvent);
router.route("/sort").get(verifyToken,getSortedEvents);
router.route("/date-filter").get(verifyToken,dateFilteredEvents);
router.route("/:id").get(verifyToken,getEventById).put(verifyToken,updateEventById);
router.route("/:id/invite").post(verifyToken,inviteAttendee);

module.exports = router;
