-- Run once in SSMS on InterviewHub
-- Lets languages belong to a category (Category → Languages → Questions)

IF COL_LENGTH('dbo.languages', 'category_id') IS NULL
BEGIN
  ALTER TABLE dbo.languages
    ADD category_id UNIQUEIDENTIFIER NULL;

  ALTER TABLE dbo.languages
    ADD CONSTRAINT FK_languages_category
    FOREIGN KEY (category_id) REFERENCES dbo.categories (id);

  CREATE INDEX IX_languages_category ON dbo.languages (category_id);
END
GO

PRINT 'languages.category_id added.';
GO
