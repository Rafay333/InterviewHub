const express = require("express");
const { requireAdmin } = require("../middleware/auth");
const { clearPublicCache } = require("../utils/publicCache");
const { publicOrigin } = require("../utils/publicUrl");
const { upload } = require("../middleware/upload");
const { persistLocalFile } = require("../utils/uploadStore");
const authService = require("../services/adminAuthService");
const languageService = require("../services/languageService");
const categoryService = require("../services/categoryService");
const questionService = require("../services/questionService");
const pdfImportService = require("../services/pdfImportService");
const blogService = require("../services/blogService");
const mediaService = require("../services/mediaService");
const adminUserService = require("../services/adminUserService");
const settingsService = require("../services/settingsService");
const dashboardService = require("../services/dashboardService");

const router = express.Router();

function baseUrl(req) {
  return publicOrigin(req);
}

function publicFileUrl(req, file) {
  if (!file) return null;
  persistLocalFile(file.filename).catch((err) => console.error("[uploads]", err.message));
  return `${publicOrigin(req)}/uploads/${file.filename}`;
}

function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

// Auth
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }
    const result = await authService.login(email, password);
    res.json(result);
  }),
);

router.get(
  "/me",
  requireAdmin,
  asyncHandler(async (req, res) => {
    res.json({ admin: req.admin });
  }),
);

router.use(requireAdmin);
router.use((req, res, next) => {
  if (req.method === "GET") return next();
  res.on("finish", () => {
    if (res.statusCode < 400) clearPublicCache();
  });
  next();
});

router.get(
  "/dashboard",
  asyncHandler(async (_req, res) => {
    res.json(await dashboardService.getDashboard());
  }),
);

