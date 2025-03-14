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

                row.find("td:nth-child(9)").html(`<span class="badge bg-danger">Cancelled</span>`);
                row.find(".cancel-btn").remove(); // Remove cancel button

                // Append to past reservations
                $("#pastReservationsBody").append(row);
                console.log("Row moved successfully");

                // Remove from upcoming reservations
                row.remove(); // Ensure row is removed from upcomingReservationsBody
                if ($("#upcomingReservationsBody tr").length === 0) {
                    $("#upcomingReservationsBody").html('<tr><td colspan="10" class="text-center">No upcoming reservations found.</td></tr>');
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
