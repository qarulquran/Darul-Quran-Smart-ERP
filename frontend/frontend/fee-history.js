// ==========================================
// Fee History System
// ==========================================


function getFees(){

return JSON.parse(

localStorage.getItem("fees")

) || [];

}







function loadFees(data){



let table =
document.getElementById("feeTable");



table.innerHTML="";



data.forEach(fee=>{



let row =
`
<tr>

<td>${fee.receiptNo}</td>

<td>${fee.studentCode}</td>

<td>${fee.feeType}</td>

<td>${fee.month}</td>

<td>৳ ${fee.amount}</td>

<td>${fee.paymentDate}</td>

<td>${fee.paymentMethod}</td>

</tr>
`;



table.innerHTML += row;



});


}








function searchFee(){


let value =
document.getElementById("searchFee")
.value
.trim();



let fees=getFees();



if(value===""){


loadFees(fees);


return;


}



let result =
fees.filter(

fee =>
fee.studentCode.includes(value)

);



loadFees(result);



}







window.onload=function(){


loadFees(getFees());


}