// Languages
router.get(
  "/languages",
  asyncHandler(async (req, res) => {
    res.json(
      await languageService.listLanguages({
        categoryId: req.query.categoryId,
      }),
    );
  }),
);
router.get(
  "/languages/:id",
  asyncHandler(async (req, res) => {
    const item = await languageService.getLanguage(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  }),
);
router.post(
  "/languages",
  upload.single("picture"),
  asyncHandler(async (req, res) => {
    const item = await languageService.createLanguage({
      name: req.body.name,
      description: req.body.description,
      status: req.body.status || "published",
      pictureUrl: publicFileUrl(req, req.file),
      categoryId: req.body.categoryId || null,
      adminId: req.admin.sub,
    });
    res.status(201).json(item);
  }),
);
router.put(
  "/languages/:id",
  upload.single("picture"),
  asyncHandler(async (req, res) => {
    const item = await languageService.updateLanguage(req.params.id, {
      name: req.body.name,
      description: req.body.description,
      status: req.body.status,
      pictureUrl: req.file ? publicFileUrl(req, req.file) : undefined,
      categoryId:
        req.body.categoryId !== undefined ? req.body.categoryId || null : undefined,
      adminId: req.admin.sub,
    });
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  }),
);
router.delete(
  "/languages/:id",
  asyncHandler(async (req, res) => {
    const ok = await languageService.deleteLanguage(req.params.id);
    if (!ok) return res.status(404).json({ message: "Not found" });
    res.status(204).end();
  }),
);

// Categories
router.get(
  "/categories",
  asyncHandler(async (_req, res) => {
    res.json(await categoryService.listCategories());
  }),
);
router.post(
  "/categories/seed-core",
  asyncHandler(async (req, res) => {
    const result = await categoryService.ensureCoreCategories(req.admin.sub);
    res.json(result);
  }),
);
router.get(
  "/categories/:id",
  asyncHandler(async (req, res) => {
    const item = await categoryService.getCategory(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  }),
);
router.post(
  "/categories",
  upload.single("picture"),
  asyncHandler(async (req, res) => {
    const item = await categoryService.createCategory({
      name: req.body.name,
      description: req.body.description,
      status: req.body.status || "published",
      pictureUrl: publicFileUrl(req, req.file),
      adminId: req.admin.sub,
    });
    res.status(201).json(item);
  }),
);
router.put(
  "/categories/:id",
  upload.single("picture"),
  asyncHandler(async (req, res) => {
    const item = await categoryService.updateCategory(req.params.id, {
      name: req.body.name,
      description: req.body.description,
      status: req.body.status,
      pictureUrl: req.file ? publicFileUrl(req, req.file) : undefined,
    });
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  }),
);
router.delete(
  "/categories/:id",
  asyncHandler(async (req, res) => {
    const ok = await categoryService.deleteCategory(req.params.id);
    if (!ok) return res.status(404).json({ message: "Not found" });
    res.status(204).end();
  }),
);

// Questions
router.get(
  "/questions",
  asyncHandler(async (req, res) => {
    res.json(
      await questionService.listQuestions({
        languageId: req.query.languageId,
        categoryId: req.query.categoryId,
        difficulty: req.query.difficulty,
        status: req.query.status,
        q: req.query.q,
        page: req.query.page,
        pageSize: req.query.pageSize,
      }),
    );
  }),
);
router.post(
  "/questions/import/preview",
  upload.single("file"),
  asyncHandler(async (req, res) => {
    const result = await pdfImportService.previewPdfQuestions({
      file: req.file,
      difficulty: req.body.difficulty || null,
    });
    res.json(result);
  }),
);
router.post(
  "/questions/import",
  upload.single("file"),
  asyncHandler(async (req, res) => {
    const result = await pdfImportService.importPdfQuestions({
      file: req.file,
      languageId: req.body.languageId || null,
      categoryId: req.body.categoryId || null,
      difficulty: req.body.difficulty || null,
      status: req.body.status || "published",
      adminId: req.admin.sub,
      baseUrl: baseUrl(req),
    });
    res.status(201).json(result);
  }),
);
router.get(
  "/questions/:id",
  asyncHandler(async (req, res) => {
    const item = await questionService.getQuestion(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  }),
);
router.post(
  "/questions",
  upload.fields([
    { name: "questionImage", maxCount: 1 },
    { name: "answerImage", maxCount: 1 },
    { name: "descriptionImage", maxCount: 1 },
  ]),
  asyncHandler(async (req, res) => {
    const files = req.files || {};
    const item = await questionService.createQuestion({
      questionText: req.body.questionText || req.body.question,
      answerText: req.body.answerText || req.body.answer,
      descriptionText: req.body.descriptionText || req.body.description,
      difficulty: req.body.difficulty,
      languageId: req.body.languageId || null,
      categoryId: req.body.categoryId || null,
      status: req.body.status || "published",
      questionImageUrl: publicFileUrl(req, files.questionImage?.[0]),
      answerImageUrl: publicFileUrl(req, files.answerImage?.[0]),
      descriptionImageUrl: publicFileUrl(req, files.descriptionImage?.[0]),
      adminId: req.admin.sub,
    });
    res.status(201).json(item);
  }),
);
router.put(
  "/questions/:id",
  upload.fields([
    { name: "questionImage", maxCount: 1 },
    { name: "answerImage", maxCount: 1 },
    { name: "descriptionImage", maxCount: 1 },
  ]),
  asyncHandler(async (req, res) => {
    const files = req.files || {};
    const item = await questionService.updateQuestion(req.params.id, {
      questionText: req.body.questionText || req.body.question,
      answerText: req.body.answerText || req.body.answer,
      descriptionText: req.body.descriptionText || req.body.description,
      difficulty: req.body.difficulty,
      languageId: req.body.languageId || null,
      categoryId: req.body.categoryId || null,
      status: req.body.status,
      questionImageUrl: files.questionImage?.[0]
        ? publicFileUrl(req, files.questionImage[0])
        : undefined,
      answerImageUrl: files.answerImage?.[0]
        ? publicFileUrl(req, files.answerImage[0])
        : undefined,
      descriptionImageUrl: files.descriptionImage?.[0]
        ? publicFileUrl(req, files.descriptionImage[0])
        : undefined,
    });
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  }),
);
router.delete(
  "/questions/:id",
  asyncHandler(async (req, res) => {
    const ok = await questionService.deleteQuestion(req.params.id);
    if (!ok) return res.status(404).json({ message: "Not found" });
    res.status(204).end();
  }),
);

// Blogs
router.get(
  "/blogs",
  asyncHandler(async (_req, res) => {
    res.json(await blogService.listBlogs());
  }),
);
router.get(
  "/blogs/:id",
  asyncHandler(async (req, res) => {
    const item = await blogService.getBlog(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  }),
);
router.post(
  "/blogs",
  upload.single("featuredImage"),
  asyncHandler(async (req, res) => {
    const item = await blogService.createBlog({
      title: req.body.title,
      excerpt: req.body.excerpt,
      body: req.body.body,
      category: req.body.category,
      authorName: req.body.authorName,
      authorTitle: req.body.authorTitle,
      readMinutes: Number(req.body.readMinutes) || 5,
      featured: req.body.featured === "true" || req.body.featured === true,
      status: req.body.status || "draft",
      metaTitle: req.body.metaTitle,
      metaDescription: req.body.metaDescription,
      featuredImageUrl: publicFileUrl(req, req.file),
      adminId: req.admin.sub,
    });
    res.status(201).json(item);
  }),
);
router.put(
  "/blogs/:id",
  upload.single("featuredImage"),
  asyncHandler(async (req, res) => {
    const item = await blogService.updateBlog(req.params.id, {
      title: req.body.title,
      excerpt: req.body.excerpt,
      body: req.body.body,
      category: req.body.category,
      authorName: req.body.authorName,
      authorTitle: req.body.authorTitle,
      readMinutes: Number(req.body.readMinutes) || undefined,
      featured: req.body.featured === "true" || req.body.featured === true,
      status: req.body.status,
      metaTitle: req.body.metaTitle,
      metaDescription: req.body.metaDescription,
      featuredImageUrl: req.file ? publicFileUrl(req, req.file) : undefined,
    });
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  }),
);
router.delete(
  "/blogs/:id",
  asyncHandler(async (req, res) => {
    const ok = await blogService.deleteBlog(req.params.id);
    if (!ok) return res.status(404).json({ message: "Not found" });
    res.status(204).end();
  }),
);

// Media
router.get(
  "/media",
  asyncHandler(async (req, res) => {
    res.json(await mediaService.listMedia(baseUrl(req)));
  }),
);
router.post(
  "/media",
  upload.array("files", 20),
  asyncHandler(async (req, res) => {
    const files = req.files || [];
    const created = [];
    for (const file of files) {
      created.push(
        await mediaService.createMedia({
          file,
          adminId: req.admin.sub,
          baseUrl: baseUrl(req),
        }),
      );
    }
    res.status(201).json(created);
  }),
);
router.delete(
  "/media/:id",
  asyncHandler(async (req, res) => {
    const ok = await mediaService.deleteMedia(req.params.id);
    if (!ok) return res.status(404).json({ message: "Not found" });
    res.status(204).end();
  }),
);

// Users
router.get(
  "/users",
  asyncHandler(async (_req, res) => {
    res.json(await adminUserService.listAdmins());
  }),
);
router.post(
  "/users",
  asyncHandler(async (req, res) => {
    const item = await adminUserService.createAdmin({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    res.status(201).json(item);
  }),
);
router.patch(
  "/users/:id/active",
  asyncHandler(async (req, res) => {
    const item = await adminUserService.setAdminActive(
      req.params.id,
      !!req.body.active,
    );
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  }),
);

// Settings
router.get(
  "/settings",
  asyncHandler(async (_req, res) => {
    res.json(await settingsService.getSettings());
  }),
);
router.put(
  "/settings",
  asyncHandler(async (req, res) => {
    res.json(await settingsService.updateSettings(req.body, req.admin.sub));
  }),
);

module.exports = router;
