// TODO: Finalize.

document.addEventListener("DOMContentLoaded", function () {
    const buildingSelect = document.getElementById("building");
    const roomSelect = document.getElementById("room");
    const dateInput = document.getElementById("date");
    const startTimeSelect = document.getElementById("start-time");
    const endTimeSelect = document.getElementById("end-time");
    const seatSelect = document.getElementById("seat");
    
    // Fetch and populate buildings
    fetch("/api/buildings")
        .then(response => response.json())
        .then(buildings => {
            buildingSelect.innerHTML = '<option value="" disabled selected>Select a building</option>';
            buildings.forEach(building => {
                const option = new Option(building.name, building._id);
                buildingSelect.appendChild(option);
            });
        });
    
    // Fetch and populate rooms based on selected building
    buildingSelect.addEventListener("change", function () {
        const buildingId = this.value;
        roomSelect.innerHTML = '<option value="" disabled selected>Loading rooms...</option>';
        
        fetch(`/api/rooms?buildingId=${buildingId}`)
            .then(response => response.json())
            .then(rooms => {
                roomSelect.innerHTML = '<option value="" disabled selected>Select a room</option>';
                rooms.forEach(room => {
                    const option = new Option(room.name, room._id);
                    roomSelect.appendChild(option);
                });
            });
    });

    // Generate 30-minute interval time slots from start to end time
    function generateTimeSlots(startHour, endHour) {
        const timeSlots = [];
        for (let hour = startHour; hour < endHour; hour++) {
            for (let min of [0, 30]) {
                const formattedHour = hour > 12 ? hour - 12 : hour;
                const amPm = hour >= 12 ? "PM" : "AM";
                const formattedTime = `${formattedHour}:${min === 0 ? "00" : "30"} ${amPm}`;
                const value = `${hour}:${min}`;
                timeSlots.push({ value, formattedTime });
            }
        }
        return timeSlots;
    }
    
    // Fetch available time slots based on building, room, and date
    function fetchTimeSlots() {
        const buildingId = buildingSelect.value;
        const roomId = roomSelect.value;
        const date = dateInput.value;
        
        if (buildingId && roomId && date) {
            fetch(`/api/time-slots?buildingId=${buildingId}&roomId=${roomId}&date=${date}`)
                .then(response => response.json())
                .then(timeSlots => {
                    startTimeSelect.innerHTML = '<option value="" disabled selected>Select start time</option>';
                    timeSlots.forEach(slot => {
                        const option = new Option(slot.formattedTime, slot.value);
                        startTimeSelect.appendChild(option);
                    });
                });
        }
    }
    
    roomSelect.addEventListener("change", fetchTimeSlots);
    dateInput.addEventListener("change", fetchTimeSlots);
    
    // Update end time options based on selected start time
    startTimeSelect.addEventListener("change", function () {
        endTimeSelect.innerHTML = '<option value="" disabled selected>Select end time</option>';
        const selectedTime = startTimeSelect.value;
        const slots = generateTimeSlots(parseInt(selectedTime.split(":")[0]), 18);

        slots.forEach(slot => {
            if (slot.value > selectedTime) {
                const option = new Option(slot.formattedTime, slot.value);
                endTimeSelect.appendChild(option);
            }
        });
    });
    
    // Fetch and populate available seats
    function fetchSeats() {
        const buildingId = buildingSelect.value;
        const roomId = roomSelect.value;
        const date = dateInput.value;
        const startTime = startTimeSelect.value;
        const endTime = endTimeSelect.value;
        
        if (buildingId && roomId && date && startTime && endTime) {
            fetch(`/api/seats?buildingId=${buildingId}&roomId=${roomId}&date=${date}&startTime=${startTime}&endTime=${endTime}`)
                .then(response => response.json())
                .then(seats => {
                    seatSelect.innerHTML = '<option value="" disabled selected>Select an available seat</option>';
                    seats.forEach(seat => {
                        const option = new Option(`Seat ${seat.number}`, seat._id);
                        seatSelect.appendChild(option);
                    });
                });
        }
    }
    
    endTimeSelect.addEventListener("change", fetchSeats);
    
    // Placeholder reservation logic
    document.getElementById("reserveButton").addEventListener("click", function () {
        alert("Reservation logic will be implemented here.");
    });
});
