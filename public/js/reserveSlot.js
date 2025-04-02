document.addEventListener("DOMContentLoaded", function () {
    const buildingSelect = document.getElementById("building");
    const roomSelect = document.getElementById("room");
    const dateInput = document.getElementById("date");
    const startTimeSelect = document.getElementById("start-time");
    const endTimeSelect = document.getElementById("end-time");
    const seatSelectionDiv = document.getElementById("seat-selection");
    const anonymousCheck = document.getElementById("anonymous");
    const reserveButton = document.getElementById("reserveButton");
    const confirmSeatsButton = document.getElementById("confirmSeatsButton");
    const studentsSection = document.getElementById("students-section");
    const creditedStudentFields = document.getElementById("credited-student-fields");

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
        seatSelectionDiv.innerHTML = '';  // Reset seat selection area
        studentsSection.style.display = 'none';  // Hide students input section
        confirmSeatsButton.disabled = true;  // Disable the confirm button until seats are selected

        console.log("Building selected:", selectedBuilding);

        if (selectedBuilding) {
            const rooms = labs.filter(lab => lab.building === selectedBuilding);
            console.log("Rooms available in the selected building:", rooms);
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
        const selectedBuilding = buildingSelect.value;
        const selectedRoom = this.value;

        // Find the lab by both room and building
        const selectedLab = labs.find(lab => lab.building === selectedBuilding && lab.room === selectedRoom);

        console.log("Room selected:", selectedRoom);
        if (selectedLab) {
            console.log("Lab found:", selectedLab);

            // Populate available dates based on the lab's available days of the week
            populateDates(selectedLab);

            // Populate available start times based on the selected room's opening and closing times
            populateTimeSlots(selectedLab.openingTime, selectedLab.closingTime);
        }
    });

    // Function to populate available dates based on room's schedule
    function populateDates(selectedLab) {
        const availableDays = selectedLab.daysOpen || [];
        const NUM_DAYS = 14;

        const today = new Date();
        const nextDays = [];

        for (let i = 0; i < NUM_DAYS; i++) {
            let futureDate = new Date(today);
            futureDate.setDate(today.getDate() + i);
            const dayOfWeek = futureDate.toLocaleString("en-US", { weekday: "short" });

            // If the lab is open on that day, add to the list of available dates
            if (availableDays.includes(dayOfWeek)) {
                nextDays.push(futureDate.toISOString().split("T")[0]);
            }
        }

        // Populate the date dropdown with the next 7 available dates
        dateInput.innerHTML = '<option value="" disabled selected>Select a date</option>';
        nextDays.forEach(date => {
            const option = document.createElement("option");
            option.value = date;
            option.textContent = date;
            dateInput.appendChild(option);
        });

        // Enable date input after room is selected
        dateInput.disabled = false;

        console.log("Available dates populated:", nextDays);
    }

    function convertTo24HourFormat(time) {
        // Converts a 12-hour time string (e.g., "02:00 PM") to a 24-hour format (e.g., "14:00")
        const [hour, minute] = time.split(":");
        const [timePart, period] = minute.split(" ");
        let hours = parseInt(hour);
        const minutes = parseInt(timePart);
    
        if (period === "PM" && hours !== 12) {
            hours += 12;  // Convert PM hours (except 12 PM) to 24-hour format
        }
        if (period === "AM" && hours === 12) {
            hours = 0;  // Convert 12 AM to 00 hours
        }
    
        return { hours, minutes };
    }

    function populateTimeSlots(startTime, endTime) {
        console.log("Populating time slots with start:", startTime, "and end:", endTime);
    
        startTimeSelect.innerHTML = '<option value="" disabled selected>Select a start time</option>';
        endTimeSelect.innerHTML = '<option value="" disabled selected>Select an end time</option>';
    
        // Convert startTime and endTime from 12-hour format to 24-hour format
        const start = convertTo24HourFormat(startTime);
        const end = convertTo24HourFormat(endTime);
    
        console.log("Start hour:", start.hours, "End hour:", end.hours);
    
        // Populate start time slots from the converted 24-hour start time
        for (let hour = start.hours; hour < end.hours; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                let timeString = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
                startTimeSelect.appendChild(new Option(timeString, timeString));
            }
        }
    
        // Handle case when start and end times are in the same hour (e.g., 2:00 PM to 2:30 PM)
        if (start.hours === end.hours) {
            for (let minute = start.minutes; minute < end.minutes; minute += 30) {
                let timeString = `${String(start.hours).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
                startTimeSelect.appendChild(new Option(timeString, timeString));
            }
        }
    
        // Ensure the end time is locked initially
        endTimeSelect.disabled = true;
        console.log("Start time slots populated.");
    }

    startTimeSelect.addEventListener("change", function () {
        const selectedBuilding = buildingSelect.value;
        const selectedRoom = roomSelect.value;
        const selectedStartTime = this.value;
        console.log("Start time selected:", selectedStartTime);
    
        // Clear existing end time options
        endTimeSelect.innerHTML = '<option value="" disabled selected>Select an end time</option>';
    
        // Convert selected start time to hours and minutes
        const [startHour, startMinute] = selectedStartTime.split(":");
        let hour = parseInt(startHour);
        let minute = parseInt(startMinute);
    
        console.log("Start time in hours and minutes:", hour, minute);
    
        // Get the lab's closing time
        const selectedLab = labs.find(lab => lab.building === selectedBuilding && lab.room === selectedRoom);
        
        if (!selectedLab || !selectedLab.closingTime) {
            console.error("Closing time not found for the selected lab.");
            return;
        }
        
        console.log("Selected lab:", selectedLab);  // Debugging log
        
        // The closingTime is a string like "08:00 PM"
        const { hours: closingHour, minutes: closingMinute } = convertTo24HourFormat(selectedLab.closingTime);
        
        console.log("Lab closing time (from converted Date):", closingHour, closingMinute);
    
        // Populate end time options starting 30 minutes after the selected start time
        let nextStartTime = new Date();
        nextStartTime.setHours(hour, minute + 30, 0, 0); // Add 30 minutes to the selected start time
    
        // Loop to populate end times up until the lab's closing time
        while (
            nextStartTime.getHours() < closingHour ||
            (nextStartTime.getHours() === closingHour && nextStartTime.getMinutes() <= closingMinute)
        ) {
            let endTimeString = `${String(nextStartTime.getHours()).padStart(2, "0")}:${String(nextStartTime.getMinutes()).padStart(2, "0")}`;
            endTimeSelect.appendChild(new Option(endTimeString, endTimeString));
    
            // Increment by 30 minutes
            nextStartTime.setMinutes(nextStartTime.getMinutes() + 30);
        }
    
        // Enable the end time once a start time is selected
        endTimeSelect.disabled = false;
        console.log("End time options populated.");
    });

    endTimeSelect.addEventListener("change", async function () {
        console.log("End time selected:", this.value);
        await checkRequiredFields();
    });

    dateInput.addEventListener("change", async function () {
        console.log("Date selected:", this.value);
        await checkRequiredFields();
    });

    async function checkRequiredFields() {
        if (areRequiredFieldsSelected()) {
            console.log("All required fields are selected. Populating seats...");

            // Get the selected building, room, date, start, and end time values
            const selectedBuilding = buildingSelect.value;
            const selectedRoom = roomSelect.value;
            const selectedDate = dateInput.value;
            const selectedStartTime = startTimeSelect.value;
            const selectedEndTime = endTimeSelect.value;

            // Get the lab that matches the selected building and room
            const selectedLab = labs.find(lab => lab.building === selectedBuilding && lab.room === selectedRoom);

            if (selectedLab) {
                const seats = await fetchLabSeats(selectedLab._id);
                populateSeats(seats);
            } else {
                console.error("Lab not found.");
            }
        }
    }

    function areRequiredFieldsSelected() {
        const isSelected = buildingSelect.value && roomSelect.value && dateInput.value && startTimeSelect.value && endTimeSelect.value;
        console.log("Are all required fields selected?", isSelected);
        return isSelected;
    }

    async function fetchLabSeats(labID) {
        try {
            const response = await fetch(`/api/seats-by-lab?labID=${labID}`);
            const seats = await response.json();
            console.log("Fetched seats:", seats);
            return seats;
        } catch (error) {
            console.error("Error fetching seats:", error);
            return [];
        }
    }
    
    function populateSeats(seats) {
        console.log("Populating seats with data:", seats);
        seatSelectionDiv.innerHTML = '';
    
        const selectedBuilding = buildingSelect.value;
        const selectedRoom = roomSelect.value;
        const selectedDate = dateInput.value;
        const selectedStartTime = startTimeSelect.value;
        const selectedEndTime = endTimeSelect.value;
    
        console.log("Selected building:", selectedBuilding);
        console.log("Selected room:", selectedRoom);
        console.log("Selected date:", selectedDate);
        console.log("Selected start time:", selectedStartTime);
        console.log("Selected end time:", selectedEndTime);
    
        // Convert start and end times to Date objects for comparison (in local time)
        const [startHour, startMinute] = selectedStartTime.split(":");
        const [endHour, endMinute] = selectedEndTime.split(":");

        const startDate = new Date(selectedDate);
        startDate.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);
        const endDate = new Date(selectedDate);
        endDate.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);

        console.log("Computed Start Date (local time):", startDate.toLocaleString());
        console.log("Computed End Date (local time):", endDate.toLocaleString());

        // Fetch reservations for the selected building, room, and date range
        fetchReservations(selectedBuilding, selectedRoom, startDate, endDate)
            .then(reservations => {
                console.log("Fetched reservations:", reservations);

                // Filter seats that are available during the selected time period
                const availableSeats = seats.filter(seat => {
                    const isReserved = reservations.some(reservation => {
                        // Reservation times are in UTC, just create Date objects (JS auto-converts to local time)
                        const reservationStartLocal = new Date(reservation.startDateTime);
                        const reservationEndLocal = new Date(reservation.endDateTime);

                        console.log(`Seat ${seat.seatNumber} (${seat._id}) reservation check:`, {
                            seatID: seat._id,
                            reservationSeatIDs: reservation.seatIDs,
                            reservationStartLocal: reservationStartLocal.toLocaleString(),
                            reservationEndLocal: reservationEndLocal.toLocaleString(),
                            selectedStart: startDate.toLocaleString(),
                            selectedEnd: endDate.toLocaleString(),
                            condition1: reservation.seatIDs.some(s => s._id === seat._id),
                            condition2: reservationStartLocal < endDate,
                            condition3: reservationEndLocal > startDate
                        });

                        // Check if the seat is reserved
                        return (
                            reservation.seatIDs.some(s => s._id === seat._id) &&
                            reservationStartLocal < endDate &&
                            reservationEndLocal > startDate
                        );
                    });

                    return !isReserved;
                });

                // Process the available seats (populate them, etc.)
                console.log("Available seats:", availableSeats);

                // Clear the previous list
                seatSelectionDiv.innerHTML = '';

                if (availableSeats.length === 0) {
                    seatSelectionDiv.innerHTML = '<p>No available seats for the selected time.</p>';
                    return;
                }

                // Create checkboxes for each available seat
                availableSeats.forEach(seat => {
                    const seatLabel = document.createElement('label');
                    seatLabel.innerHTML = `
                        <input type="checkbox" name="seats" value="${seat._id}">
                        Seat ${seat.seatNumber}
                    `;
                    seatSelectionDiv.appendChild(seatLabel);
                    seatSelectionDiv.appendChild(document.createElement('br')); // Line break for readability
                });
            })
            .catch(error => {
                console.error("Error fetching reservations:", error);
            });
    }

    async function fetchReservations(building, room, startDate, endDate) {
        try {
            console.log("Fetching reservations for:", { building, room, startDate, endDate });
    
            const response = await fetch(`/api/manage-reservations/reservations?building=${building}&room=${room}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
            const reservations = await response.json();
    
            console.log("Reservations fetched:", reservations);
            return reservations;
        } catch (error) {
            console.error("Error fetching reservations:", error);
            return [];
        }
    }



    function resetForm() {
        buildingSelect.value = "";
        roomSelect.innerHTML = '<option value="" disabled selected>Select a building first</option>';
        roomSelect.disabled = true;
        seatSelectionDiv.innerHTML = '<option value="" disabled selected>Loading seats...</option>';
        dateInput.value = "";
        startTimeSelect.innerHTML = '<option value="" disabled selected>Select start time</option>';
        endTimeSelect.innerHTML = '<option value="" disabled selected>Select end time</option>';
        endTimeSelect.disabled = true;
        confirmSeatsButton.disabled = true;
        studentsSection.style.display = 'none';
        reserveButton.disabled = true;
        anonymousCheck.checked = false;

        console.log("Form reset.");
    }



    // EVERYTHING BELOW ISN'T FINALIZED




    confirmSeatsButton.addEventListener("click", function () {
        const selectedSeats = Array.from(seatSelectionDiv.querySelectorAll("input[type='checkbox']:checked"))
            .map(checkbox => checkbox.value);

        console.log("Selected seats:", selectedSeats);

        if (selectedSeats.length === 0) {
            alert("Please select at least one seat.");
            return;
        }

        studentsSection.style.display = 'block';  // Show students input section
        generateStudentFields(selectedSeats.length);
    });

    function generateStudentFields(numberOfSeats) {
        console.log("Generating student input fields for:", numberOfSeats, "seats");

        creditedStudentFields.innerHTML = '';  // Clear previous fields

        for (let i = 0; i < numberOfSeats; i++) {
            const input = document.createElement("input");
            input.type = "text";
            input.classList.add("form-control", "mb-2");
            input.placeholder = `Enter name of student #${i + 1}`;
            creditedStudentFields.appendChild(input);
        }

        // Enable the reserve button once students are entered
        reserveButton.disabled = false;
        console.log("Student input fields generated.");
    }

    reserveButton.addEventListener("click", function () {
        const selectedRoom = roomSelect.value;
        const selectedLab = labs.find(lab => lab.room === selectedRoom);
        const selectedSeats = Array.from(seatSelectionDiv.querySelectorAll("input[type='checkbox']:checked"))
            .map(checkbox => checkbox.value);

        const selectedStudents = Array.from(creditedStudentFields.querySelectorAll("input"))
            .map(input => input.value.trim())
            .filter(value => value);

        console.log("Reservation details:");
        console.log("Selected Room:", selectedRoom);
        console.log("Selected Lab:", selectedLab);
        console.log("Selected Seats:", selectedSeats);
        console.log("Selected Students:", selectedStudents);

        if (!selectedLab || selectedSeats.length === 0 || selectedStudents.length === 0) {
            alert("Please ensure all required fields are filled out.");
            return;
        }

        const reservationData = {
            labID: selectedLab._id,
            seatIDs: selectedSeats,
            startDateTime: new Date(`${dateInput.value}T${startTimeSelect.value}:00.000Z`),
            endDateTime: new Date(`${dateInput.value}T${endTimeSelect.value}:00.000Z`),
            requestingStudentID: "",  // Replace with actual student ID
            creditedStudentIDs: selectedStudents,  // Store credited students here
            purpose: "Lab reservation",
            status: "Reserved",
            isAnonymous: anonymousCheck.checked,
        };

        console.log("Reservation data to be sent:", reservationData);

        fetch(`/api/reservations`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reservationData),
        })
        .then(response => response.json())
        .then(data => {
            console.log("Reservation successful. Server response:", data);
            alert("Reservation successful!");
            resetForm();
        })
        .catch(error => {
            console.error("Error making reservation:", error);
        });
    });


});
