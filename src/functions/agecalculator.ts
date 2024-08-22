export function calculateAge(dateString: string): number {
    if (!dateString) {
        console.log("Invalid date string")
        return 0;
    }
    // Split the date string into year, month, and day
    const [year, month, day] = dateString.split('-').map(Number);

    // Get current date
    const currentDate = new Date();

    // Get the birthdate from the provided string
    const birthDate = new Date(year, month - 1, day);

    // Calculate the age
    let age = currentDate.getFullYear() - birthDate.getFullYear();

    // Adjust age if birthday hasn't occurred yet this year
    if (currentDate.getMonth() < birthDate.getMonth() || (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate())) {
        age--;
    }
    if (age === 0) {
        return 1;
    }

    return age;
}

export function calculateDateOfBirth(age: number): string {
    // Get current date
    const currentDate = new Date();

    // Calculate the birth year
    const birthYear = currentDate.getFullYear() - age;

    // Get the birth date to YYYY-01-01
    const birthDate = new Date(birthYear, 1, -29);

    // Format the birth date
    const formattedDate = birthDate.toISOString().split('T')[0];

    return formattedDate;
}