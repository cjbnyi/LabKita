const formatDate = (date) => {
    // Create a new Date object from the input
    const utcDate = new Date(date);

    // Add 8 hours to adjust for timezone
    const adjustedDate = new Date(utcDate.getTime() + (8 * 60 * 60 * 1000));

    // Format the adjusted date
    return adjustedDate.toLocaleString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};

export {
    formatDate
};
