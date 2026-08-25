// ==========================================
// Darul Quran Smart ERP
// Permission Configuration System
// ==========================================


const PERMISSIONS = {


    SUPER_ADMIN: {


        dashboard: true,

        students: true,

        teachers: true,

        finance: true,

        attendance: true,

        result: true,

        certificate: true,

        settings: true,

        reports: true,

        audit: true

    },





    INSTITUTION_ADMIN: {


        dashboard: true,

        students: true,

        teachers: true,

        finance: true,

        attendance: true,

        result: true,

        certificate: true,

        settings: false,

        reports: true,

        audit: true

    },







    TEACHER: {


        dashboard: true,

        students: true,

        teachers: false,

        finance: false,

        attendance: true,

        result: true,

        certificate: false,

        settings: false,

        reports: true,

        audit: false

    },







    ACCOUNTANT: {


        dashboard: true,

        students: true,

        teachers: false,

        finance: true,

        attendance: false,

        result: false,

        certificate: false,

        settings: false,

        reports: true,

        audit: false

    },







    GUARDIAN: {


        dashboard: true,

        students: false,

        teachers: false,

        finance: false,

        attendance: true,

        result: true,

        certificate: false,

        settings: false,

        reports: false,

        audit: false

    },







    STUDENT: {


        dashboard: true,

        students: false,

        teachers: false,

        finance: false,

        attendance: true,

        result: true,

        certificate: true,

        settings: false,

        reports: false,

        audit: false

    }


};







function checkPermission(role,module){


    if(

        PERMISSIONS[role] &&

        PERMISSIONS[role][module]

    ){

        return true;

    }


    return false;


}





window.PERMISSIONS = PERMISSIONS;

window.checkPermission = checkPermission;
