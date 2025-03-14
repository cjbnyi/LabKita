document.addEventListener("DOMContentLoaded", function () {
    const buildingSelect = document.getElementById("buildingSelect");
    const roomSelect = document.getElementById("roomSelect");
    const viewReservationsBtn = document.getElementById("viewReservationsBtn");
    const reservationsContainer = document.getElementById("reservationsContainer");

    // Fetch labs from a global variable injected by the backend
    const labs = window.labsData || [];

    buildingSelect.addEventListener("change", function () {
        const selectedBuilding = this.value;
        roomSelect.innerHTML = `<option value="" selected disabled>Choose a room</option>`;

        if (selectedBuilding) {
            const rooms = labs
                .filter(lab => lab.building === selectedBuilding)
                .map(lab => lab.room);

            rooms.forEach(room => {
                const option = document.createElement("option");
                option.value = room;
                option.textContent = room;
                roomSelect.appendChild(option);
            });

            roomSelect.disabled = false;
        } else {
            roomSelect.disabled = true;
        }
    });

    roomSelect.addEventListener("change", function () {
        viewReservationsBtn.disabled = !this.value;
    });

    viewReservationsBtn.addEventListener("click", async function () {
        const selectedBuilding = buildingSelect.value;
        const selectedRoom = roomSelect.value;

        if (selectedBuilding && selectedRoom) {
            try {
                // Fetch the Lab based on building and room
                const labResponse = await fetch(`/api/labs?building=${selectedBuilding}&room=${selectedRoom}`);
                const labs = await labResponse.json();

                if (!labs.length) {
                    reservationsContainer.innerHTML = `<p class="text-center text-danger">No lab found for the selected building and room.</p>`;
                    return;
                }

                const labID = labs[0]._id;

                // Fetch reservations (which now include populated seat and student data)
                const reservationsResponse = await fetch(`/api/reservations?labID=${labID}`);
                const reservations = await reservationsResponse.json();

                // Construct Table
                let tableHtml = `
                    <h3>Reservations for ${selectedBuilding} - ${selectedRoom}</h3>
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Seats</th>
                                <th>Start Date & Time</th>
                                <th>End Date & Time</th>
                                <th>Requesting Student</th>
                                <th>Credited Students</th>
                                <th>Purpose</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>`;

                if (reservations.length > 0) {
                    reservations.forEach(reservation => {
                        const seatNumbers = reservation.seatIDs
                            .map(seat => seat.seatNumber || "Unknown")
                            .join(", ");

                        const requestingStudent = reservation.isAnonymous
                            ? "Anonymous"
                            : reservation.requestingStudentID
                                ? `${reservation.requestingStudentID.firstName} ${reservation.requestingStudentID.lastName}`
                                : "Unknown";

                        const creditedStudents = reservation.isAnonymous
                            ? "Anonymous"
                            : reservation.creditedStudentIDs.length
                                ? reservation.creditedStudentIDs
                                    .map(student => `${student.firstName} ${student.lastName}`)
                                    .join(", ")
                                : "None";

                        tableHtml += `
                            <tr>
                                <td>${seatNumbers}</td>
                                <td>${reservation.startDateTime}</td>
                                <td>${reservation.endDateTime}</td>
                                <td>${requestingStudent}</td>
                                <td>${creditedStudents}</td>
                                <td>${reservation.purpose}</td>
                                <td><span class="badge bg-${reservation.status === 'Reserved' ? 'success' : 'danger'}">${reservation.status}</span></td>
                            </tr>`;
                    });
                } else {
                    tableHtml += `<tr><td colspan="7" class="text-center">No reservations found.</td></tr>`;
                }

                tableHtml += `</tbody></table>`;
                reservationsContainer.innerHTML = tableHtml;

            } catch (error) {
                console.error("Error fetching reservations:", error);
                reservationsContainer.innerHTML = `<p class="text-center text-danger">An error occurred while fetching reservations.</p>`;
            }
        }
    });
});
