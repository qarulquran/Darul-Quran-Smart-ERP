// ==========================================
// Darul Quran Smart ERP
// Database Manager
// Core Data Access Layer
// ==========================================

const DATABASE_PREFIX = "ERP_DB";


// ==========================================
// Safe JSON Parser
// ==========================================

function parseData(value, fallback) {

    if (!value) {
        return fallback;
    }

    try {

        return JSON.parse(value);

    } catch (error) {

        console.error(
            "Database JSON parse error:",
            error
        );

        return fallback;
    }
}


// ==========================================
// Get Current Institution ID
// ==========================================

function getDatabaseInstitutionId() {

    if (
        typeof window.getInstitutionId === "function"
    ) {

        return (
            window.getInstitutionId()
            || "DEFAULT"
        );

    }

    return "DEFAULT";
}


// ==========================================
// Build Storage Key
// ==========================================

function buildDatabaseKey(collection) {

    const institutionId =
        getDatabaseInstitutionId();

    return (
        DATABASE_PREFIX +
        "_" +
        institutionId +
        "_" +
        collection
    );
}


// ==========================================
// Get Records
// ==========================================

function getRecords(collection) {

    const key =
        buildDatabaseKey(collection);

    const data =
        localStorage.getItem(key);

    return parseData(data, []);
}


// ==========================================
// Save Records
// ==========================================

function saveRecords(
    collection,
    records
) {

    const key =
        buildDatabaseKey(collection);

    localStorage.setItem(
        key,
        JSON.stringify(records)
    );

}


// ==========================================
// Add Record
// ==========================================

function addRecord(
    collection,
    record
) {

    const records =
        getRecords(collection);

    records.push(record);

    saveRecords(
        collection,
        records
    );

    return record;
}


// ==========================================
// Find Record
// ==========================================

function findRecord(
    collection,
    id
) {

    const records =
        getRecords(collection);

    return (
        records.find(
            item =>
                String(item.id) ===
                String(id)
        )
        || null
    );
}


// ==========================================
// Find By Student Code
// ==========================================

function findStudentByCode(
    collection,
    studentCode
) {

    const records =
        getRecords(collection);

    return (
        records.find(
            item =>
                item.studentCode ===
                studentCode
        )
        || null
    );
}


// ==========================================
// Update Record
// ==========================================

function updateRecord(
    collection,
    id,
    updatedData
) {

    const records =
        getRecords(collection);

    const index =
        records.findIndex(
            item =>
                String(item.id) ===
                String(id)
        );

    if (index === -1) {

        return false;

    }

    records[index] = {

        ...records[index],

        ...updatedData

    };

    saveRecords(
        collection,
        records
    );

    return records[index];
}


// ==========================================
// Delete Record
// ==========================================

function deleteRecord(
    collection,
    id
) {

    const records =
        getRecords(collection);

    const filtered =
        records.filter(
            item =>
                String(item.id) !==
                String(id)
        );

    if (
        filtered.length ===
        records.length
    ) {

        return false;

    }

    saveRecords(
        collection,
        filtered
    );

    return true;
}


// ==========================================
// Count Records
// ==========================================

function countRecords(
    collection
) {

    return getRecords(
        collection
    ).length;
}


// ==========================================
// Clear Collection
// ==========================================

function clearCollection(
    collection
) {

    const key =
        buildDatabaseKey(collection);

    localStorage.removeItem(key);

}


// ==========================================
// Check Collection Exists
// ==========================================

function collectionExists(
    collection
) {

    const key =
        buildDatabaseKey(collection);

    return (
        localStorage.getItem(key)
        !== null
    );
}


// ==========================================
// Legacy Data Reader
// ==========================================
// This reads the current system's old
// unscoped localStorage data without
// changing or deleting it.

function getLegacyData(
    collection
) {

    const data =
        localStorage.getItem(
            collection
        );

    return parseData(
        data,
        []
    );
}


// ==========================================
// Migrate Legacy Data
// ==========================================
// Copies old data into the current
// institution namespace.
// Existing old data remains untouched.

function migrateLegacyCollection(
    collection
) {

    const legacyData =
        getLegacyData(collection);

    if (
        !Array.isArray(legacyData)
        ||
        legacyData.length === 0
    ) {

        return 0;

    }

    const currentData =
        getRecords(collection);

    if (currentData.length > 0) {

        return currentData.length;

    }

    saveRecords(
        collection,
        legacyData
    );

    return legacyData.length;
}


// ==========================================
// Backup Current Institution Data
// ==========================================

function exportInstitutionData() {

    const institutionId =
        getDatabaseInstitutionId();

    const collections = [
        "students",
        "fees",
        "attendance",
        "teachers",
        "results",
        "payments",
        "notifications"
    ];

    const backup = {

        institutionId:
            institutionId,

        exportedAt:
            new Date().toISOString(),

        data: {}

    };


    collections.forEach(
        collection => {

            backup.data[collection] =
                getRecords(collection);

        }
    );


    return backup;
}


// ==========================================
// Global Access
// ==========================================

window.getRecords =
    getRecords;

window.saveRecords =
    saveRecords;

window.addRecord =
    addRecord;

window.findRecord =
    findRecord;

window.findStudentByCode =
    findStudentByCode;

window.updateRecord =
    updateRecord;

window.deleteRecord =
    deleteRecord;

window.countRecords =
    countRecords;

window.clearCollection =
    clearCollection;

window.collectionExists =
    collectionExists;

window.getLegacyData =
    getLegacyData;

window.migrateLegacyCollection =
    migrateLegacyCollection;

window.exportInstitutionData =
    exportInstitutionData;
