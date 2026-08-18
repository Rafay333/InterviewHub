const express = require("express");
const publicContent = require("../services/publicContentService");
const { publicCache } = require("../utils/publicCache");

const router = express.Router();

function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

router.use(publicCache);

router.get(
  "/languages",
  asyncHandler(async (_req, res) => {
    res.json(await publicContent.listLanguages());
  }),
);

router.get(
  "/languages/:slug",
  asyncHandler(async (req, res) => {
    const item = await publicContent.getLanguageBySlug(req.params.slug);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  }),
);

router.get(
  "/languages/:slug/questions",
  asyncHandler(async (req, res) => {
    res.json(
      await publicContent.listQuestionsByLanguageSlug(req.params.slug, {
        difficulty: req.query.difficulty || null,
        full: String(req.query.full || "") === "1",
      }),
    );
  }),
);

router.get(
  "/categories",
  asyncHandler(async (_req, res) => {
    res.json(await publicContent.listCategories());
  }),
);

router.get(
  "/categories/:slug",
  asyncHandler(async (req, res) => {
    const item = await publicContent.getCategoryBySlug(req.params.slug);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  }),
);

router.get(
  "/categories/:slug/questions",
  asyncHandler(async (req, res) => {
    res.json(
      await publicContent.listQuestionsByCategorySlug(req.params.slug, {
        difficulty: req.query.difficulty || null,
        full: String(req.query.full || "") === "1",
      }),
    );
  }),
);

router.get(
  "/questions/recent",
  asyncHandler(async (req, res) => {
    const limit = Number(req.query.limit) || 8;
    res.json(await publicContent.listRecentQuestions(limit));
  }),
);

router.get(
  "/questions/:slug",
  asyncHandler(async (req, res) => {
    const item = await publicContent.getQuestionBySlug(req.params.slug);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  }),
);

router.get(
  "/blogs",
  asyncHandler(async (_req, res) => {
    res.json(await publicContent.listBlogs());
  }),
);

router.get(
  "/blogs/:slug",
  asyncHandler(async (req, res) => {
    const item = await publicContent.getBlogBySlug(req.params.slug);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  }),
);

module.exports = router;
