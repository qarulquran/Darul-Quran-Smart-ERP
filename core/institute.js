// ==========================================
// Darul Quran Smart ERP
// Multi-Institution Management Core
// ==========================================

const INSTITUTE_KEY = "ERP_INSTITUTE";


// ==========================================
// Default Institution
// ==========================================

const DEFAULT_INSTITUTE = {

    id: "DQ001",

    code: "DQ001",

    name: "Darul Quran Ahmadia Madrasah",

    type: "Madrasa",

    status: "active"

};


// ==========================================
// Save Institution
// ==========================================

function setInstitution(institution) {

    localStorage.setItem(
        INSTITUTE_KEY,
        JSON.stringify(institution)
    );

}


// ==========================================
// Get Current Institution
// ==========================================

function getInstitution() {

    const saved = localStorage.getItem(
        INSTITUTE_KEY
    );

    if (saved) {

        try {

            return JSON.parse(saved);

        } catch (error) {

            console.error(
                "Institution data error:",
                error
            );

        }

    }

    return DEFAULT_INSTITUTE;

}


// ==========================================
// Get Institution ID
// ==========================================

function getInstitutionId() {

    const institution = getInstitution();

    return institution
        ? institution.id
        : null;

}


// ==========================================
// Check Institution Status
// ==========================================

function isInstitutionActive() {

    const institution = getInstitution();

    return (
        institution &&
        institution.status === "active"
    );

}


// ==========================================
// Clear Institution
// ==========================================

function clearInstitution() {

    localStorage.removeItem(
        INSTITUTE_KEY
    );

}


// ==========================================
// Global Access
// ==========================================

window.DEFAULT_INSTITUTE = DEFAULT_INSTITUTE;

window.setInstitution = setInstitution;

window.getInstitution = getInstitution;

window.getInstitutionId = getInstitutionId;

window.isInstitutionActive = isInstitutionActive;

window.clearInstitution = clearInstitution;
