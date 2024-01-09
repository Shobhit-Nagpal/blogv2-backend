const { createClient } = require("@supabase/supabase-js");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
require("dotenv").config();

const PROJECT_URL = process.env.PROJECT_URL;
const PUBLIC_ANON_KEY = process.env.PUBLIC_ANON_KEY;
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const supabase = createClient(PROJECT_URL, PUBLIC_ANON_KEY);

exports.posts_list_get = asyncHandler(async(req, res, next) => {
    const { data, error } = await supabase
        .from("posts")
        .select()
        .eq("is_published", true);

    if (error) {
        res.status(500).json({error: error});
    } else {
        res.status(200).json(data);
    }
});

exports.post_get = asyncHandler(async(req, res, next) => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from("posts")
        .select()
        .eq("id", id);

    if (error) {
        res.status(500).json({error: error});
    } else {
        res.status(200).json(data);
    }
});

exports.post_post = asyncHandler(async(req, res, next) => {
    const { title, content } = req.body;

    const { error } = await supabase
        .from("posts")
        .insert({title: title, content: content});

    if (error) {
        res.status(500).json({error: error});
    } else {
        res.status(201).json({"message": "Created post"});
    }
});

exports.post_update = asyncHandler(async(req, res, next) => {
    const { id, title, content } = req.body;
    const { token } = req.cookies;

    if (token === undefined) {
        res.status(401).json({"message": "Not authorized"});
    }

    jwt.verify(token, JWT_ACCESS_SECRET, async function(err, info) {
        if (err) {
            res.status(500).json({error: err});
            return;
        }

        const { error } = await supabase
        .from("posts")
        .update({title: title, content: content, updated_at: Date.now()})
        .eq("id", id);

        if (error) {
            res.status(500).json({error: error});
            return;
        }

        res.status(204).json({"message": "Post updated!"});
    });
});

exports.post_delete = asyncHandler(async(req, res, next) => {
    const { id } = req.body;
    const { token } = req.cookies;
    
    if (token === undefined) {
        res.status(401).json({error: "Not authorized"});
        return;
    }

    jwt.verify(token, JWT_ACCESS_SECRET, async function(err, info) {
        if (err) {
            res.status(500).json({error: err});
        }

        const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", id);

        if (error) {
            res.status(500).json({error: error});
            return;
        }

        res.status(204).json({"message": "Post deleted!"});
    });
});

exports.dashboard_get = asyncHandler(async(req, res, next) => {
    const { token } = req.cookies;

    if (token === undefined) {
        res.status(401).json({"message": "Not authorized"});
        return;
    }

    jwt.verify(token, JWT_ACCESS_SECRET, async function(err, info) {
        if (err) {
            res.status(500).json({error: err});
            return;
        }

        const { data, error } = await supabase
        .from("posts")
        .select();

        if (error) {
            res.status(500).json({error: error});
            return;
        }

        res.status(200).json(data);
    });
});
