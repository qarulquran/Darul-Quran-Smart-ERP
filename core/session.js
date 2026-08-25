// ==========================================
// Darul Quran Smart ERP
// Session Management System
// ==========================================


const SESSION_KEY = "ERP_SESSION";



function createSession(user){


    let session = {


        userId: user.id || null,

        username: user.username,

        role: user.role,

        instituteId: user.instituteId || null,

        loginTime: new Date().toISOString()


    };


    localStorage.setItem(

        SESSION_KEY,

        JSON.stringify(session)

    );


    return session;

}





function getSession(){


    return JSON.parse(

        localStorage.getItem(

            SESSION_KEY

        )

    );


}





function destroySession(){


    localStorage.removeItem(

        SESSION_KEY

    );


}





function checkSession(){


    return getSession() !== null;


}





function getUserRole(){


    let session = getSession();


    return session ? session.role : null;


}





window.createSession = createSession;

window.getSession = getSession;

window.destroySession = destroySession;

window.checkSession = checkSession;

window.getUserRole = getUserRole;
