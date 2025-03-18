const db = require("../models/queries");
const { getUserContext } = require("../models/helpers");

// renders new message form for user who has signed up, has joined the club, and has logged in
function newMessageGet(req, res) {
  return res.render("new-message-form", {
    message: null,
    // user logged in, so req.user available
    user: req.user,
  });
}

// handles POST request for a member creating a message
async function newMessagePost(req, res) {
  if (!req.user) {
    return res
      .status(401)
      .send("Unauthorized: Please log in to create a message.");
  }

  const { title, text } = req.body;

  if (!title || !text) {
    return res.render("new-message-form", {
      message: "Title and text are required.",
      // user logged in, so req.user available
      user: req.user,
    });
  }

  try {
    const mem_id = await db.findMemIdByUsername(req.user.username);
    const added = new Date();
    const id = await db.createMessage(title, text, added, mem_id);
    if (!id) {
      return res.status(500).send("Failed to create message");
    }
    const userContext = await getUserContext(req.user.username);
    res.render("homepage", {
      message: "You have successfully created a message!",
      // user logged in, so req.user available
      user: req.user,
      ...userContext,
    });
  } catch (error) {
    console.error("Error saving Message:", error);
    res.status(500).send("Internal Server Error");
  }
}

// handles POST request for an admin member deleting a message
async function deleteMessagePost(req, res) {
  // extracts id parameter from the request URL
  const messageId = req.params.id;

  try {
    await db.deleteMessage(messageId);
    const userContext = await getUserContext(req.user.username);
    res.render("homepage", {
      message: "You have successfully deleted a message.",
      // user logged in, so req.user available
      user: req.user,
      ...userContext,
    });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  newMessageGet,
  newMessagePost,
  deleteMessagePost,
};
