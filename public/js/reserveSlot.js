document.addEventListener("DOMContentLoaded", function () {
    const buildingSelect = document.getElementById("building");
    const roomSelect = document.getElementById("room");
    const dateInput = document.getElementById("date");
    const startTimeSelect = document.getElementById("start-time");
    const endTimeSelect = document.getElementById("end-time");
    const seatSelect = document.getElementById("seat");
    const anonymousCheck = document.getElementById("anonymous");
    const reserveButton = document.getElementById("reserveButton");

    let labs = window.labsData || [];
    console.log("Labs data loaded:", labs);

    // Load buildings
    const buildings = [...new Set(labs.map(lab => lab.building))];
    buildingSelect.innerHTML = '<option value="" disabled selected>Select a building</option>';
    buildings.forEach(building => {
        const option = document.createElement("option");
        option.value = building;
        option.textContent = building;
        buildingSelect.appendChild(option);
    });

    // Load rooms based on selected building
    buildingSelect.addEventListener("change", function () {
        const selectedBuilding = this.value;
        roomSelect.innerHTML = '<option value="" disabled selected>Select a room</option>';
        roomSelect.disabled = !selectedBuilding;

        if (selectedBuilding) {
            const rooms = labs.filter(lab => lab.building === selectedBuilding);
            rooms.forEach(lab => {
                const option = document.createElement("option");
                option.value = lab.room;
                option.textContent = lab.room;
                roomSelect.appendChild(option);
            });
        }
    });

    // Load seats and time slots when room is selected
    roomSelect.addEventListener("change", function () {
        const selectedRoom = this.value;
        const selectedLab = labs.find(lab => lab.room === selectedRoom);
        if (selectedLab) {
            populateTimeSlots(selectedLab.openingTime, selectedLab.closingTime);
            populateSeats(selectedLab.seatIds);
        }
    });

    function populateSeats(seats) {
        seatSelect.innerHTML = '<option value="" disabled selected>Select an available seat</option>';
        seats.forEach(seat => {
            const option = document.createElement("option");
            option.value = seat._id; // Use MongoDB ObjectId, not seatNumber
            option.textContent = `${seat.seatNumber}`;
            seatSelect.appendChild(option);
        });
    }

    function populateTimeSlots(startTime, endTime) {
        startTimeSelect.innerHTML = '<option value="" disabled selected>Select a start time</option>';
        endTimeSelect.innerHTML = '<option value="" disabled selected>Select an end time</option>';

        let startHour = parseInt(startTime.split(":")[0]);
        let endHour = parseInt(endTime.split(":")[0]);

        for (let hour = startHour; hour < endHour; hour++) {
            let timeString = `${String(hour).padStart(2, "0")}:00`;
            startTimeSelect.appendChild(new Option(timeString, timeString));
        }
    }

    startTimeSelect.addEventListener("change", function () {
        const selectedStartTime = this.value;
        endTimeSelect.innerHTML = '<option value="" disabled selected>Select an end time</option>';
        let startHour = parseInt(selectedStartTime.split(":")[0]);

        for (let hour = startHour + 1; hour <= 22; hour++) {
            let timeString = `${String(hour).padStart(2, "0")}:00`;
            endTimeSelect.appendChild(new Option(timeString, timeString));
        }
    });

    reserveButton.addEventListener("click", function () {
        const selectedRoom = roomSelect.value;
        const selectedLab = labs.find(lab => lab.room === selectedRoom);
        const selectedSeatId = seatSelect.value;

        if (!selectedLab || !selectedSeatId) {
            alert("Please select a seat.");
            return;
        }

        // Convert date and time to JavaScript Date object
        const selectedDate = dateInput.value; // YYYY-MM-DD
        const startTime = startTimeSelect.value; // HH:MM
        const endTime = endTimeSelect.value; // HH:MM

        if (!selectedDate || !startTime || !endTime) {
            alert("Please select a valid date and time.");
            return;
        }

        const startDateTime = new Date(`${selectedDate}T${startTime}:00.000Z`);
        const endDateTime = new Date(`${selectedDate}T${endTime}:00.000Z`);

        const reservationData = {
            labID: selectedLab._id, // Pass the correct lab ID
            seatIDs: [selectedSeatId], // Send as an array
            startDateTime: startDateTime,
            endDateTime: endDateTime,
            requestingStudentID: "", // Replace with the actual student ID
            creditedStudentIDs: [], // Optional
            purpose: "Lab reservation", // Optional, adjust as needed
            status: "Reserved",
            isAnonymous: anonymousCheck.checked,
        };

        console.log("Reservation data to be sent:", reservationData);

        fetch(`/api/reservations`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reservationData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Server response:", data);
            alert("Reservation successful!");
        })
        .catch(error => {
            console.error("Error making reservation:", error);
        });
    });
});
