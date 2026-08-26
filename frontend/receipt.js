// ==========================================
// Darul Quran Ahmadia Madrasah
// Smart ERP Money Receipt
// Core-Compatible Final Version
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        "use strict";


        // ======================================
        // Get Last Receipt
        // ======================================

        let payment = null;


        const savedReceipt =
            localStorage.getItem(
                "lastReceipt"
            );


        if (savedReceipt) {

            try {

                payment =
                    JSON.parse(
                        savedReceipt
                    );

            } catch (error) {

                console.error(
                    "Receipt data error:",
                    error
                );

            }

        }


        // ======================================
        // Fallback: Latest Fee
        // ======================================

        if (!payment) {

            let fees = [];


            try {

                if (
                    typeof window.getRecords ===
                    "function"
                ) {

                    fees =
                        window.getRecords(
                            "fees"
                        );

                }

            } catch (error) {

                console.error(
                    "Core fee read error:",
                    error
                );

            }


            if (
                !Array.isArray(fees)
                ||
                fees.length === 0
            ) {

                try {

                    fees =
                        JSON.parse(
                            localStorage.getItem(
                                "fees"
                            )
                        )
                        || [];

                } catch (error) {

                    fees = [];

                }

            }


            if (
                Array.isArray(fees)
                &&
                fees.length > 0
            ) {

                payment =
                    fees[
                        fees.length - 1
                    ];

            }

        }


        // ======================================
        // No Receipt
        // ======================================

        if (!payment) {

            alert(
                "No Receipt Data Found"
            );


            window.location.href =
                "fee.html";


            return;

        }


        // ======================================
        // Students
        // ======================================

        let students = [];


        try {

            if (
                typeof window.getRecords ===
                "function"
            ) {

                students =
                    window.getRecords(
                        "students"
                    );

            }

        } catch (error) {

            console.error(
                "Core student read error:",
                error
            );

        }


        if (
            !Array.isArray(students)
            ||
            students.length === 0
        ) {

            try {

                students =
                    JSON.parse(
                        localStorage.getItem(
                            "students"
                        )
                    )
                    || [];

            } catch (error) {

                students = [];

            }

        }


        // ======================================
        // Find Student
        // ======================================

        const student =
            students.find(
                function (item) {

                    return (
                        item.studentCode
                        ===
                        payment.studentCode
                    );

                }
            );


        // ======================================
        // Helper
        // ======================================

        function setText(
            id,
            value,
            fallback = "-"
        ) {

            const element =
                document.getElementById(id);


            if (!element) {

                return;

            }


            element.innerText =
                value
                ||
                fallback;

        }


        // ======================================
        // Receipt Info
        // ======================================

        setText(
            "receiptNo",
            payment.receiptNo
        );


        setText(
            "paymentDate",
            payment.paymentDate
        );


        // ======================================
        // Student Info
        // ======================================

        setText(

            "studentName",

            student
                ? student.name
                : payment.studentName

        );


        setText(

            "studentCode",

            student
                ? student.studentCode
                : payment.studentCode

        );


        setText(

            "studentClass",

            student
                ? student.admissionClass
                : payment.admissionClass

        );


        setText(

            "fatherName",

            student
                ? student.fatherName
                : payment.fatherName

        );


        // ======================================
        // Payment Info
        // ======================================

        setText(
            "feeType",
            payment.feeType
        );


        setText(
            "feeMonth",
            payment.month
        );


        setText(
            "amount",
            Number(
                payment.amount || 0
            ).toLocaleString(
                "en-BD"
            ),
            "0"
        );


        setText(
            "paymentMethod",
            payment.paymentMethod
        );


        // ======================================
        // Barcode
        // ======================================

        const barcode =
            document.getElementById(
                "barcode"
            );


        if (
            barcode &&
            payment.receiptNo
        ) {

            barcode.innerHTML = "";


            const img =
                document.createElement(
                    "img"
                );


            img.alt =
                "Receipt Barcode";


            img.style.width =
                "220px";


            img.style.maxWidth =
                "100%";


            img.src =

                "https://barcode.tec-it.com/barcode.ashx?data="

                +

                encodeURIComponent(
                    payment.receiptNo
                )

                +

                "&code=Code128";


            barcode.appendChild(
                img
            );

        }

    }
);
