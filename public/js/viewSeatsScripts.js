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

        if (selectedLab && dateSelect.value) {
            populateTimeSlots(selectedLab.openingTime, selectedLab.closingTime);
        }
    });

    dateSelect.addEventListener("change", function () {
        const selectedDate = this.value;
        const selectedRoom = roomSelect.value;
        const selectedLab = labs.find(lab => lab.room === selectedRoom);
    
        // Check if building, room, and date are selected
        if (selectedLab && buildingSelect.value && selectedDate) {
            populateTimeSlots(selectedLab.openingTime, selectedLab.closingTime);
        }
    });

    function convertTo24HourFormat(timeString) {
        let [hours, minutesPeriod] = timeString.split(":");
        let [minutes, period] = minutesPeriod.split(" ");
        hours = parseInt(hours, 10);
        minutes = parseInt(minutes, 10);
    
        if (period === "PM" && hours !== 12) {
            hours += 12;
        } else if (period === "AM" && hours === 12) {
            hours = 0;
        }
    
        return { hours, minutes };
    }
    
    function populateTimeSlots(startTime, endTime) {
        console.log("Populating time slots with:", startTime, "-", endTime); 
        
        startTimeSelect.innerHTML = '<option value="" selected disabled>Select a start time</option>';
        endTimeSelect.innerHTML = '<option value="" selected disabled>Select an end time</option>';
        endTimeSelect.disabled = true;
    
        // Convert start and end time to 24-hour format
        let startTimeParts = convertTo24HourFormat(startTime);
        let endTimeParts = convertTo24HourFormat(endTime);
    
        console.log("Start Time Parts (24-hour format):", startTimeParts);
        console.log("End Time Parts (24-hour format):", endTimeParts);
        
        let startDate = new Date();
        startDate.setHours(startTimeParts.hours);
        startDate.setMinutes(startTimeParts.minutes);
        
        let endDate = new Date();
        endDate.setHours(endTimeParts.hours);
        endDate.setMinutes(endTimeParts.minutes);
    
        console.log("Start Date:", startDate);
        console.log("End Date:", endDate);
        
        // If start time > end time, make sure to move end time to the next day
        if (endDate <= startDate) {
            console.log("End time is before start time, adjusting end time to next day.");
            endDate.setDate(endDate.getDate() + 1);
            console.log("Adjusted End Date:", endDate);
        }
        
        let currentTime = startDate;
        let hasOptions = false;
        
        console.log("Creating time slots...");
        // Create time slots in 30-minute intervals between startTime and endTime
        while (currentTime < endDate) {
            let timeString = `${String(currentTime.getHours()).padStart(2, "0")}:${String(currentTime.getMinutes()).padStart(2, "0")}`;
            console.log("Current Time:", timeString);
            let option = new Option(timeString, timeString);
            startTimeSelect.appendChild(option);
            hasOptions = true;
            
            currentTime.setMinutes(currentTime.getMinutes() + 30);
        }
        
        if (hasOptions) {
            startTimeSelect.disabled = false; 
            console.log("Time slots successfully populated.");
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
        console.log("Start time selected:", this.value);  // Log the selected start time
    
        endTimeSelect.innerHTML = '<option value="" selected disabled>Select an end time</option>';
        endTimeSelect.disabled = false;
        
        let startTime = this.value;
        let [startHour, startMinutes] = startTime.split(":").map(Number);
        
        console.log("Start time parts:", startHour, startMinutes); // Log parsed start time
        
        const selectedLab = labs.find(lab => lab.room === roomSelect.value);
        if (!selectedLab) {
            console.error("Selected lab not found for the room:", roomSelect.value);
            return;
        }
        
        let closingTime = selectedLab.closingTime;
        
        console.log("Closing time for lab:", closingTime);  // Log the closing time
        const { hours: endHour, minutes: endMinutes } = convertTo24HourFormat(closingTime);
        
        console.log("Converted end time parts:", endHour, endMinutes); // Log converted end time
    
        let currentHour = startHour;
        let currentMinutes = startMinutes + 30; // Adding 30 minutes to start time
        
        console.log("Starting to create time slots...");
    
        while (
            currentHour < endHour || 
            (currentHour === endHour && currentMinutes <= endMinutes)
        ) {
            if (currentMinutes >= 60) {
                currentMinutes = 0;
                currentHour++;
            }
            
            // Ensure that the end time doesn't exceed the selected closing time
            if (currentHour > endHour || (currentHour === endHour && currentMinutes > endMinutes)) {
                break;
            }
    
            let timeString = `${String(currentHour).padStart(2, "0")}:${String(currentMinutes).padStart(2, "0")}`;
            console.log("Generated end time option:", timeString);  // Log the generated time string
    
            let option = new Option(timeString, timeString);
            endTimeSelect.appendChild(option);
        
            // Increase the minutes by 30 for the next end time option
            currentMinutes += 30;
        }
        
        console.log("End time options added, checking if any options are available...");
    
        // Disable the end time select if no valid options are available
        if (endTimeSelect.options.length <= 1) {
            console.warn("No valid end times available!");
            endTimeSelect.disabled = true;
        } else {
            console.log("Valid end time options available.");
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

    function formatDateTimeForParsing(date, time) {
        // Convert to 24-hour time if necessary (you can reuse your existing helper or handle it here)
        let [hours, minutes, period] = time.split(/[: ]/);
        hours = parseInt(hours);
        minutes = parseInt(minutes);
    
        if (period === 'PM' && hours !== 12) {
            hours += 12;
        }
        if (period === 'AM' && hours === 12) {
            hours = 0;
        }
    
        // Format the time as HH:mm
        let formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    
        // Format and return the datetime string as YYYY-MM-DDTHH:mm
        return `${date}T${formattedTime}`;
    }    

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
                let currentTimeString = formatDateTimeForParsing(selectedDate, openingTime);
                let endTimeString = formatDateTimeForParsing(selectedDate, closingTime);

                let currentTime = new Date(currentTimeString);
                let endTime = new Date(endTimeString);

                console.log(`Current time: ${currentTime} | End time: ${endTime}`); // DEBUGGING
                
                while (currentTime < endTime) {
                    let nextTime = new Date(currentTime);
                    nextTime.setMinutes(nextTime.getMinutes() + 30);

                    // Filter reservations that overlap with the current time slot
                    let overlappingReservations = filteredReservations.filter(reservation => {
                        let resStart = new Date(reservation.startDateTime);
                        let resEnd = new Date(reservation.endDateTime);

                        console.log(`Checking time slot: ${currentTime.toTimeString().slice(0, 5)} - ${nextTime.toTimeString().slice(0, 5)}`);
                        console.log(`Reservation start: ${resStart.toTimeString().slice(0, 5)}, end: ${resEnd.toTimeString().slice(0, 5)}`);

                        // Ensure the time slot is fully inside the reservation period
                        return currentTime >= resStart && nextTime <= resEnd;
                    });

                    // If there are no overlapping reservations, the slot is available
                    let isAvailable = overlappingReservations.length === 0;

                    timeSlots.push({
                        timeRange: `${currentTime.toTimeString().slice(0, 5)} - ${nextTime.toTimeString().slice(0, 5)}`,
                        available: isAvailable
                    });

                    currentTime = nextTime; // Move to the next time slot
                }

                seatTimeList.innerHTML = "";

                if (timeSlots.length > 0) {
                    timeSlots.forEach(slot => {
                        let li = document.createElement("li");
                        li.className = "list-group-item";
                        li.textContent = slot.timeRange;
                        if (!slot.available) {
                            li.style.backgroundColor = "red"; 
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
