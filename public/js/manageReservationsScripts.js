function cancelReservation(reservationId) {
    console.log(`Attempting to cancel reservation with ID: ${reservationId}`);

    if (confirm("Are you sure you want to cancel this reservation?")) {
        console.log("User confirmed cancellation");

        fetch(`/api/reservations/${reservationId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: "Cancelled" })
        })
            .then(response => {
                console.log("Received response from server:", response);
                return response.json();
            })
            .then(data => {
                console.log("Parsed response JSON:", data);

                if (data.success) {
                    alert("Reservation canceled successfully!");

                    // Move the row to past reservations
                    let row = $(`tr[data-id="${reservationId}"]`);
                    console.log("Moving row to past reservations:", row);

                    // Update the status badge
                    row.find("td:nth-child(8)").html(`<span class="badge bg-danger">Cancelled</span>`);

                    // Remove the actions column
                    row.find("td:nth-child(9)").remove();

                    // Append to past reservations
                    $("#pastReservationsBody").append(row);
                    console.log("Row moved successfully");

                    // Remove from upcoming reservations
                    row.remove(); // Ensure row is removed from upcomingReservationsBody
                    if ($("#upcomingReservationsBody tr").length === 0) {
                        $("#upcomingReservationsBody").html('<tr><td colspan="9" class="text-center">No upcoming reservations found.</td></tr>');
                    }
                } else {
                    console.error("Server returned an error:", data);
                    alert("Error canceling reservation: " + (data.message || "Unknown error"));
                }
            })
            .catch(error => {
                console.error("Fetch Error:", error);
                alert("Failed to cancel reservation.");
            });
    } else {
        console.log("User canceled the operation");
    }
}

function updateReservations() {
    console.log("Fetching latest reservation data...");

    fetch("/api/manage-reservations/live-update")
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log("Successfully fetched updated reservations:", data);

                // Clear existing reservation tables
                $("#upcomingReservationsBody").empty();
                $("#pastReservationsBody").empty();

                const isAdmin = data.isAdmin;

                // Update upcoming reservations
                if (data.upcomingReservations.length > 0) {
                    data.upcomingReservations.forEach(reservation => {
                        const creditedStudentLinks = reservation.isAnonymous ?
                            "Anonymous" :
                            reservation.creditedStudents.map(student =>
                                `<a href="/api/profile/${student.universityID}">${student.fullName}</a>`
                            ).join(", ");

                        // Shift start and end datetime by -8 hours
                        const startTime = new Date(reservation.start_datetime);
                        const endTime = new Date(reservation.end_datetime);
                        startTime.setHours(startTime.getHours() + 8);
                        endTime.setHours(endTime.getHours() + 8);

                        const formattedStart = startTime.toISOString().slice(0, 16).replace("T", " ");
                        const formattedEnd = endTime.toISOString().slice(0, 16).replace("T", " ");

                        const now = new Date();
                        const diffMinutes = (now - startTime) / (1000 * 60); // Convert to minutes

                        const showCancel = isAdmin ? (diffMinutes >= 0 && diffMinutes <= 10) : true;
                        const cancelButton = showCancel ?
                            `<button class="btn btn-danger btn-sm cancel-btn" onclick="cancelReservation('${reservation.id}')">
                                <i class="fas fa-times"></i>
                            </button>`
                            : '';

                        $("#upcomingReservationsBody").append(`
                            <tr data-id="${reservation.id}">
                                <td>${reservation.building}</td>
                                <td>${reservation.room}</td>
                                <td>${reservation.seats}</td>
                                <td>${formattedStart}</td>
                                <td>${formattedEnd}</td>
                                <td>${creditedStudentLinks}</td>
                                <td>${reservation.purpose}</td>
                                <td><span class="badge bg-success">Reserved</span></td>
                                <td class="text-center">
                                    <div class="btn-group" role="group">
                                        <a href="/api/manage-reservations/edit/${reservation.id}" class="btn btn-warning btn-sm me-1">
                                            <i class="fas fa-edit"></i>
                                        </a>
                                        ${cancelButton}
                                    </div>
                                </td>
                            </tr>
                        `);
                    });
                } else {
                    $("#upcomingReservationsBody").html('<tr><td colspan="9" class="text-center">No upcoming reservations found.</td></tr>');
                }

                // Update past reservations
                if (data.pastReservations.length > 0) {
                    data.pastReservations.forEach(reservation => {
                        const creditedStudentLinks = reservation.isAnonymous ?
                            "Anonymous" :
                            reservation.creditedStudents.map(student =>
                                `<a href="/api/profile/${student.universityID}">${student.fullName}</a>`
                            ).join(", ");

                        // Shift past reservation datetime too
                        const startTime = new Date(reservation.start_datetime);
                        const endTime = new Date(reservation.end_datetime);
                        startTime.setHours(startTime.getHours() + 8);
                        endTime.setHours(endTime.getHours() + 8);

                        const formattedStart = startTime.toISOString().slice(0, 16).replace("T", " ");
                        const formattedEnd = endTime.toISOString().slice(0, 16).replace("T", " ");

                        $("#pastReservationsBody").append(`
                            <tr data-id="${reservation.id}">
                                <td>${reservation.building}</td>
                                <td>${reservation.room}</td>
                                <td>${reservation.seats}</td>
                                <td>${formattedStart}</td>
                                <td>${formattedEnd}</td>
                                <td>${creditedStudentLinks}</td>
                                <td>${reservation.purpose}</td>
                                <td>
                                    <span class="badge ${reservation.status === 'Cancelled' ? 'bg-danger' : 'bg-secondary'}">
                                        ${reservation.status}
                                    </span>
                                </td>
                            </tr>
                        `);
                    });
                } else {
                    $("#pastReservationsBody").html('<tr><td colspan="8" class="text-center">No past reservations found.</td></tr>');
                }
            } else {
                console.error("Failed to update reservations:", data.error);
            }
        })
        .catch(error => {
            console.error("Error fetching reservation updates:", error);
        });
}

// Initialize tooltips for better button interaction
$(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip();
});

setInterval(updateReservations, 60000);

// Fetch immediately on page load
updateReservations();
