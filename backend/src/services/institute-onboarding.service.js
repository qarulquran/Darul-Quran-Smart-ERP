/**
 * ISM Smart ERP
 * Institute Onboarding Service
 *
 * Creates a new institute together with:
 * - First owner/admin user
 * - Institute membership
 * - Admin role assignment
 *
 * Everything is created inside one database transaction.
 */

const crypto = require("crypto");

const {
  withTransaction,
} = require("../database/db");

const {
  hashPassword,
} = require("../utils/password");

// --------------------------------------------------
// Service Error Helper
// --------------------------------------------------

const createOnboardingError = (
  message,
  statusCode,
  code
) => {
  const error = new Error(message);

  error.statusCode = statusCode;
  error.code = code;

  return error;
};

// --------------------------------------------------
// Text Helpers
// --------------------------------------------------

const normalizeText = (value) => {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
};

const normalizeEmail = (email) => {
  return normalizeText(email).toLowerCase();
};

const normalizeLanguage = (language) => {
  const allowedLanguages = [
    "bn",
    "en",
    "ar",
  ];

  if (allowedLanguages.includes(language)) {
    return language;
  }

  return "bn";
};

// --------------------------------------------------
// Institute Identity Helpers
// --------------------------------------------------

const createInstituteCode = () => {
  return `ISM-${crypto
    .randomBytes(4)
    .toString("hex")
    .toUpperCase()}`;
};

const createInstituteSlug = (
  instituteName
) => {
  const safeName = instituteName
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);

  const suffix = crypto
    .randomBytes(3)
    .toString("hex");

  if (!safeName) {
    return `institute-${suffix}`;
  }

  return `${safeName}-${suffix}`;
};

// --------------------------------------------------
// Validate Onboarding Input
// --------------------------------------------------

const validateOnboardingInput = ({
  instituteName,
  ownerName,
  email,
  phone,
  password,
}) => {
  if (!normalizeText(instituteName)) {
    throw createOnboardingError(
      "Institute name is required",
      400,
      "INSTITUTE_NAME_REQUIRED"
    );
  }

  if (!normalizeText(ownerName)) {
    throw createOnboardingError(
      "Owner name is required",
      400,
      "OWNER_NAME_REQUIRED"
    );
  }

  if (
    !normalizeText(email) &&
    !normalizeText(phone)
  ) {
    throw createOnboardingError(
      "Owner email or phone is required",
      400,
      "OWNER_CONTACT_REQUIRED"
    );
  }

  if (
    typeof password !== "string" ||
    !password
  ) {
    throw createOnboardingError(
      "Password is required",
      400,
      "PASSWORD_REQUIRED"
    );
  }

  return true;
};

// --------------------------------------------------
// Check Existing Global User
// --------------------------------------------------

const ensureUserDoesNotExist = async (
  client,
  email,
  phone
) => {
  const conditions = [];
  const values = [];

  if (email) {
    values.push(email);

    conditions.push(
      `LOWER(email) = LOWER($${values.length})`
    );
  }

  if (phone) {
    values.push(phone);

    conditions.push(
      `phone = $${values.length}`
    );
  }

  if (conditions.length === 0) {
    return;
  }

  const result = await client.query(
    `
      SELECT
        id,
        email,
        phone
      FROM users
      WHERE ${conditions.join(" OR ")}
      LIMIT 1;
    `,
    values
  );

  if (result.rows.length > 0) {
    throw createOnboardingError(
      "A user with this email or phone already exists",
      409,
      "USER_ALREADY_EXISTS"
    );
  }
};

// --------------------------------------------------
// Create Institute
// --------------------------------------------------

const createInstitute = async (
  client,
  instituteName,
  language
) => {
  const instituteCode =
    createInstituteCode();

  const slug =
    createInstituteSlug(
      instituteName
    );

  const result = await client.query(
    `
      INSERT INTO institutes (
        name,
        slug,
        institute_code,
        default_language,
        supported_languages
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5::jsonb
      )
      RETURNING
        id,
        name,
        slug,
        institute_code,
        default_language,
        supported_languages,
        status,
        created_at;
    `,
    [
      instituteName,
      slug,
      instituteCode,
      language,
      JSON.stringify([
        "bn",
        "en",
        "ar",
      ]),
    ]
  );

  return result.rows[0];
};

// --------------------------------------------------
// Create Owner User
// --------------------------------------------------

const createOwnerUser = async (
  client,
  {
    ownerName,
    email,
    phone,
    passwordHash,
    language,
  }
) => {
  const result = await client.query(
    `
      INSERT INTO users (
        full_name,
        email,
        phone,
        password_hash,
        preferred_language,
        status
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        'active'
      )
      RETURNING
        id,
        full_name,
        email,
        phone,
        preferred_language,
        status,
        created_at;
    `,
    [
      ownerName,
      email || null,
      phone || null,
      passwordHash,
      language,
    ]
  );

  return result.rows[0];
};

