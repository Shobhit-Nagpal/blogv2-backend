const { createClient } = require("@supabase/supabase-js");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { body } = require("express-validator");
require("dotenv").config();

const PROJECT_URL = process.env.PROJECT_URL;
const SERVICE_KEY = process.env.SERVICE_KEY;
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const supabase = createClient(PROJECT_URL, SERVICE_KEY);

exports.posts_list_get = asyncHandler(async (req, res, next) => {
  const { data, error } = await supabase
    .from("posts")
    .select()
    .order("created_at", { ascending: false })
    .eq("is_published", true);

  if (error) {
    return res.status(500).json({ error: error });
  } else {
    return res.status(200).json(data);
  }
});

exports.post_get = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const { data, error } = await supabase.from("posts").select().eq("id", id);

  if (error) {
    return res.status(500).json({ error: error });
  } else {
    return res.status(200).json(data);
  }
});

exports.post_publish = [
  body("title", "Title should be more than 4 characters")
    .isLength({ min: 4 })
    .escape(),
  body("content", "Content should be more than 4 characters")
    .isLength({ min: 4 })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const { title, content } = req.body;

    const { error } = await supabase
      .from("posts")
      .insert({ title: title, content: content, is_published: true });

    if (error) {
      return res.status(500).json({ error: error });
    } else {
      return res.status(201).json({ message: "Created post" });
    }
  }),
];

exports.post_save = [
  body("title", "Title should be more than 4 characters")
    .isLength({ min: 4 })
    .escape(),
  body("content", "Content should be more than 4 characters")
    .isLength({ min: 4 })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const { id, title, content, is_published } = req.body;

    if (id === null) {
      const { error } = await supabase
        .from("posts")
        .insert({ title: title, content: content, is_published: false });

      if (error) {
        return res.status(500).json({ error: error });
      } else {
        return res.status(201).json({ message: "Created post" });
      }
    } else {
      const { error } = await supabase
        .from("posts")
        .update({
          title: title,
          content: content,
          updated_at: new Date(),
          is_published: is_published,
        })
        .eq("id", id);

      if (error) {
        return res.status(500).json({ error: error });
      }

      return res.status(200).json({ message: "Post updated!" });
    }
  }),
];

exports.post_update = [
  body("title", "Title should be more than 4 characters")
    .isLength({ min: 4 })
    .escape(),
  body("content", "Content should be more than 4 characters")
    .isLength({ min: 4 })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const { id, title, content, is_published } = req.body;
    const token = req.headers.authorization.split(" ")[1];

    if (token === undefined) {
      return res.status(401).json({ message: "Not authorized" });
    }

    jwt.verify(token, JWT_ACCESS_SECRET, async function (err, info) {
      if (err) {
        return res.status(500).json({ error: err });
      }

      const { error } = await supabase
        .from("posts")
        .update({
          title: title,
          content: content,
          updated_at: new Date(),
          is_published: is_published,
        })
        .eq("id", id);

      if (error) {
        return res.status(500).json({ error: error });
      }

      return res.status(200).json({ message: "Post updated!" });
    });
  }),
];

exports.post_delete = asyncHandler(async (req, res, next) => {
  const { id } = req.body;
  const token = req.headers.authorization.split(" ")[1];

  if (token === undefined) {
    return res.status(401).json({ error: "Not authorized" });
  }

  jwt.verify(token, JWT_ACCESS_SECRET, async function (err, info) {
    if (err) {
      return res.status(500).json({ error: err });
    }

    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (error) {
      return res.status(500).json({ error: error });
    }

    return res.status(200).json({ message: "Post deleted!" });
  });
});

exports.dashboard_get = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  if (token === undefined) {
    return res.status(401).json({ message: "Not authorized"`` });
  }

  jwt.verify(token, JWT_ACCESS_SECRET, async function (err, info) {
    if (err) {
      return res.status(500).json({ error: err });
    }

    const { data, error } = await supabase
      .from("posts")
      .select()
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ error: error });
    }

    return res.status(200).json(data);
  });
});
