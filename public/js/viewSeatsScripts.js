document.addEventListener("DOMContentLoaded", function () {
    const buildingSelect = document.getElementById("building-select");
    const roomSelect = document.getElementById("room-select");
    const dateSelect = document.getElementById("date-select");
    const startTimeSelect = document.getElementById("start-time-select");
    const endTimeSelect = document.getElementById("end-time-select");
    const viewSeatsBtn = document.getElementById("view-seats-btn");

    const seatSelectionDiv = document.getElementById("seat-selection");
    const seatSelect = document.getElementById("seat-select");
    const seatTimesDiv = document.getElementById("seat-times");
    const seatTimeList = document.getElementById("seat-time-list");

    let labs = window.labsData || [];
    const buildings = [...new Set(labs.map(lab => lab.building))];

    buildings.forEach(building => {
        const option = document.createElement("option");
        option.value = building;
        option.textContent = building;
        buildingSelect.appendChild(option);
    });

    // Handle building selection to load rooms
    buildingSelect.addEventListener("change", function () {
        const selectedBuilding = this.value;
        roomSelect.innerHTML = '<option value="" selected disabled>Select a room</option>';
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

    // Populate date selection (Today + Next 7 days)
    let today = new Date();
    for (let i = 0; i <= 7; i++) {
        let futureDate = new Date();
        futureDate.setDate(today.getDate() + i);
        let dateString = futureDate.toISOString().split("T")[0];
        let option = new Option(dateString, dateString);
        dateSelect.appendChild(option);
    }

    roomSelect.addEventListener("change", function () {
        const selectedRoom = this.value;
        const selectedLab = labs.find(lab => lab.room === selectedRoom);

        if (selectedLab) {
            populateTimeSlots(selectedLab.openingTime, selectedLab.closingTime);
        }
    });

    function populateTimeSlots(startTime, endTime) {
        console.log("Populating time slots with:", startTime, "-", endTime); // ✅ Debug log
    
        startTimeSelect.innerHTML = '<option value="" selected disabled>Select a start time</option>';
        endTimeSelect.innerHTML = '<option value="" selected disabled>Select an end time</option>';
        endTimeSelect.disabled = true;
        
        let startHour = parseInt(startTime.split(":")[0]);
        let startMinutes = parseInt(startTime.split(":")[1]);
        let endHour = parseInt(endTime.split(":")[0]);
        let endMinutes = parseInt(endTime.split(":")[1]);
    
        let currentHour = startHour;
        let currentMinutes = startMinutes;
        
        let hasOptions = false; // ✅ Track if we add any valid times
    
        while (currentHour < endHour || (currentHour === endHour && currentMinutes < endMinutes)) {
            let timeString = `${String(currentHour).padStart(2, "0")}:${String(currentMinutes).padStart(2, "0")}`;
            let option = new Option(timeString, timeString);
            startTimeSelect.appendChild(option);
            hasOptions = true; // ✅ At least one option exists
    
            currentMinutes += 30;
            if (currentMinutes >= 60) {
                currentMinutes = 0;
                currentHour++;
            }
        }
    
        if (hasOptions) {
            startTimeSelect.disabled = false; // ✅ Enable start time only if options exist
        } else {
            console.warn("No valid start times available!");
            let noStartOptions = new Option("No valid start times available!", "");
            let noEndOptions = new Option("No valid end times available!", "");
    
            startTimeSelect.innerHTML = '';
            startTimeSelect.appendChild(noStartOptions);
            endTimeSelect.innerHTML = '';
            endTimeSelect.appendChild(noEndOptions);
        }
    }    

    startTimeSelect.addEventListener("change", function () {
        endTimeSelect.innerHTML = '<option value="" selected disabled>Select an end time</option>';
        endTimeSelect.disabled = false;
    
        let startTime = this.value;
        let [startHour, startMinutes] = startTime.split(":").map(Number);
    
        let closingTime = labs.find(lab => lab.room === roomSelect.value)?.closingTime;
        let [endHour, endMinutes] = closingTime.split(":").map(Number);
    
        let currentHour = startHour;
        let currentMinutes = startMinutes + 30;

        while (
            currentHour < endHour || 
            (currentHour === endHour && currentMinutes <= endMinutes)
        ) {
            if (currentMinutes >= 60) {
                currentMinutes = 0;
                currentHour++;
            }
    
            let timeString = `${String(currentHour).padStart(2, "0")}:${String(currentMinutes).padStart(2, "0")}`;
            let option = new Option(timeString, timeString);
            endTimeSelect.appendChild(option);
    
            currentMinutes += 30;
        }

        if (endTimeSelect.options.length <= 1) {
            endTimeSelect.disabled = true;
        }
    });

    function checkFormCompletion() {
        viewSeatsBtn.disabled = !(
            buildingSelect.value &&
            roomSelect.value &&
            dateSelect.value &&
            startTimeSelect.value &&
            endTimeSelect.value
        );
    }

    [buildingSelect, roomSelect, dateSelect, startTimeSelect, endTimeSelect].forEach(select => {
        select.addEventListener("change", checkFormCompletion);
    });
    
    viewSeatsBtn.addEventListener("click", function () {
        const selectedBuilding = String(buildingSelect.value).trim();
        const selectedRoom = String(roomSelect.value).trim();
        const selectedDate = dateSelect.value;
        const selectedStartTime = startTimeSelect.value;
        const selectedEndTime = endTimeSelect.value;
    
        console.log("---- Debug Info ----");
        console.log("Selected Building:", selectedBuilding);
        console.log("Selected Room:", selectedRoom);
        console.log("Selected Date:", selectedDate);
        console.log("Selected Start Time:", selectedStartTime);
        console.log("Selected End Time:", selectedEndTime);
        console.log("Labs array:", labs);
    
        // Find the selected lab
        const selectedLab = labs.find(lab => 
            lab.building.trim().toLowerCase() === selectedBuilding.toLowerCase() &&
            lab.room.trim().toLowerCase() === selectedRoom.toLowerCase()
        );
    
        if (!selectedLab) {
            console.error("Lab not found! Check if the building/room matches exactly.");
            return;
        }
    
        console.log("Found Lab:", selectedLab);
    
        const apiUrl = `/api/seats?labID=${selectedLab._id}`;
        console.log("Fetching seats from API:", apiUrl);
    
        fetch(apiUrl)
            .then(response => {
                console.log("Raw response:", response);
    
                if (!response.ok) {
                    throw new Error(`API error: ${response.status} ${response.statusText}`);
                }
    
                return response.json();
            })
            .then(data => {
                console.log("Fetched data (parsed JSON):", data, "Type:", typeof data);
    
                // Ensure 'seats' is an array
                const seats = Array.isArray(data) ? data : data.seats;
                console.log("Processed seats array:", seats, "Type:", typeof seats);
    
                seatSelect.innerHTML = '<option value="" selected disabled>Select a seat</option>';
    
                if (!Array.isArray(seats)) {
                    console.error("Unexpected API response format. Expected an array but got:", seats);
                    return;
                }
    
                const availableSeats = seats.filter(seat => {
                    console.log(`Checking seat ${seat.seatNumber} (status: ${seat.status})`);
                    return seat.status === 'Available';
                });
    
                console.log("Available seats after filtering:", availableSeats);
    
                if (availableSeats.length === 0) {
                    console.warn("No available seats found!");
                    seatSelect.innerHTML = '<option value="" disabled>No seats available</option>';
                    seatSelectionDiv.style.display = "none"; // Hide if no available seats
                } else {
                    availableSeats.forEach(seat => {
                        let option = document.createElement("option");
                        option.value = seat._id;
                        option.textContent = `Seat ${seat.seatNumber}`;
                        seatSelect.appendChild(option);
                    });
    
                    seatSelectionDiv.style.display = "block"; // Show only if seats are available
                }
            })
            .catch(error => console.error("Error fetching seats:", error));
    });    

    // Handle seat selection to fetch available time slots
    seatSelect.addEventListener("change", function () {
        const selectedSeatId = seatSelect.value;
        const selectedDate = dateSelect.value;
        const selectedLab = labs.find(lab => lab.room === roomSelect.value);

        if (!selectedSeatId || !selectedLab) {
            console.error("Seat or Lab not found.");
            return;
        }

        const openingTime = selectedLab.openingTime;
        const closingTime = selectedLab.closingTime;

        console.log("Opening Time:", openingTime);
        console.log("Closing Time:", closingTime);

        fetch(`/api/reservations?seatIDs=${selectedSeatId}`)
            .then(response => response.json())
            .then(reservations => {
                console.log("All reservations for this seat:", reservations);

                // Filter reservations for the selected date
                const filteredReservations = reservations.filter(reservation => {
                    const resDate = new Date(reservation.startDateTime).toISOString().split("T")[0];
                    return resDate === selectedDate;
                });

                console.log("Reservations for this seat on selected date:", filteredReservations);

                let timeSlots = [];
                let currentTime = new Date(`${selectedDate}T${openingTime}`);
                let endTime = new Date(`${selectedDate}T${closingTime}`);

                while (currentTime < endTime) {
                    let nextTime = new Date(currentTime);
                    nextTime.setMinutes(nextTime.getMinutes() + 30);

                    let overlappingReservations = filteredReservations.filter(reservation => {
                        let resStart = new Date(reservation.startDateTime);
                        let resEnd = new Date(reservation.endDateTime);

                        console.log(`Checking seat: ${currentTime.toTimeString().slice(0, 5)} - ${nextTime.toTimeString().slice(0, 5)}`);
                        console.log(`Reservation start: ${resStart.toTimeString().slice(0, 5)}, end: ${resEnd.toTimeString().slice(0, 5)}`);

                        return currentTime >= resStart && nextTime <= resEnd;
                    });

                    let isAvailable = overlappingReservations.length === 0;

                    timeSlots.push({
                        timeRange: `${currentTime.toTimeString().slice(0, 5)} - ${nextTime.toTimeString().slice(0, 5)}`,
                        available: isAvailable
                    });

                    currentTime = nextTime;
                }

                seatTimeList.innerHTML = "";

                if (timeSlots.length > 0) {
                    timeSlots.forEach(slot => {
                        let li = document.createElement("li");
                        li.className = "list-group-item";
                        li.textContent = slot.timeRange;
                        if (!slot.available) {
                            li.style.backgroundColor = "red"; // Mark unavailable slots
                            li.style.color = "white";
                        }
                        seatTimeList.appendChild(li);
                    });
                } else {
                    seatTimeList.innerHTML = '<li class="list-group-item text-danger">No available times</li>';
                }

                seatTimesDiv.style.display = "block";
            })
            .catch(error => console.error("Error fetching reservations:", error));

    });
});
