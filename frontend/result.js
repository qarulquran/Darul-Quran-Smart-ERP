// ==========================================
// Darul Quran Smart ERP
// Result Management System
// result.js
// ==========================================





// ===============================
// Get Data
// ===============================


function getStudents(){


return JSON.parse(

localStorage.getItem("students")

) || [];


}







function getResults(){


return JSON.parse(

localStorage.getItem("results")

) || [];


}







function saveResults(data){


localStorage.setItem(

"results",

JSON.stringify(data)

);


}









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





}

else{


alert(

"Student Not Found"

);



}



});


}










// ===============================
// Grade System
// ===============================


function calculateGrade(mark){



if(mark >= 80){

return {

grade:"A+",

gpa:5

};

}



else if(mark >= 70){

return {

grade:"A",

gpa:4

};

}



else if(mark >= 60){

return {

grade:"A-",

gpa:3.5

};

}



else if(mark >= 50){

return {

grade:"B",

gpa:3

};

}



else if(mark >= 40){

return {

grade:"C",

gpa:2

};

}



else if(mark >= 33){

return {

grade:"D",

gpa:1

};

}



else{


return {

grade:"F",

gpa:0

};


}



}









// ===============================
// Save Result
// ===============================


const saveButton =

document.getElementById(

"saveResult"

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







let marks = [



{

subject:"Quran",

mark:Number(

document.getElementById("quran").value

)

},




{

subject:"Bangla",

mark:Number(

document.getElementById("bangla").value

)

},





{

subject:"English",

mark:Number(

document.getElementById("english").value

)

},





{

subject:"Math",

mark:Number(

document.getElementById("math").value

)

}



];








let total = 0;





marks.forEach(item=>{


total += item.mark;


});







let average =

total / marks.length;







let gradeData =

calculateGrade(

average

);








let result = {


resultId:

"RES-"

+

Date.now(),





studentCode:

selectedStudent,





exam:

document.getElementById(

"exam"

).value,





subjects:

marks,





total:

total,





average:

average.toFixed(2),





grade:

gradeData.grade,





gpa:

gradeData.gpa,





date:

new Date()

.toISOString()



};








let results = getResults();







results.push(result);







saveResults(results);







alert(

"Result Saved Successfully"

);







});


}
