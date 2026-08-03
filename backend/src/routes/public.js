const express = require("express");
const publicContent = require("../services/publicContentService");

const router = express.Router();

function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

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
    const language = await publicContent.getLanguageBySlug(req.params.slug);
    if (!language) return res.status(404).json({ message: "Not found" });
    res.json(await publicContent.listQuestionsByLanguageSlug(req.params.slug));
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
    const category = await publicContent.getCategoryBySlug(req.params.slug);
    if (!category) return res.status(404).json({ message: "Not found" });
    res.json(await publicContent.listQuestionsByCategorySlug(req.params.slug));
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
