document.addEventListener("DOMContentLoaded", function () {
    const buildingSelect = document.getElementById("buildingSelect");
    const roomSelect = document.getElementById("roomSelect");
    const viewReservationsBtn = document.getElementById("viewReservationsBtn");
    const reservationsContainer = document.getElementById("reservationsContainer");

    // Fetch labs from a global variable injected by the backend
    const labs = window.labsData || [];
    console.log("Labs data:", labs);

    buildingSelect.addEventListener("change", function () {
        const selectedBuilding = this.value;
        console.log("Selected building:", selectedBuilding);
        roomSelect.innerHTML = `<option value="" selected disabled>Choose a room</option>`;

        if (selectedBuilding) {
            const rooms = labs
                .filter(lab => lab.building === selectedBuilding)
                .map(lab => lab.room);
            console.log("Filtered rooms:", rooms);

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
        console.log("Selected room:", this.value);
    });

    viewReservationsBtn.addEventListener("click", async function () {
        const selectedBuilding = buildingSelect.value;
        const selectedRoom = roomSelect.value;
        console.log("Fetching reservations for:", selectedBuilding, selectedRoom);

        if (selectedBuilding && selectedRoom) {
            try {
                // Fetch the Lab based on building and room
                const labResponse = await fetch(`/api/labs?building=${selectedBuilding}&room=${selectedRoom}`);
                const labs = await labResponse.json();
                console.log("Lab response:", labs);

                if (!labs.length) {
                    reservationsContainer.innerHTML = `<p class="text-center text-danger">No lab found for the selected building and room.</p>`;
                    return;
                }

                const labID = labs[0]._id;
                console.log("Lab ID:", labID);

                // Fetch seats for the lab
                const seatsResponse = await fetch(`/api/seats?labID=${labID}`);
                const seats = await seatsResponse.json();
                console.log("Seats response:", seats);
                const seatIDs = seats.map(seat => seat._id);

                if (!seatIDs.length) {
                    reservationsContainer.innerHTML = `<p class="text-center text-warning">No seats found for this lab.</p>`;
                    return;
                }

                console.log("Seat IDs:", seatIDs);
                
                // Fetch reservations for these seat IDs
                const reservationsResponse = await fetch(`/api/reservations?seatIDs=${seatIDs.join(",")}`);
                const reservations = await reservationsResponse.json();
                console.log("Reservations response:", reservations);

                // Construct Table
                let tableHtml = `
                    <h3>Reservations for ${selectedBuilding} - ${selectedRoom}</h3>
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Seats</th>
                                <th>Start Date & Time</th>
                                <th>End Date & Time</th>
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
                        
                        const creditedStudents = reservation.isAnonymous
                            ? "Anonymous"
                            : reservation.creditedStudentIDs.length
                                ? reservation.creditedStudentIDs
                                    .map(student => `${student.firstName} ${student.lastName}`)
                                    .join(", ")
                                : "None";

                        console.log("Processed reservation:", {
                            seatNumbers,
                            creditedStudents,
                            startDateTime: reservation.startDateTime,
                            endDateTime: reservation.endDateTime,
                            purpose: reservation.purpose,
                            status: reservation.status
                        });

                        tableHtml += `
                            <tr>
                                <td>${seatNumbers}</td>
                                <td>${reservation.startDateTime}</td>
                                <td>${reservation.endDateTime}</td>
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
