import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { teacherFetchers } from '../fetchers/teacherFetchers';
import { CourseCreation } from '../types/courseCreation.types';

const daysOfWeek = [
    { value: 'MONDAY', label: 'Monday' },
    { value: 'TUESDAY', label: 'Tuesday' },
    { value: 'WEDNESDAY', label: 'Wednesday' },
    { value: 'THURSDAY', label: 'Thursday' },
    { value: 'FRIDAY', label: 'Friday' },
    { value: 'SATURDAY', label: 'Saturday' },
    { value: 'SUNDAY', label: 'Sunday' },
];

const AddCourseForm: React.FC<{ teacherId: string }> = ({ teacherId }) => {
    const navigate = useNavigate();
    const [courseData, setCourseData] = useState<CourseCreation>({
        title: '',
        description: '',
        subject: '',
        level: '',
        city: '',
        price: 0,
        duration: 0,
        courseType: [],
        location: '',
        maxStudents: 1,
        timeSlots: [],
        startDate: '',
        endDate: '',
        teacher: teacherId,
    });

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
            timeSlots: [...prevData.timeSlots, { day: '', hour: 0, minute: 0 }],
        }));
    };

    const handleSubmit = async () => {
        try {
            const formattedData = {
                ...courseData,
                startDate: new Date(courseData.startDate).toISOString(),
                endDate: new Date(courseData.endDate).toISOString(),
                timeSlots: courseData.timeSlots.map(slot => ({
                    day: slot.day || '',
                    hour: Number(slot.hour),
                    minute: Number(slot.minute),
                })),
            };

            formattedData.price = Math.max(0, Number(formattedData.price));
            formattedData.duration = Math.max(0, Number(formattedData.duration));
            formattedData.maxStudents = Math.max(1, Number(formattedData.maxStudents));

            const response = await teacherFetchers.createCourse(formattedData);
            console.log('Course created successfully:', response);
            navigate(`/teacher/${teacherId}`);
        } catch (error) {
            console.error('Failed to add course:', error);
        }
    };

    return (
        <div className="w-full p-6 bg-white shadow-lg rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['title', 'description', 'subject', 'level', 'city', 'price', 'duration', 'location', 'maxStudents', 'startDate', 'endDate'].map((field, index) => (
                    <div key={index} className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={field}>
                            {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                        </label>
                        {field === 'description' ? (
                            <textarea
                                name={field}
                                placeholder={`Enter ${field}`}
                                onChange={handleChange}
                                required
                                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        ) : (
                            <input
                                type={field === 'price' || field === 'duration' || field === 'maxStudents' ? 'number' : 'text'}
                                name={field}
                                placeholder={`Enter ${field}`}
                                onChange={handleChange}
                                required
                                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        )}
                    </div>
                ))}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="courseType">
                        Course Type
                    </label>
                    <select
                        name="courseType"
                        onChange={(e) => {
                            const value = Array.from(e.target.selectedOptions, option => option.value);
                            setCourseData(prevData => ({ ...prevData, courseType: value }));
                        }}
                        required
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="">Select Course Type</option>
                        <option value="private">Private</option>
                        <option value="classroom">Classroom</option>
                        <option value="online">Online</option>
                    </select>
                </div>
            </div>
            <h3 className="text-lg font-semibold mb-4">Time Slots</h3>
            {courseData.timeSlots.map((slot, index) => (
                <div key={index} className="flex mb-4">
                    <select
                        value={slot.day}
                        onChange={(e) => handleTimeSlotChange(index, 'day', e.target.value)}
                        className="shadow border rounded w-1/3 py-2 px-3"
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
                        className="shadow border rounded w-1/3 py-2 px-3 mx-2"
                    />
                    <input
                        type="number"
                        placeholder="Minute"
                        value={slot.minute}
                        onChange={(e) => handleTimeSlotChange(index, 'minute', Math.min(59, Number(e.target.value)))}
                        max="59"
                        className="shadow border rounded w-1/3 py-2 px-3"
                    />
                </div>
            ))}
            <button type="button" onClick={addTimeSlot} className="bg-green-500 text-white py-2 px-4 rounded">
                Add Time Slot
            </button>
            <button
                type="button"
                onClick={handleSubmit}
                className="bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-blue-700 w-full mt-4"
            >
                Add Course
            </button>
        </div>
    );
};

export default AddCourseForm; 