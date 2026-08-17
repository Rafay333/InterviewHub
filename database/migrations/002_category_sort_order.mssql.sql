-- Run once in SSMS on InterviewHub
-- Keeps the 10 core topic hubs in curriculum order (1–10)

IF COL_LENGTH('dbo.categories', 'sort_order') IS NULL
BEGIN
  ALTER TABLE dbo.categories ADD sort_order INT NULL;
END
GO

PRINT 'categories.sort_order added.';
GO
