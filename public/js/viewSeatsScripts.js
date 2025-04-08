document.addEventListener("DOMContentLoaded", function () {
    const buildingSelect = document.getElementById("building-select");
    const roomSelect = document.getElementById("room-select");
    const dateSelect = document.getElementById("date-select");
    const startTimeSelect = document.getElementById("start-time-select");
    const endTimeSelect = document.getElementById("end-time-select");
    const viewSeatsBtn = document.getElementById("view-seats-btn");

    const seatAvailabilityDiv = document.getElementById("seat-availability");
    const seatCountBadge = document.getElementById("seat-count");
    const availableSeatList = document.getElementById("available-seat-list");

    let labs = window.labsData || [];
    const buildings = [...new Set(labs.map(lab => lab.building))];

    resetPage();

    buildings.forEach(building => {
        const option = document.createElement("option");
        option.value = building;
        option.textContent = building;
        buildingSelect.appendChild(option);
    });

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
        const selectedRoom = roomSelect.value;
        const selectedLab = labs.find(lab => lab.room === selectedRoom);

        if (selectedLab && buildingSelect.value && this.value) {
            populateTimeSlots(selectedLab.openingTime, selectedLab.closingTime);
        }
    });

    function convertTo24HourFormat(timeString) {
        let [hours, minutesPeriod] = timeString.split(":");
        let [minutes, period] = minutesPeriod.split(" ");
        hours = parseInt(hours, 10);
        minutes = parseInt(minutes, 10);

        if (period === "PM" && hours !== 12) hours += 12;
        else if (period === "AM" && hours === 12) hours = 0;

        return { hours, minutes };
    }

    function populateTimeSlots(startTime, endTime) {
        startTimeSelect.innerHTML = '<option value="" selected disabled>Select a start time</option>';
        endTimeSelect.innerHTML = '<option value="" selected disabled>Select an end time</option>';
        endTimeSelect.disabled = true;

        let startParts = convertTo24HourFormat(startTime);
        let endParts = convertTo24HourFormat(endTime);

        let startDate = new Date();
        startDate.setHours(startParts.hours);
        startDate.setMinutes(startParts.minutes);

        let endDate = new Date();
        endDate.setHours(endParts.hours);
        endDate.setMinutes(endParts.minutes);

        if (endDate <= startDate) endDate.setDate(endDate.getDate() + 1);

        let currentTime = new Date(startDate);
        let hasOptions = false;

        while (currentTime < endDate) {
            let timeStr = `${String(currentTime.getHours()).padStart(2, "0")}:${String(currentTime.getMinutes()).padStart(2, "0")}`;
            startTimeSelect.appendChild(new Option(timeStr, timeStr));
            currentTime.setMinutes(currentTime.getMinutes() + 30);
            hasOptions = true;
        }

        startTimeSelect.disabled = !hasOptions;
    }

    startTimeSelect.addEventListener("change", function () {
        endTimeSelect.innerHTML = '<option value="" selected disabled>Select an end time</option>';
        endTimeSelect.disabled = false;

        let [startHour, startMinutes] = this.value.split(":").map(Number);
        let selectedLab = labs.find(lab => lab.room === roomSelect.value);
        if (!selectedLab) return;

        let { hours: endHour, minutes: endMinutes } = convertTo24HourFormat(selectedLab.closingTime);

        let currHour = startHour;
        let currMin = startMinutes + 30;

        while (currHour < endHour || (currHour === endHour && currMin <= endMinutes)) {
            if (currMin >= 60) {
                currMin = 0;
                currHour++;
            }

            if (currHour > endHour || (currHour === endHour && currMin > endMinutes)) break;

            let timeStr = `${String(currHour).padStart(2, "0")}:${String(currMin).padStart(2, "0")}`;
            endTimeSelect.appendChild(new Option(timeStr, timeStr));

            currMin += 30;
        }

        if (endTimeSelect.options.length <= 1) endTimeSelect.disabled = true;
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
        const selectedLab = labs.find(lab =>
            lab.building.trim().toLowerCase() === buildingSelect.value.trim().toLowerCase() &&
            lab.room.trim().toLowerCase() === roomSelect.value.trim().toLowerCase()
        );

        if (!selectedLab) return;

        fetch(`/api/seats?labID=${selectedLab._id}`)
            .then(res => res.json())
            .then(data => {
                const seats = Array.isArray(data) ? data : data.seats;

                const availableSeats = seats.filter(seat => seat.status === 'Available');

                availableSeatList.innerHTML = "";
                seatCountBadge.textContent = availableSeats.length;

                if (availableSeats.length === 0) {
                    availableSeatList.innerHTML = '<li class="list-group-item text-danger">No available seats</li>';
                } else {
                    availableSeats.forEach(seat => {
                        let li = document.createElement("li");
                        li.className = "list-group-item";
                        li.textContent = `Seat ${seat.seatNumber}`;
                        availableSeatList.appendChild(li);
                    });
                }

                seatAvailabilityDiv.style.display = "block";
            })
            .catch(err => console.error("Error fetching seats:", err));
    });

    function resetPage() {
        buildingSelect.value = "";
        roomSelect.value = "";
        roomSelect.disabled = true;
        dateSelect.value = "";
        startTimeSelect.innerHTML = '<option value="" selected disabled>Select a start time</option>';
        startTimeSelect.disabled = true;
        endTimeSelect.innerHTML = '<option value="" selected disabled>Select an end time</option>';
        endTimeSelect.disabled = true;
        viewSeatsBtn.disabled = true;
        seatAvailabilityDiv.style.display = "none";
    }

    resetPage();
});
