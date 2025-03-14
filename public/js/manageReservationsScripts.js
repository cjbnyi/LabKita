$(document).ready(function () {
    $.ajax({
        url: '/api/manage-reservations',
        method: 'GET',
        success: function (reservations) {
            console.log("API Response:", reservations); // Debugging line
            
            if (!Array.isArray(reservations)) {
                console.error("Expected an array but got:", reservations);
                return;
            }
    
            let tableBody = $('#reservationsTable tbody');
            tableBody.empty();
    
            if (reservations.length === 0) {
                tableBody.append('<tr><td colspan="10">No upcoming reservations found.</td></tr>');
                return;
            }
    
            reservations.forEach(reservation => {
                let row = `
                    <tr>
                        <td>${reservation._id}</td>
                        <td>${reservation.labID?.name || 'N/A'}</td>
                        <td>${reservation.seatIDs.length}</td>
                        <td>${new Date(reservation.startDateTime).toLocaleString()}</td>
                        <td>${new Date(reservation.endDateTime).toLocaleString()}</td>
                        <td>${reservation.requestingStudentID?.firstName + ' ' + reservation.requestingStudentID?.lastName || 'N/A'}</td>
                        <td>${reservation.creditedStudentIDs.length > 0 ? reservation.creditedStudentIDs.map(r => r.firstName + ' ' + r.lastName).join(', ') : 'N/A'}</td>
                        <td>${reservation.purpose || 'N/A'}</td>
                        <td>${reservation.status}</td>
                        <td>
                            <button class="btn btn-danger delete-btn" data-id="${reservation._id}">Delete</button>
                        </td>
                    </tr>
                `;
                tableBody.append(row);
            });
        },
        error: function (err) {
            console.error('Error fetching reservations:', err);
        }
    });
});
