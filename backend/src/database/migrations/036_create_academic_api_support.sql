-- ISM Smart ERP
-- Migration 036
-- Academic API Support

BEGIN;

-- --------------------------------------------------
-- Academic indexes for API queries
-- --------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_classes_institute_id
ON classes (institute_id);

CREATE INDEX IF NOT EXISTS idx_class_curriculum_institute_class
ON class_curriculum (institute_id, class_id);

CREATE INDEX IF NOT EXISTS idx_hifz_stages_institute_id
ON hifz_stages (institute_id);

COMMIT;
