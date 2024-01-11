const express = require("express");
const router = express.Router();
const post_controller = require("../controllers/postController");
const auth_controller = require("../controllers/authController");

//Posts
router.get("/", post_controller.posts_list_get);
router.get("/post/:id", post_controller.post_get);
router.post("/post/publish", post_controller.post_publish);
router.post("/post/save", post_controller.post_save);
router.put("/post/:id", post_controller.post_update);
router.delete("/post/:id", post_controller.post_delete);
router.get("/dashboard", post_controller.dashboard_get);

//Auth
router.post("/admin", auth_controller.admin_post);

module.exports = router;
