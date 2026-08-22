// ==========================================
// Darul Quran Smart ERP
// Attendance Management System
// attendance.js
// ==========================================



// ===============================
// Get Data
// ===============================


function getStudents(){


return JSON.parse(

localStorage.getItem("students")

) || [];


}





function getAttendance(){


return JSON.parse(

localStorage.getItem("attendance")

) || [];


}






function saveAttendanceData(data){


localStorage.setItem(

"attendance",

JSON.stringify(data)

);


}








// ===============================
// Selected Student
// ===============================


let selectedStudent = "";







// ===============================
// Search Student
// ===============================


const searchButton =

document.getElementById(

"searchStudent"

);





if(searchButton){



searchButton.addEventListener(

"click",

function(){



let code =

document.getElementById(

"studentCode"

).value.trim();





let students = getStudents();





let student = students.find(item =>



item.studentCode === code



);






if(student){



selectedStudent = student.studentCode;






document.getElementById(

"studentInfo"

).style.display="flex";






document.getElementById(

"studentName"

).innerText =

student.name || "";






document.getElementById(

"studentClass"

).innerText =

student.admissionClass || "";






document.getElementById(

"showCode"

).innerText =

student.studentCode;







if(student.photo){


document.getElementById(

"studentPhoto"

).src = student.photo;


}






displayHistory(student.studentCode);





}

else{


alert(

"Student Not Found"

);



}



});


}









// ===============================
// Save Attendance
// ===============================


const saveButton =

document.getElementById(

"saveAttendance"

);







if(saveButton){



saveButton.addEventListener(

"click",

function(){





if(!selectedStudent){


alert(

"Search Student First"

);


return;


}







let date =

document.getElementById(

"attendanceDate"

).value;





let status =

document.getElementById(

"status"

).value;






if(!date){


alert(

"Select Date"

);


return;


}







let attendance = getAttendance();







// Duplicate Check


let exist = attendance.find(item =>



item.studentCode === selectedStudent

&&

item.date === date



);






if(exist){


alert(

"Attendance Already Added"

);


return;


}








let record = {



attendanceId:

"ATT-"

+

Date.now(),





studentCode:

selectedStudent,





date:

date,





status:

status





};






attendance.push(record);







saveAttendanceData(attendance);







alert(

"Attendance Saved Successfully"

);






displayHistory(selectedStudent);





});


}









// ===============================
// History
// ===============================


function displayHistory(code){



let table =

document.getElementById(

"attendanceList"

);



if(!table) return;






let data = getAttendance();





let history = data.filter(item =>



item.studentCode === code



);






table.innerHTML="";






history.reverse().forEach(item=>{



table.innerHTML +=



`

<tr>


<td>

${item.studentCode}

</td>


<td>

${item.date}

</td>


<td>

${item.status}

</td>


</tr>

`;


});



}
