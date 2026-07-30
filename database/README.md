# InterviewHub database

## Which file to run?

| File | Use when |
|------|----------|
| [`schema.mssql.sql`](./schema.mssql.sql) | **Microsoft SQL Server / SSMS** ← use this if you got `ENUM` / `$` errors |
| [`schema.sql`](./schema.sql) | PostgreSQL only |

## SQL Server (SSMS)

1. Create a database (once):

```sql
CREATE DATABASE InterviewHub;
GO
```

2. Open `database/schema.mssql.sql` in SSMS  
3. Select database `InterviewHub`  
4. Execute (F5)

## PostgreSQL

```bash
psql -U postgres -d interviewhub -f database/schema.sql
```

## Tables

| Table | Role |
|-------|------|
| `admin_users` | Admin CMS accounts |
| `media_files` | Images + PDFs |
| `languages` | Language hubs |
| `categories` | Category hubs |
| `questions` | Q&A (Beginner / Intermediate / Expert) |
| `question_categories` | Optional M2M question ↔ category |
| `blogs` | Blog posts |
| `blog_comments` | Comments + moderation |
| `pdf_imports` | PDF bulk import jobs |
| `pdf_import_items` | Parsed Q&A before confirm |
| `site_settings` | Site / GA / AdSense settings |
| `page_views` | Traffic for insights |
| `adsense_stats` | Daily AdSense snapshots |
| `users` | Public accounts (later) |
| `bookmarks` | Reserved |
| `reading_history` | Reserved |

Lookup tables (instead of ENUM): `publish_status_lookup`, `difficulty_level_lookup`, `media_type_lookup`, `pdf_import_status_lookup`, `comment_status_lookup`, `admin_role_lookup`.
