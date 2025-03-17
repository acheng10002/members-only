// imports Router() and instantiates it in messagesRouter that will hold messages-related routes
const { Router } = require("express");
const messagesRouter = Router();
/* messagesController has functions that handles requests for new messages (GET and POST) and deleting
messages (POST) */
const messagesController = require("../controllers/messagesController");

// handles GET request for displaying new message form
messagesRouter.get("/new-message", messagesController.newMessageGet);

// handles POST request for submitting new message form
messagesRouter.post("/new-message", messagesController.newMessagePost);

// handles POST request for deleting a message
messagesRouter.post(
  "/message/:id/delete",
  messagesController.deleteMessagePost
);

module.exports = messagesRouter;
