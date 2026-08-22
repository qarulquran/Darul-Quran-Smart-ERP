// ==========================================
// Darul Quran Smart ERP
// Finance Dashboard System
// finance-dashboard.js
// ==========================================





// ===============================
// Get Transactions
// ===============================


function getTransactions(){


return JSON.parse(

localStorage.getItem("transactions")

) || [];


}







// ===============================
// Load Dashboard
// ===============================


function loadDashboard(){



let transactions = getTransactions();





let totalIncome = 0;

let totalExpense = 0;

let lillah = 0;

let studentFee = 0;

let programFund = 0;








transactions.forEach(item=>{





let amount =

Number(item.amount) || 0;







// Income


if(item.type === "Income"){


totalIncome += amount;



}







// Expense


if(item.type === "Expense"){


totalExpense += amount;



}








// Lillah Fund


if(

item.category.includes("লিল্লাহ")

||

item.category.includes("যাকাত")

||

item.category.includes("গোরাবা")

||

item.category.includes("দান")

){



if(item.type === "Income"){


lillah += amount;


}



}









// Student Fee


if(

item.category === "Monthly Fee"

||

item.category === "Admission Fee"

||

item.category === "Exam Fee"

){



studentFee += amount;



}









// Program Fund


if(

item.category === "সবক অনুষ্ঠান"

||

item.category === "মাহফিল"

||

item.category === "শিক্ষা সফর"

){



programFund += amount;



}








});









// Balance


let balance =

totalIncome - totalExpense;









document.getElementById(

"totalIncome"

).innerText =

"৳" + totalIncome;







document.getElementById(

"totalExpense"

).innerText =

"৳" + totalExpense;







document.getElementById(

"balance"

).innerText =

"৳" + balance;







document.getElementById(

"lillah"

).innerText =

"৳" + lillah;







document.getElementById(

"studentFee"

).innerText =

"৳" + studentFee;







document.getElementById(

"programFund"

).innerText =

"৳" + programFund;








displayRecent(transactions);



}









// ===============================
// Recent Transaction
// ===============================


function displayRecent(data){



let table =

document.getElementById(

"recentTransaction"

);



if(!table) return;





table.innerHTML = "";






data

.slice()

.reverse()

.slice(0,10)

.forEach(item=>{





table.innerHTML +=



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


</tr>


`;




});



}








// ===============================
// Page Load
// ===============================


loadDashboard();
