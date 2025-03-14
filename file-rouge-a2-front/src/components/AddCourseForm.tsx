import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { teacherFetchers } from '../fetchers/teacherFetchers';
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

interface AddCourseFormProps {
    teacherId: string;
    setIsModalOpen: (isOpen: boolean) => void;
    onCourseAdded?: () => Promise<void>;
}

const AddCourseForm: React.FC<AddCourseFormProps> = ({ 
    teacherId, 
    setIsModalOpen,
    onCourseAdded 
}) => {
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
            timeSlots: [...prevData.timeSlots, { day: '', hour: 0, minute: 0 }],
        }));
    };

    const handleCourseTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as CourseType;
        
        setCourseData(prevData => ({
            ...prevData,
            courseType: value ? [value] : []
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

            const formattedData = {
                ...courseData,
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

            const response = await teacherFetchers.createCourse(formattedData);
            console.log('Course created successfully:', response);
            navigate(`/teacher/${teacherId}`);
            setIsModalOpen(false);
            if (onCourseAdded) {
                await onCourseAdded();
            }
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to add course');
            console.error('Failed to add course:', error);
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
                                placeholder={`Enter ${field}`}
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
                                placeholder={`Enter ${field}`}
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
    
            <button
                type="button"
                onClick={handleSubmit}
                className="bg-emerald-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-emerald-700 hover:bg-emerald-700 w-full mt-4"
            >
                Add Course
            </button>
        </div>
    );
    
};

export default AddCourseForm; 