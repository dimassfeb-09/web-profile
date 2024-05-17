export const formatDate = (inputDate: string) => {
    const formattedDate = new Date(inputDate).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    return formattedDate;
};