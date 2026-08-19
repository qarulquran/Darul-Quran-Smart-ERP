function login() {

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;


    if (username === "admin" && password === "12345") {

        alert("Login Successful");

        window.location.href = "dashboard.html";

    } else {

        alert("Invalid Username or Password");

    }

}


// Student Statistics Chart

const studentChart = document.getElementById("studentChart");

if (studentChart) {

    new Chart(studentChart, {

        type: "bar",

        data: {

            labels: [
                "Class 1",
                "Class 2",
                "Class 3",
                "Class 4",
                "Class 5"
            ],

            datasets: [
                {
                    label: "Students",

                    data: [
                        25,
                        35,
                        40,
                        30,
                        45
                    ]
                }
            ]

        },

        options: {

            responsive: true

        }

    });

}
