import React from 'react';
import { CourseType } from '../../fetchers/courseFetchers';

interface CourseFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  teacherSearchTerm: string;
  setTeacherSearchTerm: (term: string) => void;
  selectedTypes: CourseType[];
  setSelectedTypes: (types: CourseType[]) => void;
  priceRange: { min: number; max: number };
  setPriceRange: (range: { min: number; max: number }) => void;
}

const CourseFilters: React.FC<CourseFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  teacherSearchTerm,
  setTeacherSearchTerm,
  selectedTypes,
  setSelectedTypes,
  priceRange,
  setPriceRange,
}) => {
  return (
    <div className="mb-8 bg-white rounded-xl p-6 shadow-md">
      <div className="space-y-4">
        {/* Search Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Course Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Courses
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title or description..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Teacher Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Teacher
            </label>
            <input
              type="text"
              value={teacherSearchTerm}
              onChange={(e) => setTeacherSearchTerm(e.target.value)}
              placeholder="Search by teacher name..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Course Type Filters */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Type
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.values(CourseType).map((type) => (
              <button
                key={type}
                onClick={() => {
                  setSelectedTypes(prev =>
                    prev.includes(type)
                      ? prev.filter(t => t !== type)
                      : [...prev, type]
                  );
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedTypes.includes(type)
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range: ${priceRange.min} - ${priceRange.max}
          </label>
          <div className="flex gap-4">
            <div className="w-full">
              <label className="block text-xs text-gray-500 mb-1">Min Price</label>
              <input
                type="range"
                min="0"
                max={priceRange.max}
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({
                  ...prev,
                  min: Number(e.target.value)
                }))}
                className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-500
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-4
                  [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:bg-emerald-500
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:transition-all
                  [&::-webkit-slider-thumb]:duration-150
                  [&::-webkit-slider-thumb]:hover:bg-emerald-600
                  [&::-webkit-slider-thumb]:hover:scale-110"
              />
            </div>
            <div className="w-full">
              <label className="block text-xs text-gray-500 mb-1">Max Price</label>
              <input
                type="range"
                min={priceRange.min}
                max="1000"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({
                  ...prev,
                  max: Number(e.target.value)
                }))}
                className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-500
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-4
                  [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:bg-emerald-500
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:transition-all
                  [&::-webkit-slider-thumb]:duration-150
                  [&::-webkit-slider-thumb]:hover:bg-emerald-600
                  [&::-webkit-slider-thumb]:hover:scale-110"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseFilters; 