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
    const purposeInput = document.getElementById("reservation-purpose");
    const remainingCharacters = document.getElementById("remaining-characters");

    let labs = window.labsData || [];
    console.log("Labs data loaded:", labs);

    resetForm();

    // Load buildings with available slots
    async function loadBuildings() {
        const buildings = [...new Set(labs.map(lab => lab.building))];
        buildingSelect.innerHTML = '<option value="" disabled selected>Select a building</option>';

        for (const building of buildings) {
            const buildingLabs = labs.filter(lab => lab.building === building);
            let hasAvailableSlots = false;

            for (const lab of buildingLabs) {
                const seats = await fetchLabSeats(lab._id);
                if (seats.length > 0) {
                    hasAvailableSlots = true;
                    break;
                }
            }

            if (hasAvailableSlots) {
                const option = document.createElement("option");
                option.value = building;
                option.textContent = building;
                buildingSelect.appendChild(option);
            }
        }
    }

    // Load buildings on page load
    loadBuildings();

    // Load rooms based on selected building
    buildingSelect.addEventListener("change", function () {
        const selectedBuilding = this.value;
        roomSelect.innerHTML = '<option value="" disabled selected>Select a room</option>';
        roomSelect.disabled = !selectedBuilding;
        dateInput.value = "";
        dateInput.disabled = true;
        startTimeSelect.innerHTML = '<option value="" disabled selected>Select start time</option>';
        startTimeSelect.disabled = true;
        endTimeSelect.innerHTML = '<option value="" disabled selected>Select end time</option>';
        endTimeSelect.disabled = true;
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

            // Reset and disable time selects
            startTimeSelect.innerHTML = '<option value="" disabled selected>Select a start time</option>';
            endTimeSelect.innerHTML = '<option value="" disabled selected>Select an end time</option>';
            startTimeSelect.disabled = true;
            endTimeSelect.disabled = true;
        }
    });

    // Function to populate available dates based on room's schedule
    function populateDates(selectedLab) {
        const availableDays = selectedLab.daysOpen || [];
        const NUM_DAYS = 7;

        const today = new Date();
        const nextDays = [];

        for (let i = 0; i < NUM_DAYS; i++) {
            let futureDate = new Date(today);
            futureDate.setDate(today.getDate() + i);
            const dayOfWeek = futureDate.toLocaleString("en-US", { weekday: "short" });

            // Map short day names to match the format in the lab data
            const dayMap = {
                'Mon': 'Mon',
                'Tue': 'Tue',
                'Wed': 'Wed',
                'Thu': 'Thu',
                'Fri': 'Fri',
                'Sat': 'Sat',
                'Sun': 'Sun'
            };

            // If the lab is open on that day, add to the list of available dates
            if (availableDays.includes(dayMap[dayOfWeek])) {
                const formattedDate = futureDate.toLocaleDateString("en-US", {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                const dayName = futureDate.toLocaleDateString("en-US", { weekday: 'long' });
                nextDays.push({
                    date: futureDate.toLocaleDateString("en-US"),
                    display: `${formattedDate} (${dayName})`
                });
            }
        }

        // Populate the date dropdown with the next 7 available dates
        dateInput.innerHTML = '<option value="" disabled selected>Select a date</option>';
        nextDays.forEach(dateObj => {
            const option = document.createElement("option");
            option.value = dateObj.date;
            option.textContent = dateObj.display;
            dateInput.appendChild(option);
        });

        // Enable date input after room is selected
        dateInput.disabled = false;
        startTimeSelect.disabled = true;
        endTimeSelect.disabled = true;

        console.log("Available dates populated:", nextDays);
    }

    function convertTo24HourFormat(time) {
        // Converts a 12-hour time string (e.g., "07:00 AM") to a 24-hour format (e.g., "07:00")
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

        const start = convertTo24HourFormat(startTime);
        const end = convertTo24HourFormat(endTime);

        console.log("Start hour:", start.hours, "Start minute:", start.minutes, "End hour:", end.hours, "End minute:", end.minutes);

        // Get current time and selected date
        const now = new Date();
        const selectedDateStr = dateInput.value;
        console.log("Selected date string:", selectedDateStr);

        // Parse the selected date string (format: M/D/YYYY)
        const dateParts = selectedDateStr.split('/');
        const month = parseInt(dateParts[0]);
        const day = parseInt(dateParts[1]);
        const year = parseInt(dateParts[2]);

        const selectedDate = new Date(year, month - 1, day);

        // Compare dates by year, month, and day only
        const isToday = now.getFullYear() === selectedDate.getFullYear() &&
            now.getMonth() === selectedDate.getMonth() &&
            now.getDate() === selectedDate.getDate();

        console.log("Current date:", now.toLocaleDateString());
        console.log("Selected date:", selectedDate.toLocaleDateString());
        console.log("Is today?", isToday);

        let currentHour = start.hours;
        let currentMinute = start.minutes;

        // If it's today, adjust the start time based on current time
        if (isToday) {
            const currentHourNow = now.getHours();
            const currentMinuteNow = now.getMinutes();

            console.log("Current time:", currentHourNow + ":" + currentMinuteNow);

            // If current time is after lab opening time
            if (currentHourNow > start.hours || (currentHourNow === start.hours && currentMinuteNow >= start.minutes)) {
                // Round up to the next 30-minute slot
                currentHour = currentHourNow;
                currentMinute = Math.ceil(currentMinuteNow / 30) * 30;

                // If we rounded up to the next hour
                if (currentMinute === 60) {
                    currentHour++;
                    currentMinute = 0;
                }

                console.log("Adjusted start time:", currentHour + ":" + currentMinute);

                // If the rounded time is after lab closing time, no slots available
                if (currentHour > end.hours || (currentHour === end.hours && currentMinute >= end.minutes)) {
                    startTimeSelect.innerHTML = '<option value="" disabled>No available slots for today</option>';
                    startTimeSelect.disabled = true;
                    return;
                }
            }
        }

        // Loop until we reach the end time
        while (currentHour < end.hours || (currentHour === end.hours && currentMinute < end.minutes)) {
            // Format the time in 12-hour format
            let displayHour = currentHour;
            let period = "AM";

            if (displayHour >= 12) {
                period = "PM";
                if (displayHour > 12) {
                    displayHour -= 12;
                }
            }
            if (displayHour === 0) {
                displayHour = 12;
            }

            const timeString = `${String(currentHour).padStart(2, "0")}:${String(currentMinute).padStart(2, "0")}`;
            const displayString = `${String(displayHour).padStart(2, "0")}:${String(currentMinute).padStart(2, "0")} ${period}`;

            console.log("Adding time slot:", displayString);
            const option = new Option(displayString, timeString);
            startTimeSelect.appendChild(option);

            currentMinute += 30;

            if (currentMinute === 60) {
                currentMinute = 0;
                currentHour++;
            }
        }

        endTimeSelect.disabled = true;
        startTimeSelect.disabled = false;
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
        nextStartTime.setHours(hour, minute + 30, 0, 0);

        // Loop until we reach the end time
        while (nextStartTime.getHours() < closingHour ||
        (nextStartTime.getHours() === closingHour && nextStartTime.getMinutes() <= closingMinute)) {
            let displayHour = nextStartTime.getHours();
            let period = "AM";

            if (displayHour >= 12) {
                period = "PM";
                if (displayHour > 12) {
                    displayHour -= 12;
                }
            }
            if (displayHour === 0) {
                displayHour = 12;
            }

            const timeString = `${String(nextStartTime.getHours()).padStart(2, "0")}:${String(nextStartTime.getMinutes()).padStart(2, "0")}`;
            const displayString = `${String(displayHour).padStart(2, "0")}:${String(nextStartTime.getMinutes()).padStart(2, "0")} ${period}`;

            const option = new Option(displayString, timeString);
            endTimeSelect.appendChild(option);

            // Increment by 30 minutes
            nextStartTime.setMinutes(nextStartTime.getMinutes() + 30);
        }

        endTimeSelect.disabled = false;
        console.log("End time options populated.");
    });

    endTimeSelect.addEventListener("change", async function () {
        console.log("End time selected:", this.value);
        await checkRequiredFields();
    });

    // Handle date selection
    dateInput.addEventListener("change", async function () {
        console.log("Date selected:", this.value);

        // Get the selected lab
        const selectedBuilding = buildingSelect.value;
        const selectedRoom = roomSelect.value;
        const selectedLab = labs.find(lab => lab.building === selectedBuilding && lab.room === selectedRoom);

        if (selectedLab && this.value) {
            // Populate time slots based on the selected date
            populateTimeSlots(selectedLab.openingTime, selectedLab.closingTime);
        } else {
            // Reset time selects if no date is selected
            startTimeSelect.innerHTML = '<option value="" disabled selected>Select a start time</option>';
            endTimeSelect.innerHTML = '<option value="" disabled selected>Select an end time</option>';
            startTimeSelect.disabled = true;
            endTimeSelect.disabled = true;
        }

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

                // Create a container for the seat grid
                const seatGrid = document.createElement('div');
                seatGrid.className = 'seat-grid';
                seatGrid.style.display = 'grid';
                seatGrid.style.gridTemplateColumns = 'repeat(5, 1fr)';
                seatGrid.style.gap = '10px';
                seatGrid.style.marginBottom = '20px';

                // Create checkboxes for each available seat
                availableSeats.forEach(seat => {
                    const seatContainer = document.createElement('div');
                    seatContainer.className = 'seat-container';

                    const seatLabel = document.createElement('label');
                    seatLabel.className = 'seat-label';
                    seatLabel.style.display = 'flex';
                    seatLabel.style.alignItems = 'center';
                    seatLabel.style.gap = '5px';

                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.name = 'seats';
                    checkbox.value = seat._id;

                    const seatNumber = document.createElement('span');
                    seatNumber.textContent = `Seat ${seat.seatNumber}`;

                    seatLabel.appendChild(checkbox);
                    seatLabel.appendChild(seatNumber);
                    seatContainer.appendChild(seatLabel);
                    seatGrid.appendChild(seatContainer);
                });

                seatSelectionDiv.appendChild(seatGrid);
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

    // Update button styles and behavior
    confirmSeatsButton.classList.add('btn', 'btn-secondary');
    confirmSeatsButton.style.backgroundColor = '#880D1E';
    confirmSeatsButton.style.color = 'white';
    confirmSeatsButton.style.border = 'none';
    confirmSeatsButton.style.opacity = '0.5';
    confirmSeatsButton.disabled = true;

    reserveButton.classList.add('btn', 'btn-primary');
    reserveButton.style.backgroundColor = '#880D1E';
    reserveButton.style.color = 'white';
    reserveButton.style.border = 'none';
    reserveButton.style.opacity = '0.5';
    reserveButton.disabled = true;

    // Update button styles when seats are selected
    seatSelectionDiv.addEventListener("change", () => {
        const selectedSeats = document.querySelectorAll('input[name="seats"]:checked');
        const hasSelectedSeats = selectedSeats.length > 0;

        confirmSeatsButton.disabled = !hasSelectedSeats;
        confirmSeatsButton.style.opacity = hasSelectedSeats ? '1' : '0.5';

        if (hasSelectedSeats) {
            confirmSeatsButton.style.backgroundColor = '#880D1E';
            confirmSeatsButton.style.cursor = 'pointer';
        } else {
            confirmSeatsButton.style.backgroundColor = '#880D1E';
            confirmSeatsButton.style.cursor = 'not-allowed';
        }
    });

    // Update reserve button style when all required fields are filled
    function updateReserveButton() {
        const isSelected = areRequiredFieldsSelected();
        reserveButton.disabled = !isSelected;
        reserveButton.style.opacity = isSelected ? '1' : '0.5';

        if (isSelected) {
            reserveButton.style.backgroundColor = '#880D1E';
            reserveButton.style.cursor = 'pointer';
        } else {
            reserveButton.style.backgroundColor = '#880D1E';
            reserveButton.style.cursor = 'not-allowed';
        }
    }

    // Add event listeners to update reserve button
    [buildingSelect, roomSelect, dateInput, startTimeSelect, endTimeSelect].forEach(select => {
        select.addEventListener("change", updateReserveButton);
    });

    confirmSeatsButton.addEventListener("click", function () {
        const selectedSeats = Array.from(seatSelectionDiv.querySelectorAll("input[type='checkbox']:checked"))
            .map(checkbox => checkbox.value);

        console.log("Selected seats:", selectedSeats);

        if (selectedSeats.length === 0) {
            alert("Please select at least one seat.");
            return;
        }

        studentsSection.style.display = 'block';
        generateStudentFields(selectedSeats.length);

        document.getElementById("purpose-section").style.display = 'block';
        document.getElementById("anonymous-section").style.display = 'block';
        document.getElementById("reserveButton").style.display = 'block';
    });

    function generateStudentFields(numberOfSeats) {
        console.log("Generating student input fields for:", numberOfSeats, "seats");

        creditedStudentFields.innerHTML = '';

        const studentInputs = [];

        for (let i = 0; i < numberOfSeats; i++) {
            const input = document.createElement("input");
            input.type = "text";
            input.classList.add("form-control", "mb-2");
            input.placeholder = `Enter university ID of student #${i + 1}`;

            // Store reference for validation
            studentInputs.push(input);
            creditedStudentFields.appendChild(input);
        }

        function validateInputs() {
            const ids = studentInputs.map(input => input.value.trim());
            const allValid = ids.every(id => id.length === 8 && /^\d+$/.test(id));
            const unique = new Set(ids).size === ids.length;

            reserveButton.disabled = !(allValid && unique);
        }

        studentInputs.forEach(input => input.addEventListener("input", validateInputs));

        console.log("Student input fields generated.");
    }

    purposeInput.addEventListener("input", function () {
        const maxLength = 200;
        const currentLength = this.value.length;
        const remaining = maxLength - currentLength;

        remainingCharacters.textContent = `${remaining} characters remaining`;

        if (currentLength >= maxLength) {
            this.value = this.value.slice(0, maxLength);
        }
    });

    reserveButton.addEventListener("click", async function () {
        const selectedBuilding = buildingSelect.value;
        const selectedRoom = roomSelect.value;
        const selectedLab = labs.find(lab => lab.building === selectedBuilding && lab.room === selectedRoom);
        const selectedSeats = Array.from(seatSelectionDiv.querySelectorAll("input[type='checkbox']:checked"))
            .map(checkbox => checkbox.value);
        const selectedStudents = Array.from(creditedStudentFields.querySelectorAll("input"))
            .map(input => input.value.trim())
            .filter(value => value);
        const purpose = purposeInput.value.trim();

        // Validation check for required fields
        if (!selectedLab || selectedSeats.length === 0 || selectedStudents.length === 0) {
            alert("Please ensure all required fields are filled out.");
            return;
        }

        if (!purpose) {
            alert("Please enter a purpose for the reservation.");
            return;
        }

        try {
            console.log("Starting reservation process...");
            console.log("Selected lab:", selectedLab);
            console.log("Selected seats:", selectedSeats);
            console.log("Selected students:", selectedStudents);
            console.log("Purpose:", purpose);

            // Step 1: Validate university IDs
            console.log("Validating university IDs...");
            const validationResponse = await fetch(`/api/students/validate-university-ids`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ universityIDs: selectedStudents }),
            });

            const validationData = await validationResponse.json();
            console.log("Validation response:", validationData);

            if (!validationResponse.ok) {
                console.error("Validation failed:", validationData);
                alert(`Invalid university IDs: ${validationData.missingIDs.join(", ")}`);
                return;
            }

            console.log("All university IDs validated successfully.");

            // Step 2: Extract student ObjectIDs for the valid students
            const foundStudentsData = validationData.foundStudentsData;
            const creditedStudentIDs = foundStudentsData.map(student => student.objectID);
            console.log("Credited student IDs:", creditedStudentIDs);

            // Step 3: Create the reservation data
            const selectedDate = dateInput.value;
            console.log("Selected date:", selectedDate);

            // Get the start and end times from the dropdowns (these are in 24-hour format)
            const startTime = startTimeSelect.value; // e.g., "08:00"
            const endTime = endTimeSelect.value;   // e.g., "08:30"
            console.log("Start time (24h):", startTime);
            console.log("End time (24h):", endTime);

            // Parse the date string to create a base date
            const [month, day, year] = selectedDate.split('/');

            // Function to create a date string in UTC that represents the desired local time
            function createUTCDateString(year, month, day, timeStr) {
                const [hours, minutes] = timeStr.split(':').map(Number);

                // Create a date object in local time
                const localDate = new Date(year, parseInt(month) - 1, parseInt(day), hours, minutes, 0, 0);

                // Convert the local time to UTC time that will represent the same wall clock time
                const utcYear = localDate.getUTCFullYear();
                const utcMonth = String(localDate.getUTCMonth() + 1).padStart(2, '0');
                const utcDay = String(localDate.getUTCDate()).padStart(2, '0');
                const utcHours = String(localDate.getUTCHours()).padStart(2, '0');
                const utcMinutes = String(localDate.getUTCMinutes()).padStart(2, '0');

                // Return the UTC date string
                return `${utcYear}-${utcMonth}-${utcDay}T${utcHours}:${utcMinutes}:00.000Z`;
            }

            // Create the UTC date strings that will represent our local times
            const startDateTimeStr = createUTCDateString(year, month, day, startTime);
            const endDateTimeStr = createUTCDateString(year, month, day, endTime);

            // Create Date objects for validation
            const startDateTime = new Date(startDateTimeStr);
            const endDateTime = new Date(endDateTimeStr);

            console.log("Local timezone:", Intl.DateTimeFormat().resolvedOptions().timeZone);
            console.log("Selected local start time:", `${year}-${month}-${day} ${startTime}`);
            console.log("Selected local end time:", `${year}-${month}-${day} ${endTime}`);
            console.log("UTC start time to be sent:", startDateTimeStr);
            console.log("UTC end time to be sent:", endDateTimeStr);

            // Verify that end time is after start time
            if (endDateTime <= startDateTime) {
                alert("End time must be later than start time.");
                return;
            }

            const reservationData = {
                seatIDs: selectedSeats,
                startDateTime: startDateTimeStr,
                endDateTime: endDateTimeStr,
                creditedStudentIDs: creditedStudentIDs,
                purpose: purpose,
                status: "Reserved",
                isAnonymous: anonymousCheck.checked,
            };

            console.log("Reservation data to be sent:", reservationData);

            // Step 4: API call
            console.log("Sending reservation request...");
            const reservationResponse = await fetch(`/api/reservations`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reservationData),
            });

            console.log("Raw reservation response:", reservationResponse);
            const reservationResult = await reservationResponse.json();
            console.log("Parsed reservation response:", reservationResult);

            if (!reservationResponse.ok) {
                console.error("Reservation failed:", reservationResult);
                alert("Reservation failed! " + (reservationResult.details || reservationResult.error || "Please try again."));
                return;
            }

            console.log("Reservation successful. Server response:", reservationResult);
            resetForm();
            alert("Reservation successful!");
        } catch (error) {
            console.error("Error making reservation:", error);
            alert("An error occurred. Please try again. Error: " + error.message);
        }
    });

    function resetForm() {
        buildingSelect.value = "";
        roomSelect.innerHTML = '<option value="" disabled selected>Select a building first</option>';
        roomSelect.disabled = true;
        dateInput.value = "";
        dateInput.disabled = true;
        startTimeSelect.innerHTML = '<option value="" disabled selected>Select start time</option>';
        startTimeSelect.disabled = true;
        endTimeSelect.innerHTML = '<option value="" disabled selected>Select end time</option>';
        endTimeSelect.disabled = true;
        confirmSeatsButton.disabled = true;

        // Hide seat selection, students section, purpose, and reserve anonymously checkbox
        seatSelectionDiv.style.display = 'none';
        studentsSection.style.display = 'none';
        document.getElementById("purpose-section").style.display = 'none';
        document.getElementById("anonymous-section").style.display = 'none';
        document.getElementById("reserveButton").style.display = 'none';

        // Clear students section and input fields
        creditedStudentFields.innerHTML = '';

        // Reset purpose input field
        purposeInput.value = '';

        // Reset reserve button
        reserveButton.disabled = true;
        anonymousCheck.checked = false;

        console.log("Form reset.");
    }
});
