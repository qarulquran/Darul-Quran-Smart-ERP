// ==========================================
// Darul Quran Smart ERP
// Finance Management System
// finance.js
// ==========================================




// ===============================
// Finance Database
// ===============================


function getTransactions(){


return JSON.parse(

localStorage.getItem("transactions")

) || [];


}








// ===============================
// Save Database
// ===============================


function saveTransactions(data){


localStorage.setItem(

"transactions",

JSON.stringify(data)

);


}








// ===============================
// Category List
// ===============================


const incomeCategories = [


"Monthly Fee",

"Admission Fee",

"Exam Fee",

"ID Card Fee",

"Certificate Fee",

"যাকাত / মান্নত ফান্ড",

"সাধারণ দান ফান্ড",

"গোরাবা ফান্ড",

"সবক অনুষ্ঠান",

"মাহফিল",

"শিক্ষা সফর",

"ব্যানার",

"ভাড়া",

"Other Income"


];






const expenseCategories = [


"শিক্ষক বেতন",

"কর্মচারী বেতন",

"খাবার খরচ",

"বিদ্যুৎ বিল",

"পানি বিল",

"ভাড়া",

"ব্যানার/প্রচার",

"মাহফিল খরচ",

"শিক্ষা সফর খরচ",

"মেরামত",

"Other Expense"


];








// ===============================
// Change Category
// ===============================


const type =

document.getElementById(

"transactionType"

);



const category =

document.getElementById(

"category"

);








function loadCategory(){



category.innerHTML =

"<option>Select Category</option>";





let list =

type.value === "Income"

?

incomeCategories

:

expenseCategories;






list.forEach(item=>{


category.innerHTML +=


`

<option>

${item}

</option>


`;



});



}






if(type){



type.addEventListener(

"change",

loadCategory

);



loadCategory();


}









// ===============================
// Generate Transaction ID
// ===============================


function generateTransactionID(){



let data = getTransactions();





let year =

new Date()

.getFullYear();





let number =

data.length + 1;





return (

"TX-"

+

year

+

"-"

+

String(number)

.padStart(5,"0")

);



}








// ===============================
// Save Transaction
// ===============================


const saveButton =

document.getElementById(

"saveTransaction"

);






if(saveButton){



saveButton.addEventListener(

"click",

function(){






let transaction = {


transactionId:

generateTransactionID(),





type:

document.getElementById(

"transactionType"

).value,





category:

document.getElementById(

"category"

).value,





amount:

document.getElementById(

"amount"

).value,





date:

document.getElementById(

"date"

).value,





method:

document.getElementById(

"method"

).value,





person:

document.getElementById(

"person"

).value,





note:

document.getElementById(

"note"

).value,






createdAt:

new Date()

.toISOString()



};








let data = getTransactions();






data.push(transaction);







saveTransactions(data);







alert(

"Transaction Saved Successfully"

);






displayTransactions();







});



}










// ===============================
// Display History
// ===============================


function displayTransactions(){



let list =

document.getElementById(

"transactionList"

);




if(!list) return;





let data = getTransactions();






list.innerHTML = "";






data.reverse().forEach(item=>{





list.innerHTML +=



`

<tr>


<td>

${item.transactionId}

</td>



<td>

${item.type}

</td>



<td>

${item.category}

</td>



<td>

৳${item.amount}

</td>



<td>

${item.date}

</td>



<td>

${item.method}

</td>


</tr>


`;




});



}








// ===============================
// Load Page
// ===============================


displayTransactions();
