-- =============================================================================
-- InterviewHub — Microsoft SQL Server schema (USE THIS IN SSMS)
-- File: database/schema.mssql.sql
--
-- DO NOT run database/schema.sql — that file is PostgreSQL and will fail here.
--
-- Steps:
--   1) Open THIS file (schema.mssql.sql) — not schema.sql
--   2) Press F5
-- =============================================================================

IF DB_ID(N'InterviewHub') IS NULL
BEGIN
  CREATE DATABASE InterviewHub;
END
GO

USE InterviewHub;
GO

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

-- -----------------------------------------------------------------------------
-- Lookup / enum-style tables (SQL Server has no ENUM type)
-- -----------------------------------------------------------------------------
IF OBJECT_ID(N'dbo.publish_status_lookup', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.publish_status_lookup (
    code VARCHAR(20) NOT NULL CONSTRAINT PK_publish_status_lookup PRIMARY KEY
  );
  INSERT INTO dbo.publish_status_lookup (code) VALUES ('draft'), ('published');
END;
GO

IF OBJECT_ID(N'dbo.difficulty_level_lookup', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.difficulty_level_lookup (
    code VARCHAR(20) NOT NULL CONSTRAINT PK_difficulty_level_lookup PRIMARY KEY
  );
  INSERT INTO dbo.difficulty_level_lookup (code)
  VALUES ('beginner'), ('intermediate'), ('expert');
END;
GO

IF OBJECT_ID(N'dbo.media_type_lookup', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.media_type_lookup (
    code VARCHAR(20) NOT NULL CONSTRAINT PK_media_type_lookup PRIMARY KEY
  );
  INSERT INTO dbo.media_type_lookup (code) VALUES ('image'), ('pdf');
END;
GO

IF OBJECT_ID(N'dbo.pdf_import_status_lookup', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.pdf_import_status_lookup (
    code VARCHAR(20) NOT NULL CONSTRAINT PK_pdf_import_status_lookup PRIMARY KEY
  );
  INSERT INTO dbo.pdf_import_status_lookup (code)
  VALUES ('uploading'), ('extracting'), ('review'), ('imported'), ('failed');
END;
GO

IF OBJECT_ID(N'dbo.comment_status_lookup', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.comment_status_lookup (
    code VARCHAR(20) NOT NULL CONSTRAINT PK_comment_status_lookup PRIMARY KEY
  );
  INSERT INTO dbo.comment_status_lookup (code)
  VALUES ('pending'), ('approved'), ('rejected');
END;
GO

IF OBJECT_ID(N'dbo.admin_role_lookup', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.admin_role_lookup (
    code VARCHAR(20) NOT NULL CONSTRAINT PK_admin_role_lookup PRIMARY KEY
  );
  INSERT INTO dbo.admin_role_lookup (code) VALUES ('admin');
END;
GO

-- -----------------------------------------------------------------------------
-- 1) admin_users
-- -----------------------------------------------------------------------------
IF OBJECT_ID(N'dbo.admin_users', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.admin_users (
    id             UNIQUEIDENTIFIER NOT NULL
                   CONSTRAINT PK_admin_users PRIMARY KEY
                   CONSTRAINT DF_admin_users_id DEFAULT NEWSEQUENTIALID(),
    name           NVARCHAR(120) NOT NULL,
    email          NVARCHAR(255) NOT NULL,
    password_hash  NVARCHAR(MAX) NOT NULL,
    role           VARCHAR(20) NOT NULL
                   CONSTRAINT DF_admin_users_role DEFAULT 'admin',
    is_active      BIT NOT NULL CONSTRAINT DF_admin_users_is_active DEFAULT 1,
    last_login_at  DATETIME2(0) NULL,
    created_at     DATETIME2(0) NOT NULL CONSTRAINT DF_admin_users_created DEFAULT SYSUTCDATETIME(),
    updated_at     DATETIME2(0) NOT NULL CONSTRAINT DF_admin_users_updated DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_admin_users_email UNIQUE (email),
    CONSTRAINT FK_admin_users_role
      FOREIGN KEY (role) REFERENCES dbo.admin_role_lookup (code)
  );
END;
GO

-- -----------------------------------------------------------------------------
-- 2) media_files
-- -----------------------------------------------------------------------------
IF OBJECT_ID(N'dbo.media_files', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.media_files (
    id              UNIQUEIDENTIFIER NOT NULL
                    CONSTRAINT PK_media_files PRIMARY KEY
                    CONSTRAINT DF_media_files_id DEFAULT NEWSEQUENTIALID(),
    file_name       NVARCHAR(255) NOT NULL,
    original_name   NVARCHAR(255) NOT NULL,
    file_type       VARCHAR(20) NOT NULL,
    mime_type       NVARCHAR(120) NULL,
    file_size_bytes BIGINT NULL,
    storage_path    NVARCHAR(500) NOT NULL,
    public_url      NVARCHAR(500) NULL,
    uploaded_by     UNIQUEIDENTIFIER NULL,
    created_at      DATETIME2(0) NOT NULL CONSTRAINT DF_media_files_created DEFAULT SYSUTCDATETIME(),
    updated_at      DATETIME2(0) NOT NULL CONSTRAINT DF_media_files_updated DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_media_files_type
      FOREIGN KEY (file_type) REFERENCES dbo.media_type_lookup (code),
    CONSTRAINT FK_media_files_uploaded_by
      FOREIGN KEY (uploaded_by) REFERENCES dbo.admin_users (id)
  );

  CREATE INDEX IX_media_files_type ON dbo.media_files (file_type);
  CREATE INDEX IX_media_files_uploaded_by ON dbo.media_files (uploaded_by);
END;
GO

-- -----------------------------------------------------------------------------
-- 3) languages
-- -----------------------------------------------------------------------------
IF OBJECT_ID(N'dbo.languages', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.languages (
    id                UNIQUEIDENTIFIER NOT NULL
                      CONSTRAINT PK_languages PRIMARY KEY
                      CONSTRAINT DF_languages_id DEFAULT NEWSEQUENTIALID(),
    name              NVARCHAR(120) NOT NULL,
    slug              NVARCHAR(160) NOT NULL,
    description       NVARCHAR(MAX) NULL,
    picture_url       NVARCHAR(500) NULL,
    picture_media_id  UNIQUEIDENTIFIER NULL,
    seo_heading       NVARCHAR(255) NULL,
    meta_title        NVARCHAR(255) NULL,
    meta_description  NVARCHAR(MAX) NULL,
    status            VARCHAR(20) NOT NULL CONSTRAINT DF_languages_status DEFAULT 'published',
    created_by        UNIQUEIDENTIFIER NULL,
    created_at        DATETIME2(0) NOT NULL CONSTRAINT DF_languages_created DEFAULT SYSUTCDATETIME(),
    updated_at        DATETIME2(0) NOT NULL CONSTRAINT DF_languages_updated DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_languages_slug UNIQUE (slug),
    CONSTRAINT UQ_languages_name UNIQUE (name),
    CONSTRAINT FK_languages_status
      FOREIGN KEY (status) REFERENCES dbo.publish_status_lookup (code),
    CONSTRAINT FK_languages_picture_media
      FOREIGN KEY (picture_media_id) REFERENCES dbo.media_files (id),
    CONSTRAINT FK_languages_created_by
      FOREIGN KEY (created_by) REFERENCES dbo.admin_users (id)
  );

  CREATE INDEX IX_languages_status ON dbo.languages (status);
END;
GO

-- -----------------------------------------------------------------------------
-- 4) categories
-- -----------------------------------------------------------------------------
IF OBJECT_ID(N'dbo.categories', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.categories (
    id                UNIQUEIDENTIFIER NOT NULL
                      CONSTRAINT PK_categories PRIMARY KEY
                      CONSTRAINT DF_categories_id DEFAULT NEWSEQUENTIALID(),
    name              NVARCHAR(120) NOT NULL,
    slug              NVARCHAR(160) NOT NULL,
    description       NVARCHAR(MAX) NULL,
    picture_url       NVARCHAR(500) NULL,
    picture_media_id  UNIQUEIDENTIFIER NULL,
    seo_heading       NVARCHAR(255) NULL,
    meta_title        NVARCHAR(255) NULL,
    meta_description  NVARCHAR(MAX) NULL,
    status            VARCHAR(20) NOT NULL CONSTRAINT DF_categories_status DEFAULT 'published',
    created_by        UNIQUEIDENTIFIER NULL,
    created_at        DATETIME2(0) NOT NULL CONSTRAINT DF_categories_created DEFAULT SYSUTCDATETIME(),
    updated_at        DATETIME2(0) NOT NULL CONSTRAINT DF_categories_updated DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_categories_slug UNIQUE (slug),
    CONSTRAINT UQ_categories_name UNIQUE (name),
    CONSTRAINT FK_categories_status
      FOREIGN KEY (status) REFERENCES dbo.publish_status_lookup (code),
    CONSTRAINT FK_categories_picture_media
      FOREIGN KEY (picture_media_id) REFERENCES dbo.media_files (id),
    CONSTRAINT FK_categories_created_by
      FOREIGN KEY (created_by) REFERENCES dbo.admin_users (id)
  );

  CREATE INDEX IX_categories_status ON dbo.categories (status);
END;
GO

-- Languages can belong to a category (Category → Languages → Questions)
IF COL_LENGTH('dbo.languages', 'category_id') IS NULL
BEGIN
  ALTER TABLE dbo.languages
    ADD category_id UNIQUEIDENTIFIER NULL;

  ALTER TABLE dbo.languages
    ADD CONSTRAINT FK_languages_category
    FOREIGN KEY (category_id) REFERENCES dbo.categories (id);

  CREATE INDEX IX_languages_category ON dbo.languages (category_id);
END;
GO

-- -----------------------------------------------------------------------------
-- 5) questions
-- -----------------------------------------------------------------------------
IF OBJECT_ID(N'dbo.questions', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.questions (
    id                     UNIQUEIDENTIFIER NOT NULL
                           CONSTRAINT PK_questions PRIMARY KEY
                           CONSTRAINT DF_questions_id DEFAULT NEWSEQUENTIALID(),

    question_text          NVARCHAR(MAX) NOT NULL,
    answer_text            NVARCHAR(MAX) NOT NULL,
    description_text       NVARCHAR(MAX) NULL,

    question_image_url     NVARCHAR(500) NULL,
    answer_image_url       NVARCHAR(500) NULL,
    description_image_url  NVARCHAR(500) NULL,
    question_image_id      UNIQUEIDENTIFIER NULL,
    answer_image_id        UNIQUEIDENTIFIER NULL,
    description_image_id   UNIQUEIDENTIFIER NULL,

    language_id            UNIQUEIDENTIFIER NULL,
    category_id            UNIQUEIDENTIFIER NULL,
    difficulty             VARCHAR(20) NOT NULL CONSTRAINT DF_questions_difficulty DEFAULT 'beginner',
    status                 VARCHAR(20) NOT NULL CONSTRAINT DF_questions_status DEFAULT 'draft',

    slug                   NVARCHAR(220) NOT NULL,
    meta_title             NVARCHAR(255) NULL,
    meta_description       NVARCHAR(MAX) NULL,

    created_by             UNIQUEIDENTIFIER NULL,
    created_at             DATETIME2(0) NOT NULL CONSTRAINT DF_questions_created DEFAULT SYSUTCDATETIME(),
    updated_at             DATETIME2(0) NOT NULL CONSTRAINT DF_questions_updated DEFAULT SYSUTCDATETIME(),

    CONSTRAINT UQ_questions_slug UNIQUE (slug),
    CONSTRAINT CK_questions_has_hub CHECK (language_id IS NOT NULL OR category_id IS NOT NULL),

    CONSTRAINT FK_questions_language
      FOREIGN KEY (language_id) REFERENCES dbo.languages (id),
    CONSTRAINT FK_questions_category
      FOREIGN KEY (category_id) REFERENCES dbo.categories (id),
    CONSTRAINT FK_questions_difficulty
      FOREIGN KEY (difficulty) REFERENCES dbo.difficulty_level_lookup (code),
    CONSTRAINT FK_questions_status
      FOREIGN KEY (status) REFERENCES dbo.publish_status_lookup (code),
    CONSTRAINT FK_questions_question_image
      FOREIGN KEY (question_image_id) REFERENCES dbo.media_files (id),
    CONSTRAINT FK_questions_answer_image
      FOREIGN KEY (answer_image_id) REFERENCES dbo.media_files (id),
    CONSTRAINT FK_questions_description_image
      FOREIGN KEY (description_image_id) REFERENCES dbo.media_files (id),
    CONSTRAINT FK_questions_created_by
      FOREIGN KEY (created_by) REFERENCES dbo.admin_users (id)
  );

  CREATE INDEX IX_questions_language ON dbo.questions (language_id);
  CREATE INDEX IX_questions_category ON dbo.questions (category_id);
  CREATE INDEX IX_questions_difficulty ON dbo.questions (difficulty);
  CREATE INDEX IX_questions_status ON dbo.questions (status);
  CREATE INDEX IX_questions_language_difficulty ON dbo.questions (language_id, difficulty);
END;
GO

-- Optional many-to-many
IF OBJECT_ID(N'dbo.question_categories', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.question_categories (
    question_id UNIQUEIDENTIFIER NOT NULL,
    category_id UNIQUEIDENTIFIER NOT NULL,
    created_at  DATETIME2(0) NOT NULL CONSTRAINT DF_question_categories_created DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_question_categories PRIMARY KEY (question_id, category_id),
    CONSTRAINT FK_question_categories_question
      FOREIGN KEY (question_id) REFERENCES dbo.questions (id) ON DELETE CASCADE,
    CONSTRAINT FK_question_categories_category
      FOREIGN KEY (category_id) REFERENCES dbo.categories (id) ON DELETE CASCADE
  );

  CREATE INDEX IX_question_categories_category ON dbo.question_categories (category_id);
END;
GO

-- -----------------------------------------------------------------------------
-- 6) blogs
-- -----------------------------------------------------------------------------
IF OBJECT_ID(N'dbo.blogs', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.blogs (
    id                 UNIQUEIDENTIFIER NOT NULL
                       CONSTRAINT PK_blogs PRIMARY KEY
                       CONSTRAINT DF_blogs_id DEFAULT NEWSEQUENTIALID(),
    title              NVARCHAR(255) NOT NULL,
    slug               NVARCHAR(220) NOT NULL,
    excerpt            NVARCHAR(MAX) NULL,
    body               NVARCHAR(MAX) NOT NULL,
    category_tag       NVARCHAR(120) NULL,
    featured_image_url NVARCHAR(500) NULL,
    featured_image_id  UNIQUEIDENTIFIER NULL,
    author_name        NVARCHAR(120) NULL,
    author_title       NVARCHAR(120) NULL,
    read_minutes       INT NOT NULL CONSTRAINT DF_blogs_read_minutes DEFAULT 5,
    is_featured        BIT NOT NULL CONSTRAINT DF_blogs_is_featured DEFAULT 0,
    status             VARCHAR(20) NOT NULL CONSTRAINT DF_blogs_status DEFAULT 'draft',
    seo_heading        NVARCHAR(255) NULL,
    meta_title         NVARCHAR(255) NULL,
    meta_description   NVARCHAR(MAX) NULL,
    published_at       DATETIME2(0) NULL,
    created_by         UNIQUEIDENTIFIER NULL,
    created_at         DATETIME2(0) NOT NULL CONSTRAINT DF_blogs_created DEFAULT SYSUTCDATETIME(),
    updated_at         DATETIME2(0) NOT NULL CONSTRAINT DF_blogs_updated DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_blogs_slug UNIQUE (slug),
    CONSTRAINT CK_blogs_read_minutes CHECK (read_minutes > 0),
    CONSTRAINT FK_blogs_status
      FOREIGN KEY (status) REFERENCES dbo.publish_status_lookup (code),
    CONSTRAINT FK_blogs_featured_image
      FOREIGN KEY (featured_image_id) REFERENCES dbo.media_files (id),
    CONSTRAINT FK_blogs_created_by
      FOREIGN KEY (created_by) REFERENCES dbo.admin_users (id)
  );

  CREATE INDEX IX_blogs_status ON dbo.blogs (status);
  CREATE INDEX IX_blogs_published_at ON dbo.blogs (published_at DESC);
END;
GO

-- -----------------------------------------------------------------------------
-- 7) blog_comments
-- -----------------------------------------------------------------------------
IF OBJECT_ID(N'dbo.blog_comments', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.blog_comments (
    id            UNIQUEIDENTIFIER NOT NULL
                  CONSTRAINT PK_blog_comments PRIMARY KEY
                  CONSTRAINT DF_blog_comments_id DEFAULT NEWSEQUENTIALID(),
    blog_id       UNIQUEIDENTIFIER NOT NULL,
    author_name   NVARCHAR(120) NOT NULL,
    author_email  NVARCHAR(255) NULL,
    body          NVARCHAR(MAX) NOT NULL,
    status        VARCHAR(20) NOT NULL CONSTRAINT DF_blog_comments_status DEFAULT 'pending',
    moderated_by  UNIQUEIDENTIFIER NULL,
    moderated_at  DATETIME2(0) NULL,
    created_at    DATETIME2(0) NOT NULL CONSTRAINT DF_blog_comments_created DEFAULT SYSUTCDATETIME(),
    updated_at    DATETIME2(0) NOT NULL CONSTRAINT DF_blog_comments_updated DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_blog_comments_blog
      FOREIGN KEY (blog_id) REFERENCES dbo.blogs (id) ON DELETE CASCADE,
    CONSTRAINT FK_blog_comments_status
      FOREIGN KEY (status) REFERENCES dbo.comment_status_lookup (code),
    CONSTRAINT FK_blog_comments_moderated_by
      FOREIGN KEY (moderated_by) REFERENCES dbo.admin_users (id)
  );

  CREATE INDEX IX_blog_comments_blog ON dbo.blog_comments (blog_id);
  CREATE INDEX IX_blog_comments_status ON dbo.blog_comments (status);
END;
GO

-- -----------------------------------------------------------------------------
-- 8) pdf_imports + pdf_import_items
-- -----------------------------------------------------------------------------
IF OBJECT_ID(N'dbo.pdf_imports', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.pdf_imports (
    id                 UNIQUEIDENTIFIER NOT NULL
                       CONSTRAINT PK_pdf_imports PRIMARY KEY
                       CONSTRAINT DF_pdf_imports_id DEFAULT NEWSEQUENTIALID(),
    file_name          NVARCHAR(255) NOT NULL,
    media_id           UNIQUEIDENTIFIER NULL,
    language_id        UNIQUEIDENTIFIER NULL,
    category_id        UNIQUEIDENTIFIER NULL,
    default_difficulty VARCHAR(20) NOT NULL CONSTRAINT DF_pdf_imports_difficulty DEFAULT 'intermediate',
    status             VARCHAR(20) NOT NULL CONSTRAINT DF_pdf_imports_status DEFAULT 'uploading',
    imported_count     INT NOT NULL CONSTRAINT DF_pdf_imports_count DEFAULT 0,
    error_message      NVARCHAR(MAX) NULL,
    created_by         UNIQUEIDENTIFIER NULL,
    created_at         DATETIME2(0) NOT NULL CONSTRAINT DF_pdf_imports_created DEFAULT SYSUTCDATETIME(),
    updated_at         DATETIME2(0) NOT NULL CONSTRAINT DF_pdf_imports_updated DEFAULT SYSUTCDATETIME(),
    CONSTRAINT CK_pdf_imports_count CHECK (imported_count >= 0),
    CONSTRAINT CK_pdf_imports_has_target CHECK (language_id IS NOT NULL OR category_id IS NOT NULL),
    CONSTRAINT FK_pdf_imports_media
      FOREIGN KEY (media_id) REFERENCES dbo.media_files (id),
    CONSTRAINT FK_pdf_imports_language
      FOREIGN KEY (language_id) REFERENCES dbo.languages (id),
    CONSTRAINT FK_pdf_imports_category
      FOREIGN KEY (category_id) REFERENCES dbo.categories (id),
    CONSTRAINT FK_pdf_imports_difficulty
      FOREIGN KEY (default_difficulty) REFERENCES dbo.difficulty_level_lookup (code),
    CONSTRAINT FK_pdf_imports_status
      FOREIGN KEY (status) REFERENCES dbo.pdf_import_status_lookup (code),
    CONSTRAINT FK_pdf_imports_created_by
      FOREIGN KEY (created_by) REFERENCES dbo.admin_users (id)
  );

  CREATE INDEX IX_pdf_imports_language ON dbo.pdf_imports (language_id);
  CREATE INDEX IX_pdf_imports_status ON dbo.pdf_imports (status);
END;
GO

IF OBJECT_ID(N'dbo.pdf_import_items', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.pdf_import_items (
    id                  UNIQUEIDENTIFIER NOT NULL
                        CONSTRAINT PK_pdf_import_items PRIMARY KEY
                        CONSTRAINT DF_pdf_import_items_id DEFAULT NEWSEQUENTIALID(),
    pdf_import_id       UNIQUEIDENTIFIER NOT NULL,
    question_text       NVARCHAR(MAX) NOT NULL,
    answer_text         NVARCHAR(MAX) NULL,
    description_text    NVARCHAR(MAX) NULL,
    difficulty          VARCHAR(20) NOT NULL CONSTRAINT DF_pdf_import_items_difficulty DEFAULT 'beginner',
    include_item        BIT NOT NULL CONSTRAINT DF_pdf_import_items_include DEFAULT 1,
    sort_order          INT NOT NULL CONSTRAINT DF_pdf_import_items_sort DEFAULT 0,
    created_question_id UNIQUEIDENTIFIER NULL,
    created_at          DATETIME2(0) NOT NULL CONSTRAINT DF_pdf_import_items_created DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_pdf_import_items_import
      FOREIGN KEY (pdf_import_id) REFERENCES dbo.pdf_imports (id) ON DELETE CASCADE,
    CONSTRAINT FK_pdf_import_items_difficulty
      FOREIGN KEY (difficulty) REFERENCES dbo.difficulty_level_lookup (code),
    CONSTRAINT FK_pdf_import_items_question
      FOREIGN KEY (created_question_id) REFERENCES dbo.questions (id) ON DELETE SET NULL
  );

  CREATE INDEX IX_pdf_import_items_import ON dbo.pdf_import_items (pdf_import_id);
END;
GO

-- -----------------------------------------------------------------------------
-- 9) site_settings
-- -----------------------------------------------------------------------------
IF OBJECT_ID(N'dbo.site_settings', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.site_settings (
    id                   UNIQUEIDENTIFIER NOT NULL
                         CONSTRAINT PK_site_settings PRIMARY KEY
                         CONSTRAINT DF_site_settings_id DEFAULT NEWSEQUENTIALID(),
    site_name            NVARCHAR(120) NOT NULL CONSTRAINT DF_site_settings_name DEFAULT N'InterviewHub',
    meta_suffix          NVARCHAR(120) NOT NULL CONSTRAINT DF_site_settings_suffix DEFAULT N'| InterviewHub',
    ga4_connected        BIT NOT NULL CONSTRAINT DF_site_settings_ga4 DEFAULT 0,
    ga4_measurement_id   NVARCHAR(64) NULL,
    adsense_connected    BIT NOT NULL CONSTRAINT DF_site_settings_adsense DEFAULT 0,
    adsense_publisher_id NVARCHAR(64) NULL,
    updated_by           UNIQUEIDENTIFIER NULL,
    created_at           DATETIME2(0) NOT NULL CONSTRAINT DF_site_settings_created DEFAULT SYSUTCDATETIME(),
    updated_at           DATETIME2(0) NOT NULL CONSTRAINT DF_site_settings_updated DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_site_settings_updated_by
      FOREIGN KEY (updated_by) REFERENCES dbo.admin_users (id)
  );
END;
GO

IF NOT EXISTS (SELECT 1 FROM dbo.site_settings)
BEGIN
  INSERT INTO dbo.site_settings (site_name, meta_suffix)
  VALUES (N'InterviewHub', N'| InterviewHub');
END;
GO

-- -----------------------------------------------------------------------------
-- 10) page_views
-- -----------------------------------------------------------------------------
IF OBJECT_ID(N'dbo.page_views', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.page_views (
    id           UNIQUEIDENTIFIER NOT NULL
                 CONSTRAINT PK_page_views PRIMARY KEY
                 CONSTRAINT DF_page_views_id DEFAULT NEWSEQUENTIALID(),
    path         NVARCHAR(500) NOT NULL,
    viewed_at    DATETIME2(0) NOT NULL CONSTRAINT DF_page_views_viewed DEFAULT SYSUTCDATETIME(),
    visitor_hash NVARCHAR(64) NULL,
    referrer     NVARCHAR(500) NULL,
    user_agent   NVARCHAR(500) NULL
  );

  CREATE INDEX IX_page_views_viewed_at ON dbo.page_views (viewed_at DESC);
  CREATE INDEX IX_page_views_path_viewed ON dbo.page_views (path, viewed_at DESC);
END;
GO

-- -----------------------------------------------------------------------------
-- 11) adsense_stats
-- -----------------------------------------------------------------------------
IF OBJECT_ID(N'dbo.adsense_stats', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.adsense_stats (
    id           UNIQUEIDENTIFIER NOT NULL
                 CONSTRAINT PK_adsense_stats PRIMARY KEY
                 CONSTRAINT DF_adsense_stats_id DEFAULT NEWSEQUENTIALID(),
    stat_date    DATE NOT NULL,
    earnings_usd DECIMAL(12, 2) NOT NULL CONSTRAINT DF_adsense_stats_earnings DEFAULT 0,
    page_views   INT NOT NULL CONSTRAINT DF_adsense_stats_views DEFAULT 0,
    clicks       INT NOT NULL CONSTRAINT DF_adsense_stats_clicks DEFAULT 0,
    rpm          DECIMAL(10, 2) NULL,
    ctr          DECIMAL(6, 3) NULL,
    created_at   DATETIME2(0) NOT NULL CONSTRAINT DF_adsense_stats_created DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_adsense_stats_date UNIQUE (stat_date)
  );
END;
GO

-- -----------------------------------------------------------------------------
-- 12) users (public auth — Phase 5)
-- -----------------------------------------------------------------------------
IF OBJECT_ID(N'dbo.users', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.users (
    id             UNIQUEIDENTIFIER NOT NULL
                   CONSTRAINT PK_users PRIMARY KEY
                   CONSTRAINT DF_users_id DEFAULT NEWSEQUENTIALID(),
    name           NVARCHAR(120) NOT NULL,
    email          NVARCHAR(255) NOT NULL,
    password_hash  NVARCHAR(MAX) NULL,
    google_id      NVARCHAR(128) NULL,
    is_active      BIT NOT NULL CONSTRAINT DF_users_is_active DEFAULT 1,
    created_at     DATETIME2(0) NOT NULL CONSTRAINT DF_users_created DEFAULT SYSUTCDATETIME(),
    updated_at     DATETIME2(0) NOT NULL CONSTRAINT DF_users_updated DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_users_email UNIQUE (email),
    CONSTRAINT UQ_users_google_id UNIQUE (google_id)
  );
END;
GO

-- -----------------------------------------------------------------------------
-- 13) bookmarks (reserved)
-- -----------------------------------------------------------------------------
IF OBJECT_ID(N'dbo.bookmarks', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.bookmarks (
    id          UNIQUEIDENTIFIER NOT NULL
                CONSTRAINT PK_bookmarks PRIMARY KEY
                CONSTRAINT DF_bookmarks_id DEFAULT NEWSEQUENTIALID(),
    user_id     UNIQUEIDENTIFIER NOT NULL,
    question_id UNIQUEIDENTIFIER NOT NULL,
    created_at  DATETIME2(0) NOT NULL CONSTRAINT DF_bookmarks_created DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_bookmarks_user_question UNIQUE (user_id, question_id),
    CONSTRAINT FK_bookmarks_user
      FOREIGN KEY (user_id) REFERENCES dbo.users (id) ON DELETE CASCADE,
    CONSTRAINT FK_bookmarks_question
      FOREIGN KEY (question_id) REFERENCES dbo.questions (id) ON DELETE CASCADE
  );

  CREATE INDEX IX_bookmarks_user ON dbo.bookmarks (user_id);
END;
GO

-- -----------------------------------------------------------------------------
-- 14) reading_history (reserved)
-- -----------------------------------------------------------------------------
IF OBJECT_ID(N'dbo.reading_history', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.reading_history (
    id          UNIQUEIDENTIFIER NOT NULL
                CONSTRAINT PK_reading_history PRIMARY KEY
                CONSTRAINT DF_reading_history_id DEFAULT NEWSEQUENTIALID(),
    user_id     UNIQUEIDENTIFIER NOT NULL,
    question_id UNIQUEIDENTIFIER NULL,
    blog_id     UNIQUEIDENTIFIER NULL,
    viewed_at   DATETIME2(0) NOT NULL CONSTRAINT DF_reading_history_viewed DEFAULT SYSUTCDATETIME(),
    CONSTRAINT CK_reading_history_target CHECK (question_id IS NOT NULL OR blog_id IS NOT NULL),
    CONSTRAINT FK_reading_history_user
      FOREIGN KEY (user_id) REFERENCES dbo.users (id) ON DELETE CASCADE,
    CONSTRAINT FK_reading_history_question
      FOREIGN KEY (question_id) REFERENCES dbo.questions (id),
    CONSTRAINT FK_reading_history_blog
      FOREIGN KEY (blog_id) REFERENCES dbo.blogs (id)
  );

  CREATE INDEX IX_reading_history_user ON dbo.reading_history (user_id, viewed_at DESC);
END;
GO

-- -----------------------------------------------------------------------------
-- Views: question counts
-- -----------------------------------------------------------------------------
IF OBJECT_ID(N'dbo.v_language_question_counts', N'V') IS NOT NULL
  DROP VIEW dbo.v_language_question_counts;
GO

CREATE VIEW dbo.v_language_question_counts AS
SELECT
  l.id AS language_id,
  l.name,
  l.slug,
  SUM(CASE WHEN q.difficulty = 'beginner' AND q.status = 'published' THEN 1 ELSE 0 END) AS beginner,
  SUM(CASE WHEN q.difficulty = 'intermediate' AND q.status = 'published' THEN 1 ELSE 0 END) AS intermediate,
  SUM(CASE WHEN q.difficulty = 'expert' AND q.status = 'published' THEN 1 ELSE 0 END) AS expert,
  SUM(CASE WHEN q.status = 'published' THEN 1 ELSE 0 END) AS total_published
FROM dbo.languages l
LEFT JOIN dbo.questions q ON q.language_id = l.id
GROUP BY l.id, l.name, l.slug;
GO

IF OBJECT_ID(N'dbo.v_category_question_counts', N'V') IS NOT NULL
  DROP VIEW dbo.v_category_question_counts;
GO

CREATE VIEW dbo.v_category_question_counts AS
SELECT
  c.id AS category_id,
  c.name,
  c.slug,
  SUM(CASE WHEN q.difficulty = 'beginner' AND q.status = 'published' THEN 1 ELSE 0 END) AS beginner,
  SUM(CASE WHEN q.difficulty = 'intermediate' AND q.status = 'published' THEN 1 ELSE 0 END) AS intermediate,
  SUM(CASE WHEN q.difficulty = 'expert' AND q.status = 'published' THEN 1 ELSE 0 END) AS expert,
  SUM(CASE WHEN q.status = 'published' THEN 1 ELSE 0 END) AS total_published
FROM dbo.categories c
LEFT JOIN dbo.questions q ON q.category_id = c.id
GROUP BY c.id, c.name, c.slug;
GO

PRINT 'InterviewHub SQL Server schema created successfully.';
GO
