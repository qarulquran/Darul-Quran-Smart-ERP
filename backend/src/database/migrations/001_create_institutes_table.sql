-- ============================================================
-- ISM Smart ERP
-- Migration: 001_create_institutes_table.sql
--
-- Purpose:
-- Create the main institutes table for the
-- multi-institution / multi-tenant ERP platform.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS institutes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Basic Information
    name VARCHAR(255) NOT NULL,
    name_bn VARCHAR(255),
    name_ar VARCHAR(255),

    slug VARCHAR(150) NOT NULL UNIQUE,

    institute_code VARCHAR(100) UNIQUE,

    -- Institute Type
    institute_type VARCHAR(50) NOT NULL DEFAULT 'madrasa',

    -- Contact Information
    email VARCHAR(255),
    phone VARCHAR(50),
    website VARCHAR(255),

    -- Address
    address TEXT,
    city VARCHAR(100),
    district VARCHAR(100),
    division VARCHAR(100),
    postal_code VARCHAR(30),
    country VARCHAR(100) NOT NULL DEFAULT 'Bangladesh',

    -- Branding
    logo_url TEXT,

    -- Language Settings
    default_language VARCHAR(10) NOT NULL DEFAULT 'bn',

    supported_languages JSONB NOT NULL
        DEFAULT '["bn", "en", "ar"]'::jsonb,

    -- Regional Settings
    timezone VARCHAR(100) NOT NULL DEFAULT 'Asia/Dhaka',
    currency VARCHAR(10) NOT NULL DEFAULT 'BDT',

    -- Academic Settings
    academic_year_start_month SMALLINT DEFAULT 1,

    -- Tenant Status
    status VARCHAR(30) NOT NULL DEFAULT 'active',

    -- SaaS / Subscription Information
    subscription_plan VARCHAR(50) NOT NULL DEFAULT 'basic',
    subscription_status VARCHAR(30) NOT NULL DEFAULT 'active',
    subscription
