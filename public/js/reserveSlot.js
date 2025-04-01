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

    resetForm();

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
        seatSelect.disabled = true;  // Disable seat selection until the other fields are chosen
        resetTimeSlots();

        console.log("Building selected:", selectedBuilding);

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
        if (areRequiredFieldsSelected()) {
            const selectedRoom = this.value;
            const selectedLab = labs.find(lab => lab.room === selectedRoom);
            console.log("Room selected:", selectedRoom);

            if (selectedLab) {
                console.log("Lab found:", selectedLab);
                populateTimeSlots(selectedLab.openingTime, selectedLab.closingTime);
                populateSeats(selectedLab.seatIds);
            }
        } else {
            seatSelect.disabled = true;  // Disable seat select if required fields are not selected
        }
    });

    // Check if all required fields are selected
    function areRequiredFieldsSelected() {
        const isSelected = buildingSelect.value && roomSelect.value && dateInput.value && startTimeSelect.value && endTimeSelect.value;
        console.log("Are all required fields selected?", isSelected);
        return isSelected;
    }

    function populateSeats(seats) {
        console.log("Populating seats with data:", seats);
        seatSelect.innerHTML = '<option value="" disabled selected>Select an available seat</option>';
        seats.forEach(seat => {
            const option = document.createElement("option");
            option.value = seat._id; // MongoDB ObjectId for seat
            option.textContent = `${seat.seatNumber}`;
            seatSelect.appendChild(option);
        });
        seatSelect.disabled = false;  // Enable seat selection when rooms and times are selected
    }

    function populateTimeSlots(startTime, endTime) {
        console.log("Populating time slots with start:", startTime, "and end:", endTime);

        startTimeSelect.innerHTML = '<option value="" disabled selected>Select a start time</option>';
        endTimeSelect.innerHTML = '<option value="" disabled selected>Select an end time</option>';

        let startHour = parseInt(startTime.split(":")[0]);
        let endHour = parseInt(endTime.split(":")[0]);

        console.log("Start hour:", startHour, "End hour:", endHour);

        for (let hour = startHour; hour < endHour; hour++) {
            let timeString = `${String(hour).padStart(2, "0")}:00`;
            startTimeSelect.appendChild(new Option(timeString, timeString));
        }

        // Ensure the end time is locked initially
        endTimeSelect.disabled = true;
    }

    startTimeSelect.addEventListener("change", function () {
        const selectedStartTime = this.value;
        console.log("Start time selected:", selectedStartTime);

        endTimeSelect.innerHTML = '<option value="" disabled selected>Select an end time</option>';
        let startHour = parseInt(selectedStartTime.split(":")[0]);

        console.log("Populating end time options from start hour:", startHour);

        for (let hour = startHour + 1; hour <= 22; hour++) {
            let timeString = `${String(hour).padStart(2, "0")}:00`;
            endTimeSelect.appendChild(new Option(timeString, timeString));
        }

        // Enable the end time once a start time is selected
        endTimeSelect.disabled = false;
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
            creditedStudentIDs: [], // Optional, can be populated based on logged-in student
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

            resetForm();
        })
        .catch(error => {
            console.error("Error making reservation:", error);
        });
    });

    function resetForm() {
        buildingSelect.value = "";
        roomSelect.innerHTML = '<option value="" disabled selected>Select a building first</option>';
        roomSelect.disabled = true;
        seatSelect.innerHTML = '<option value="" disabled selected>Loading seats...</option>';
        seatSelect.disabled = true;
        dateInput.value = "";
        startTimeSelect.innerHTML = '<option value="" disabled selected>Select start time</option>';
        endTimeSelect.innerHTML = '<option value="" disabled selected>Select end time</option>';
        endTimeSelect.disabled = true; // Keep end time disabled until start time is selected
        anonymousCheck.checked = false;
    }

    function resetTimeSlots() {
        startTimeSelect.innerHTML = '<option value="" disabled selected>Select start time</option>';
        endTimeSelect.innerHTML = '<option value="" disabled selected>Select end time</option>';
    }
});
