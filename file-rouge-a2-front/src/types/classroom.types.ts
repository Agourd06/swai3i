export interface Classroom {
    _id: string;        // Unique identifier for the classroom
    course: string;     // Reference to the course ID
    schedule: string;   // Schedule for the classroom (can be a string or a more complex type)
    location: string;   // Location of the classroom
    // Add other fields as necessary
}