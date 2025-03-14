function applyFilters() {
    const selectedLabs = Array.from(document.querySelectorAll('#filterLab input[type=checkbox]:checked'))
        .map(cb => cb.value);
    const selectedStatuses = Array.from(document.querySelectorAll('#filterStatus input[type=checkbox]:checked'))
        .map(cb => cb.value);
    let startDate = document.getElementById("filterStartDate").value;
    let endDate = document.getElementById("filterEndDate").value;
    const requesterName = document.getElementById("filterRequester").value.trim();
    const creditedIndividuals = document.getElementById("filterCredited").value.trim();
    const purpose = document.getElementById("filterPurpose").value.trim();

    console.log("🔄 Sending Filters to Backend:");
    console.log("Start Date (Raw):", startDate);
    console.log("End Date (Raw):", endDate);

    // Determine which tab is active
    const activeTab = document.querySelector("#adminReservationTabs .nav-link.active").getAttribute("href");
    const isUpcomingTab = activeTab === "#upcoming-reservations";

    fetch('/api/filter-reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            labs: selectedLabs.length ? selectedLabs : null,
            statuses: selectedStatuses.length ? selectedStatuses : null,
            start_date: startDate || null,
            end_date: endDate || null,
            requester_name: requesterName || null,
            credited_individuals: creditedIndividuals || null,
            purpose: purpose || null,
            upcoming_only: isUpcomingTab
        })
    })
    .then(response => response.json())
    .then(data => {
        let tableId = isUpcomingTab ? "#upcoming-reservations tbody" : "#reservation-table tbody";
        const tbody = document.querySelector(tableId);
        tbody.innerHTML = ""; // Clear previous content

        if (data.reservations.length === 0) {
            tbody.innerHTML = `<tr><td colspan="10" class="text-center">No reservations found</td></tr>`;
            return;
        }

        let rows = data.reservations.map(reservation => `
            <tr>
                <td>${reservation.id}</td>
                <td>${reservation.lab_name}</td>
                <td>${reservation.slots}</td>
                <td>${reservation.start_datetime}</td>
                <td>${reservation.end_datetime}</td>
                <td>${reservation.requester_name}</td>
                <td>${reservation.reservers}</td>
                <td>${reservation.purpose}</td>
                <td>
                    <span class="badge ${reservation.status === 'Reserved' ? 'bg-success' : 'bg-danger'}">
                        ${reservation.status}
                    </span>
                </td>
                ${isUpcomingTab ? `
                <td>
                    <a href="/edit-reservations/${reservation.id}">
                        <button class="btn btn-warning btn-sm">Edit</button>
                    </a>
                    <button class="btn btn-danger btn-sm" onclick="cancelReservation('${reservation.id}')">Cancel</button>
                </td>` : ''}
            </tr>
        `).join('');

        tbody.innerHTML = rows;
    })
    .catch(error => {
        console.error("❌ Error fetching reservations:", error);
        alert("Failed to filter reservations.");
    });
}

document.querySelector("#applyFiltersBtn").addEventListener("click", applyFilters);

function cancelReservation(reservationId) {
    if (confirm("Are you sure you want to cancel this reservation?")) {
        fetch('/api/reservations/cancel', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: reservationId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Reservation canceled successfully!");
                location.reload(); // Reload page to update UI
            } else {
                alert("Error canceling reservation.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Failed to cancel reservation.");
        });
    }
}