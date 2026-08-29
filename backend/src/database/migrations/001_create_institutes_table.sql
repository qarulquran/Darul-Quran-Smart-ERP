-- ==================================================
-- ISM Smart ERP
-- Migration: 001_create_institutes_table.sql
-- Creates the institutes table for multi-tenant ERP.
-- ==================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS institutes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(255) NOT NULL,
    name_bn VARCHAR(255),
    name_ar VARCHAR(255),

    slug VARCHAR(150) NOT NULL,
    institute_code VARCHAR(100) NOT NULL,

    email VARCHAR(255),
    phone VARCHAR(50),
    website_url TEXT,

    address TEXT,
    city VARCHAR(100),
    district VARCHAR(100),
    country VARCHAR(100) NOT NULL DEFAULT 'Bangladesh',

    logo_url TEXT,

    default_language VARCHAR(10) NOT NULL DEFAULT 'bn',

    supported_languages JSONB NOT NULL
        DEFAULT '["bn","en","ar"]'::jsonb,

    timezone VARCHAR(100) NOT NULL DEFAULT 'Asia/Dhaka',

    currency VARCHAR(10) NOT NULL DEFAULT 'BDT',

    status VARCHAR(30) NOT NULL DEFAULT 'active',

    subscription_status VARCHAR(30)
        NOT NULL DEFAULT 'trial',

    settings JSONB NOT NULL DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_institutes_slug
        UNIQUE (slug),

    CONSTRAINT uq_institutes_code
        UNIQUE (institute_code),

    CONSTRAINT institutes_default_language_check
        CHECK (
            default_language IN ('bn', 'en', 'ar')
        ),

    CONSTRAINT institutes_status_check
        CHECK (
            status IN (
                'active',
                'inactive',
                'suspended',
                'archived'
            )
        ),

    CONSTRAINT institutes_subscription_status_check
        CHECK (
            subscription_status IN (
                'trial',
                'active',
                'past_due',
                'cancelled',
                'expired'
            )
        ),

    CONSTRAINT institutes_supported_languages_check
        CHECK (
            jsonb_typeof(supported_languages) = 'array'
        )
);

CREATE INDEX IF NOT EXISTS idx_institutes_status
    ON institutes (status);

CREATE INDEX IF NOT EXISTS idx_institutes_subscription_status
    ON institutes (subscription_status);

CREATE INDEX IF NOT EXISTS idx_institutes_created_at
    ON institutes (created_at);
