-- =============================================================================
-- STOP — THIS FILE IS FOR POSTGRESQL ONLY
-- =============================================================================
-- You are getting ENUM / pgcrypto / $ errors because this script was opened
-- in Microsoft SQL Server (SSMS).
--
-- For SQL Server / SSMS, close this file and run instead:
--   database/schema.mssql.sql
--
-- Path:
--   c:\Users\MIS\InterviewHub\database\schema.mssql.sql
--
-- Steps:
--   1) CREATE DATABASE InterviewHub;
--   2) Open schema.mssql.sql in SSMS
--   3) Select database InterviewHub
--   4) Press F5
-- =============================================================================
--
-- InterviewHub — Full PostgreSQL schema (do NOT run in SSMS)
-- Engine: PostgreSQL only
-- =============================================================================

BEGIN;

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- Enums
-- -----------------------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE publish_status AS ENUM ('draft', 'published');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'expert');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE media_type AS ENUM ('image', 'pdf');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE pdf_import_status AS ENUM (
    'uploading',
    'extracting',
    'review',
    'imported',
    'failed'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE comment_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE admin_role AS ENUM ('admin');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- -----------------------------------------------------------------------------
-- 1) admin_users — CMS login accounts
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(120) NOT NULL,
  email           VARCHAR(255) NOT NULL,
  password_hash   TEXT NOT NULL,
  role            admin_role NOT NULL DEFAULT 'admin',
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at   TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_admin_users_email UNIQUE (email)
);

