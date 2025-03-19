import React, { useState } from 'react';
import { Course } from '../types/Course';
import { courseFetchers } from '../fetchers/courseFetchers';
import { CourseCreation, CourseType } from '../types/courseCreation.types';

const daysOfWeek = [
    { value: 'MONDAY', label: 'Monday' },
    { value: 'TUESDAY', label: 'Tuesday' },
    { value: 'WEDNESDAY', label: 'Wednesday' },
    { value: 'THURSDAY', label: 'Thursday' },
    { value: 'FRIDAY', label: 'Friday' },
    { value: 'SATURDAY', label: 'Saturday' },
    { value: 'SUNDAY', label: 'Sunday' },
];

interface UpdateCourseFormProps {
    course: Course;
    onClose: () => void;
    onCourseUpdated: () => void;
}

const UpdateCourseForm: React.FC<UpdateCourseFormProps> = ({ course, onClose, onCourseUpdated }) => {
    const [courseData, setCourseData] = useState<CourseCreation>({
        title: course.title,
        description: course.description,
        subject: course.subject,
        level: course.level,
        city: course.city,
        price: course.price,
        duration: course.duration,
        courseType: course.courseType as CourseType[],
        location: course.location || '',
        maxStudents: course.maxStudents || 1,
        timeSlots: Array.isArray(course.timeSlots) ? course.timeSlots.map(slot => ({
            day: slot.day,
            hour: slot.hour || 0,
            minute: slot.minute || 0
        })) : [],
        startDate: new Date(course.startDate).toISOString().slice(0, 16),
        endDate: new Date(course.endDate).toISOString().slice(0, 16),
        teacher: course.teacher._id,
    });
    const [error, setError] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCourseData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleTimeSlotChange = (index: number, field: string, value: string | number) => {
        const updatedTimeSlots = [...courseData.timeSlots];
        updatedTimeSlots[index] = {
            ...updatedTimeSlots[index],
            [field]: value,
        };
        setCourseData((prevData) => ({
            ...prevData,
            timeSlots: updatedTimeSlots,
        }));
    };

    const addTimeSlot = () => {
        setCourseData((prevData) => ({
            ...prevData,
            timeSlots: [...prevData.timeSlots, { 
                day: '',
                startTime: '',
                endTime: '',
                hour: 0,
                minute: 0
            }],
        }));
    };

    const handleCourseTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCourseData(prevData => ({
            ...prevData,
            courseType: [e.target.value as CourseType]
        }));
    };

    const handleSubmit = async () => {
        try {
            // Validate dates
            const startDateObj = new Date(courseData.startDate);
            const endDateObj = new Date(courseData.endDate);

            if (startDateObj >= endDateObj) {
                setError('Start date must be before end date');
                return;
            }

            const { teacher, ...dataWithoutTeacher } = courseData;
            const formattedData = {
                ...dataWithoutTeacher,
                startDate: startDateObj.toISOString(),
                endDate: endDateObj.toISOString(),
                timeSlots: courseData.timeSlots.map(slot => ({
                    day: slot.day,
                    hour: Number(slot.hour),
                    minute: Number(slot.minute),
                })),
                price: Number(courseData.price),
                duration: Number(courseData.duration),
                maxStudents: Number(courseData.maxStudents),
            };

            await courseFetchers.updateCourse(course._id, formattedData);
            onCourseUpdated();
            onClose();
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to update course');
            console.error('Failed to update course:', error);
        }
    };

    return (
        <div className="w-full p-6 bg-white shadow-lg rounded-lg border-l-4 border-emerald-400">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['title', 'description', 'subject', 'level', 'city', 'price', 'duration', 'location', 'maxStudents', 'startDate', 'endDate'].map((field, index) => (
                    <div key={index} className="mb-4">
                        <label className="block text-emerald-700 text-sm font-bold mb-2" htmlFor={field}>
                            {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                        </label>
                        {field === 'description' ? (
                            <textarea
                                name={field}
                                value={courseData[field as keyof typeof courseData] as string}
                                onChange={handleChange}
                                required
                                className="shadow border rounded w-full py-2 px-3 text-emerald-700 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        ) : (
                            <input
                                type={
                                    field === 'price' || field === 'duration' || field === 'maxStudents'
                                        ? 'number'
                                        : field === 'startDate' || field === 'endDate'
                                        ? 'datetime-local'
                                        : 'text'
                                }
                                name={field}
                                value={courseData[field as keyof typeof courseData] as string}
                                onChange={handleChange}
                                required
                                min={field === 'startDate' 
                                    ? new Date().toISOString().slice(0, 16) 
                                    : field === 'endDate' 
                                    ? courseData.startDate 
                                    : undefined}
                                className="shadow border rounded w-full py-2 px-3 text-emerald-700 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        )}
                    </div>
                ))}

                <div className="mb-4">
                    <label className="block text-emerald-700 text-sm font-bold mb-2" htmlFor="courseType">
                        Course Type
                    </label>
                    <select
                        name="courseType"
                        onChange={handleCourseTypeChange}
                        value={courseData.courseType[0] || ''}
                        required
                        className="shadow border rounded w-full py-2 px-3 text-emerald-700 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        <option value="">Select Course Type</option>
                        <option value="private">Private</option>
                        <option value="classroom">Classroom</option>
                        <option value="online">Online</option>
                    </select>
                </div>
            </div>

            <h3 className="text-lg font-semibold mb-4 text-emerald-800">Time Slots</h3>
            {courseData.timeSlots.map((slot, index) => (
                <div key={index} className="flex mb-4">
                    <select
                        value={slot.day}
                        onChange={(e) => handleTimeSlotChange(index, 'day', e.target.value)}
                        className="shadow border rounded w-1/3 py-2 px-3 text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        <option value="">Select Day</option>
                        {daysOfWeek.map(day => (
                            <option key={day.value} value={day.value}>{day.label}</option>
                        ))}
                    </select>
                    <input
                        type="number"
                        placeholder="Hour"
                        value={slot.hour}
                        onChange={(e) => handleTimeSlotChange(index, 'hour', Math.min(23, Number(e.target.value)))}
                        max="23"
                        className="shadow border rounded w-1/3 py-2 px-3 mx-2 text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                        type="number"
                        placeholder="Minute"
                        value={slot.minute}
                        onChange={(e) => handleTimeSlotChange(index, 'minute', Math.min(59, Number(e.target.value)))}
                        max="59"
                        className="shadow border rounded w-1/3 py-2 px-3 text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>
            ))}

            <button
                type="button"
                onClick={addTimeSlot}
                className="bg-emerald-500 text-white py-2 px-4 rounded hover:bg-emerald-600 transition"
            >
                Add Time Slot
            </button>

            <div className="flex justify-end space-x-4 mt-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-emerald-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-emerald-700 hover:bg-emerald-700"
                >
                    Update Course
                </button>
            </div>
        </div>
    );
};

export default UpdateCourseForm; 