// --------------------------------------------------
// Create Institute Membership
// --------------------------------------------------

const createMembership = async (
  client,
  {
    instituteId,
    userId,
    language,
  }
) => {
  const result = await client.query(
    `
      INSERT INTO institute_users (
        institute_id,
        user_id,
        membership_status,
        designation,
        preferred_language,
        accepted_at
      )
      VALUES (
        $1,
        $2,
        'active',
        'Owner / Administrator',
        $3,
        CURRENT_TIMESTAMP
      )
      RETURNING
        id,
        institute_id,
        user_id,
        membership_status,
        designation,
        preferred_language,
        joined_at;
    `,
    [
      instituteId,
      userId,
      language,
    ]
  );

  return result.rows[0];
};

// --------------------------------------------------
// Find Institute Admin Role
// --------------------------------------------------

const findAdminRole = async (
  client,
  instituteId
) => {
  const result = await client.query(
    `
      SELECT
        id,
        institute_id,
        name,
        code,
        status
      FROM roles
      WHERE institute_id = $1
        AND code = 'admin'
        AND status = 'active'
      LIMIT 1;
    `,
    [instituteId]
  );

  if (result.rows.length === 0) {
    throw createOnboardingError(
      "Default institute Admin role was not created",
      500,
      "DEFAULT_ADMIN_ROLE_MISSING"
    );
  }

  return result.rows[0];
};

// --------------------------------------------------
// Assign Admin Role
// --------------------------------------------------

const assignAdminRole = async (
  client,
  {
    membershipId,
    roleId,
    ownerUserId,
  }
) => {
  const result = await client.query(
    `
      INSERT INTO institute_user_roles (
        institute_user_id,
        role_id,
        assigned_by,
        status
      )
      VALUES (
        $1,
        $2,
        $3,
        'active'
      )
      RETURNING
        id,
        institute_user_id,
        role_id,
        assigned_by,
        status,
        created_at;
    `,
    [
      membershipId,
      roleId,
      ownerUserId,
    ]
  );

  return result.rows[0];
};

// --------------------------------------------------
// Main Institute Onboarding
// --------------------------------------------------

const onboardInstitute = async ({
  instituteName,
  ownerName,
  email,
  phone,
  password,
  preferredLanguage = "bn",
}) => {
  validateOnboardingInput({
    instituteName,
    ownerName,
    email,
    phone,
    password,
  });

  const normalizedInstituteName =
    normalizeText(instituteName);

  const normalizedOwnerName =
    normalizeText(ownerName);

  const normalizedEmail =
    normalizeEmail(email);

  const normalizedPhone =
    normalizeText(phone);

  const language =
    normalizeLanguage(
      preferredLanguage
    );

  const passwordHash =
    await hashPassword(password);

  return withTransaction(
    async (client) => {
      await ensureUserDoesNotExist(
        client,
        normalizedEmail,
        normalizedPhone
      );

      const institute =
        await createInstitute(
          client,
          normalizedInstituteName,
          language
        );

      /*
       * Migration 030 trigger creates
       * default institute roles after
       * the institute is inserted.
       */

      const owner =
        await createOwnerUser(
          client,
          {
            ownerName:
              normalizedOwnerName,

            email:
              normalizedEmail,

            phone:
              normalizedPhone,

            passwordHash,
            language,
          }
        );

      const membership =
        await createMembership(
          client,
          {
            instituteId:
              institute.id,

            userId:
              owner.id,

            language,
          }
        );

      const adminRole =
        await findAdminRole(
          client,
          institute.id
        );

      const roleAssignment =
        await assignAdminRole(
          client,
          {
            membershipId:
              membership.id,

            roleId:
              adminRole.id,

            ownerUserId:
              owner.id,
          }
        );

      return {
        institute: {
          id:
            institute.id,

          name:
            institute.name,

          slug:
            institute.slug,

          code:
            institute.institute_code,

          defaultLanguage:
            institute.default_language,

          supportedLanguages:
            institute.supported_languages,
        },

        owner: {
          id:
            owner.id,

          fullName:
            owner.full_name,

          email:
            owner.email,

          phone:
            owner.phone,

          preferredLanguage:
            owner.preferred_language,
        },

        membership: {
          id:
            membership.id,

          status:
            membership.membership_status,

          designation:
            membership.designation,
        },

        role: {
          id:
            adminRole.id,

          code:
            adminRole.code,

          assignmentId:
            roleAssignment.id,
        },
      };
    }
  );
};

// --------------------------------------------------
// Exports
// --------------------------------------------------

module.exports = {
  onboardInstitute,
};