-- -----------------------------------------------------------------------------
-- 2) media_files — images & PDFs (Media / Uploads)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS media_files (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name       VARCHAR(255) NOT NULL,
  original_name   VARCHAR(255) NOT NULL,
  file_type       media_type NOT NULL,
  mime_type       VARCHAR(120),
  file_size_bytes BIGINT,
  storage_path    TEXT NOT NULL,
  public_url      TEXT,
  uploaded_by     UUID REFERENCES admin_users (id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_media_files_type ON media_files (file_type);
CREATE INDEX IF NOT EXISTS idx_media_files_uploaded_by ON media_files (uploaded_by);

-- -----------------------------------------------------------------------------
-- 3) languages — public /languages hubs
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS languages (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              VARCHAR(120) NOT NULL,
  slug              VARCHAR(160) NOT NULL,
  description       TEXT,
  picture_url       TEXT,
  picture_media_id  UUID REFERENCES media_files (id) ON DELETE SET NULL,
  -- SEO (can be auto-filled from name in app)
  seo_heading       VARCHAR(255),
  meta_title        VARCHAR(255),
  meta_description  TEXT,
  status            publish_status NOT NULL DEFAULT 'published',
  created_by        UUID REFERENCES admin_users (id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_languages_slug UNIQUE (slug),
  CONSTRAINT uq_languages_name UNIQUE (name)
);

CREATE INDEX IF NOT EXISTS idx_languages_status ON languages (status);

-- -----------------------------------------------------------------------------
-- 4) categories — public /categories hubs
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              VARCHAR(120) NOT NULL,
  slug              VARCHAR(160) NOT NULL,
  description       TEXT,
  picture_url       TEXT,
  picture_media_id  UUID REFERENCES media_files (id) ON DELETE SET NULL,
  seo_heading       VARCHAR(255),
  meta_title        VARCHAR(255),
  meta_description  TEXT,
  status            publish_status NOT NULL DEFAULT 'published',
  sort_order        INT,
  created_by        UUID REFERENCES admin_users (id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_categories_slug UNIQUE (slug),
  CONSTRAINT uq_categories_name UNIQUE (name)
);

CREATE INDEX IF NOT EXISTS idx_categories_status ON categories (status);

ALTER TABLE languages
  ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories (id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_languages_category ON languages (category_id);

-- -----------------------------------------------------------------------------
-- 5) questions — Beginner / Intermediate / Expert Q&A
--    Admin form: language + level + question/answer/description (+ optional pics)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS questions (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Required content
  question_text          TEXT NOT NULL,
  answer_text            TEXT NOT NULL,
  description_text       TEXT,

  -- Optional pictures (URL and/or media FK)
  question_image_url     TEXT,
  answer_image_url       TEXT,
  description_image_url  TEXT,
  question_image_id      UUID REFERENCES media_files (id) ON DELETE SET NULL,
  answer_image_id        UUID REFERENCES media_files (id) ON DELETE SET NULL,
  description_image_id   UUID REFERENCES media_files (id) ON DELETE SET NULL,

  -- Classification
  language_id            UUID REFERENCES languages (id) ON DELETE SET NULL,
  category_id            UUID REFERENCES categories (id) ON DELETE SET NULL,
  difficulty             difficulty_level NOT NULL DEFAULT 'beginner',
  status                 publish_status NOT NULL DEFAULT 'draft',

  -- SEO / public URL
  slug                   VARCHAR(220) NOT NULL,
  meta_title             VARCHAR(255),
  meta_description       TEXT,

  created_by             UUID REFERENCES admin_users (id) ON DELETE SET NULL,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_questions_slug UNIQUE (slug),
  -- At least one hub: language or category
  CONSTRAINT ck_questions_has_hub CHECK (
    language_id IS NOT NULL OR category_id IS NOT NULL
  )
);

CREATE INDEX IF NOT EXISTS idx_questions_language ON questions (language_id);
CREATE INDEX IF NOT EXISTS idx_questions_category ON questions (category_id);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions (difficulty);
CREATE INDEX IF NOT EXISTS idx_questions_status ON questions (status);
CREATE INDEX IF NOT EXISTS idx_questions_language_difficulty
  ON questions (language_id, difficulty)
  WHERE status = 'published';

-- Optional many-to-many if a question appears in multiple categories later
CREATE TABLE IF NOT EXISTS question_categories (
  question_id  UUID NOT NULL REFERENCES questions (id) ON DELETE CASCADE,
  category_id  UUID NOT NULL REFERENCES categories (id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (question_id, category_id)
);

CREATE INDEX IF NOT EXISTS idx_question_categories_category
  ON question_categories (category_id);

-- -----------------------------------------------------------------------------
-- 6) blogs
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS blogs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title             VARCHAR(255) NOT NULL,
  slug              VARCHAR(220) NOT NULL,
  excerpt           TEXT,
  body              TEXT NOT NULL,
  category_tag      VARCHAR(120),
  featured_image_url TEXT,
  featured_image_id UUID REFERENCES media_files (id) ON DELETE SET NULL,
  author_name       VARCHAR(120),
  author_title      VARCHAR(120),
  read_minutes      INT NOT NULL DEFAULT 5 CHECK (read_minutes > 0),
  is_featured       BOOLEAN NOT NULL DEFAULT FALSE,
  status            publish_status NOT NULL DEFAULT 'draft',
  seo_heading       VARCHAR(255),
  meta_title        VARCHAR(255),
  meta_description  TEXT,
  published_at      TIMESTAMPTZ,
  created_by        UUID REFERENCES admin_users (id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_blogs_slug UNIQUE (slug)
);

CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs (status);
CREATE INDEX IF NOT EXISTS idx_blogs_featured ON blogs (is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_blogs_published_at ON blogs (published_at DESC NULLS LAST);

-- -----------------------------------------------------------------------------
-- 7) blog_comments — public comments + admin moderation
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS blog_comments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id       UUID NOT NULL REFERENCES blogs (id) ON DELETE CASCADE,
  author_name   VARCHAR(120) NOT NULL,
  author_email  VARCHAR(255),
  body          TEXT NOT NULL,
  status        comment_status NOT NULL DEFAULT 'pending',
  moderated_by  UUID REFERENCES admin_users (id) ON DELETE SET NULL,
  moderated_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_comments_blog ON blog_comments (blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_status ON blog_comments (status);

-- -----------------------------------------------------------------------------
-- 8) pdf_imports — bulk PDF → questions wizard
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pdf_imports (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name            VARCHAR(255) NOT NULL,
  media_id             UUID REFERENCES media_files (id) ON DELETE SET NULL,
  language_id          UUID REFERENCES languages (id) ON DELETE SET NULL,
  category_id          UUID REFERENCES categories (id) ON DELETE SET NULL,
  default_difficulty   difficulty_level NOT NULL DEFAULT 'intermediate',
  status               pdf_import_status NOT NULL DEFAULT 'uploading',
  imported_count       INT NOT NULL DEFAULT 0 CHECK (imported_count >= 0),
  error_message        TEXT,
  created_by           UUID REFERENCES admin_users (id) ON DELETE SET NULL,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT ck_pdf_imports_has_target CHECK (
    language_id IS NOT NULL OR category_id IS NOT NULL
  )
);

CREATE INDEX IF NOT EXISTS idx_pdf_imports_language ON pdf_imports (language_id);
CREATE INDEX IF NOT EXISTS idx_pdf_imports_status ON pdf_imports (status);

-- Parsed rows before confirm import
CREATE TABLE IF NOT EXISTS pdf_import_items (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pdf_import_id     UUID NOT NULL REFERENCES pdf_imports (id) ON DELETE CASCADE,
  question_text     TEXT NOT NULL,
  answer_text       TEXT,
  description_text  TEXT,
  difficulty        difficulty_level NOT NULL DEFAULT 'beginner',
  include_item      BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order        INT NOT NULL DEFAULT 0,
  created_question_id UUID REFERENCES questions (id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pdf_import_items_import
  ON pdf_import_items (pdf_import_id);

-- -----------------------------------------------------------------------------
-- 9) site_settings — single-row style settings (AdSense / GA / SEO defaults)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS site_settings (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name             VARCHAR(120) NOT NULL DEFAULT 'InterviewHub',
  meta_suffix           VARCHAR(120) NOT NULL DEFAULT '| InterviewHub',
  ga4_connected         BOOLEAN NOT NULL DEFAULT FALSE,
  ga4_measurement_id    VARCHAR(64),
  adsense_connected     BOOLEAN NOT NULL DEFAULT FALSE,
  adsense_publisher_id  VARCHAR(64),
  updated_by            UUID REFERENCES admin_users (id) ON DELETE SET NULL,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 10) page_views — traffic insights (24h / 7d / 30d / 12m aggregations)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS page_views (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path         VARCHAR(500) NOT NULL,
  viewed_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  visitor_hash VARCHAR(64),
  referrer     TEXT,
  user_agent   TEXT
);

CREATE INDEX IF NOT EXISTS idx_page_views_viewed_at ON page_views (viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_path_viewed ON page_views (path, viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_visitor_viewed ON page_views (visitor_hash, viewed_at DESC);

-- -----------------------------------------------------------------------------
-- 11) adsense_stats — optional daily earnings snapshots for Dashboard
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS adsense_stats (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stat_date     DATE NOT NULL,
  earnings_usd  NUMERIC(12, 2) NOT NULL DEFAULT 0,
  page_views    INT NOT NULL DEFAULT 0,
  clicks        INT NOT NULL DEFAULT 0,
  rpm           NUMERIC(10, 2),
  ctr           NUMERIC(6, 3),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_adsense_stats_date UNIQUE (stat_date)
);

-- -----------------------------------------------------------------------------
-- 12) users — public Sign in / Sign up (reserved for Phase 5)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(120) NOT NULL,
  email           VARCHAR(255) NOT NULL,
  password_hash   TEXT,
  google_id       VARCHAR(128),
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at   TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_users_email UNIQUE (email),
  CONSTRAINT uq_users_google_id UNIQUE (google_id)
);

-- -----------------------------------------------------------------------------
-- 13) bookmarks — reserved (after public auth)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bookmarks (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  question_id  UUID NOT NULL REFERENCES questions (id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_bookmarks_user_question UNIQUE (user_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks (user_id);

-- -----------------------------------------------------------------------------
-- 14) reading_history — reserved
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reading_history (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  question_id  UUID REFERENCES questions (id) ON DELETE CASCADE,
  blog_id      UUID REFERENCES blogs (id) ON DELETE CASCADE,
  viewed_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT ck_reading_history_target CHECK (
    question_id IS NOT NULL OR blog_id IS NOT NULL
  )
);

CREATE INDEX IF NOT EXISTS idx_reading_history_user ON reading_history (user_id, viewed_at DESC);

-- -----------------------------------------------------------------------------
-- Helper view: question counts per language / difficulty (admin list)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_language_question_counts AS
SELECT
  l.id AS language_id,
  l.name,
  l.slug,
  COUNT(q.id) FILTER (WHERE q.difficulty = 'beginner' AND q.status = 'published') AS beginner,
  COUNT(q.id) FILTER (WHERE q.difficulty = 'intermediate' AND q.status = 'published') AS intermediate,
  COUNT(q.id) FILTER (WHERE q.difficulty = 'expert' AND q.status = 'published') AS expert,
  COUNT(q.id) FILTER (WHERE q.status = 'published') AS total_published
FROM languages l
LEFT JOIN questions q ON q.language_id = l.id
GROUP BY l.id, l.name, l.slug;

CREATE OR REPLACE VIEW v_category_question_counts AS
SELECT
  c.id AS category_id,
  c.name,
  c.slug,
  COUNT(q.id) FILTER (WHERE q.difficulty = 'beginner' AND q.status = 'published') AS beginner,
  COUNT(q.id) FILTER (WHERE q.difficulty = 'intermediate' AND q.status = 'published') AS intermediate,
  COUNT(q.id) FILTER (WHERE q.difficulty = 'expert' AND q.status = 'published') AS expert,
  COUNT(q.id) FILTER (WHERE q.status = 'published') AS total_published
FROM categories c
LEFT JOIN questions q ON q.category_id = c.id
GROUP BY c.id, c.name, c.slug;

-- -----------------------------------------------------------------------------
-- updated_at trigger
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'admin_users',
    'media_files',
    'languages',
    'categories',
    'questions',
    'blogs',
    'blog_comments',
    'pdf_imports',
    'site_settings',
    'users'
  ]
  LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS trg_%s_updated_at ON %I;
       CREATE TRIGGER trg_%s_updated_at
       BEFORE UPDATE ON %I
       FOR EACH ROW EXECUTE FUNCTION set_updated_at();',
      t, t, t, t
    );
  END LOOP;
END $$;

-- Seed empty settings row
INSERT INTO site_settings (site_name, meta_suffix)
SELECT 'InterviewHub', '| InterviewHub'
WHERE NOT EXISTS (SELECT 1 FROM site_settings);

COMMIT;

-- =============================================================================
-- Relationship summary
-- =============================================================================
-- admin_users          ← created_by / uploaded_by / moderated_by
-- media_files          ← languages, categories, questions, blogs, pdf_imports
-- languages            ← questions.language_id, pdf_imports.language_id
-- categories           ← questions.category_id, question_categories, pdf_imports
-- questions            ← question_categories, pdf_import_items, bookmarks
-- blogs                ← blog_comments, reading_history
-- users                ← bookmarks, reading_history  (Phase 5)
-- Companies            — intentionally omitted (later)
-- =============================================================================
