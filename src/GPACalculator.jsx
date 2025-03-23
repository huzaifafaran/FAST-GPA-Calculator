import React, { useState, useEffect } from 'react';

const GRADE_POINTS = {
  'A+': 4, 'A': 4, 'A-': 3.67,
  'B+': 3.33, 'B': 3, 'B-': 2.67,
  'C+': 2.33, 'C': 2, 'C-': 1.67,
  'D+': 1.33, 'D': 1
};

const Footer = () => {
  return (
    <footer className="mt-8 py-4 text-center text-slate-400">
      <div className="border-t border-slate-600/50 pt-4">
        <p className="text-sm">
          Designed and Developed by{" "}
          <span className="font-medium text-blue-400/80 hover:text-purple-400/90 transition-colors">
            Huzaifa Faran
          </span>
        </p>
      </div>
    </footer>
  );
};

const CourseRow = ({ course, onChange, onRemove, isRemovable }) => {
  const handleChange = (field, value) => {
    onChange(course.id, field, value);
  };

  return (
    <div className="mb-4 p-4 md:p-6 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-600/50 shadow-xl hover:shadow-2xl transition-all duration-300">
      {/* Mobile: Stacked layout, Desktop: Grid */}
      <div className="grid grid-cols-12 gap-3 md:gap-4 items-start">
        {/* Course Name - Full width on mobile */}
        <div className="col-span-12 md:col-span-4">
          <input
            type="text"
            value={course.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={`w-full p-2 md:p-3 text-sm md:text-base bg-slate-700/20 border-2 rounded-lg 
              text-slate-100 placeholder-slate-400 focus:border-blue-400/50 focus:ring-2 
              focus:ring-blue-400/20 focus:outline-none transition-all ${
                course.errors?.name ? 'border-red-400/60' : 'border-slate-600/30'
              }`}
            placeholder="Course Name"
          />
          {course.errors?.name && (
            <p className="text-red-400/80 text-xs md:text-sm mt-1 md:mt-2 ml-1">{course.errors.name}</p>
          )}
        </div>

        {/* Credit Hours & Grade - Side by side on mobile */}
        <div className="col-span-6 md:col-span-3">
          <input
            type="number"
            min="1"
            max="3"
            value={course.creditHours}
            onChange={(e) => handleChange('creditHours', e.target.value)}
            className={`w-full p-2 md:p-3 text-sm md:text-base bg-slate-700/20 border-2 rounded-lg 
              text-slate-100 placeholder-slate-400 focus:border-blue-400/50 focus:ring-2 
              focus:ring-blue-400/20 focus:outline-none transition-all ${
                course.errors?.creditHours ? 'border-red-400/60' : 'border-slate-600/30'
              }`}
            placeholder="Credits"
          />
          {course.errors?.creditHours && (
            <p className="text-red-400/80 text-xs md:text-sm mt-1 md:mt-2 ml-1">{course.errors.creditHours}</p>
          )}
        </div>

        <div className="col-span-6 md:col-span-3">
          <select
            value={course.grade}
            onChange={(e) => handleChange('grade', e.target.value)}
            className={`w-full p-2 md:p-3 text-sm md:text-base bg-slate-700/20 border-2 rounded-lg 
              text-slate-100 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 
              focus:outline-none transition-all appearance-none ${
                course.errors?.grade ? 'border-red-400/60' : 'border-slate-600/30'
              }`}
          >
            <option value="" className="bg-slate-800">Select Grade</option>
            {Object.keys(GRADE_POINTS).map((grade) => (
              <option key={grade} value={grade} className="bg-slate-800">{grade}</option>
            ))}
          </select>
          {course.errors?.grade && (
            <p className="text-red-400/80 text-xs md:text-sm mt-1 md:mt-2 ml-1">{course.errors.grade}</p>
          )}
        </div>

        {/* Remove Button - Full width on mobile */}
        <div className="col-span-12 md:col-span-2 mt-2 md:mt-0">
          <button
            onClick={() => onRemove(course.id)}
            disabled={!isRemovable}
            className="w-full py-2 md:py-3 text-sm md:text-base bg-gradient-to-br from-red-500/90 to-red-600/90 hover:from-red-600/90 
              hover:to-red-700/90 text-white rounded-lg disabled:opacity-40 disabled:pointer-events-none 
              transition-all shadow-md hover:shadow-lg font-medium"
          >
            Remove (-)
          </button>
        </div>
      </div>
    </div>
  );
};

const GPACalculator = () => {
  const [courses, setCourses] = useState([{ 
    id: Date.now(), 
    name: '', 
    creditHours: '', 
    grade: '', 
    errors: {} 
  }]);
  const [gpa, setGPA] = useState(0);
  const [hasErrors, setHasErrors] = useState(false);

  const validateField = (name, value) => {
    const errors = {};
    if (name === 'name') {
      if (!value.trim()) {
        errors.name = 'Course name is required';
      } else if (!/^[a-zA-Z\s]+$/.test(value)) {
        errors.name = 'Only alphabetic characters allowed';
      }
    }
    if (name === 'creditHours') {
      const num = parseFloat(value);
      if (!value || isNaN(num) || num < 1 || num > 3) {
        errors.creditHours = 'Must be between 1-3';
      }
    }
    if (name === 'grade') {
      if (!value) errors.grade = 'Grade is required';
    }
    return errors;
  };

  useEffect(() => {
    // Check for any errors in courses
    const errorsExist = courses.some(course => Object.keys(course.errors).length > 0);
    setHasErrors(errorsExist);
  }, [courses]);

  const handleCourseChange = (id, field, value) => {
    setCourses(prev => prev.map(course => {
      if (course.id === id) {
        const allErrors = {
          ...validateField('name', field === 'name' ? value : course.name),
          ...validateField('creditHours', field === 'creditHours' ? value : course.creditHours),
          ...validateField('grade', field === 'grade' ? value : course.grade)
        };

        return { 
          ...course, 
          [field]: value,
          errors: allErrors 
        };
      }
      return course;
    }));
  };

  const addCourse = () => {
    if (courses.length < 10) {
      setCourses(prev => [
        ...prev,
        { id: Date.now() + Math.random(), 
          name: '', 
          creditHours: '', 
          grade: '', 
          errors: {} 
        }
      ]);
    }
  };

  const removeCourse = (id) => {
    if (courses.length > 1) {
      setCourses(prev => prev.filter(course => course.id !== id));
    }
  };

  useEffect(() => {
    let totalPoints = 0;
    let totalCredits = 0;
    let hasValidCourses = false;

    courses.forEach(course => {
      const credits = parseFloat(course.creditHours);
      const gradePoint = GRADE_POINTS[course.grade];
      
      if (!isNaN(credits) && typeof gradePoint === 'number') {
        totalPoints += credits * gradePoint;
        totalCredits += credits;
        hasValidCourses = true;
      }
    });

    setGPA(hasValidCourses ? totalPoints / totalCredits : 0);
  }, [courses]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Mobile: Stacked header, Desktop: Flex row */}
        <div className="mb-6 md:mb-8 flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-center p-4 md:p-6 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-600/50 shadow-2xl">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-center md:text-left">
            GPA CALCULATOR
          </h1>
          <button
            onClick={addCourse}
            disabled={courses.length >= 10}
            className="w-full md:w-auto px-4 md:px-6 py-2 md:py-3 text-sm md:text-base bg-gradient-to-br from-blue-500/90 to-purple-600/90 hover:from-blue-600/90 
              hover:to-purple-700/90 text-white rounded-lg disabled:opacity-40 disabled:pointer-events-none 
              transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-medium"
          >
            <span className="text-lg md:text-xl">+</span> Add Course
          </button>
        </div>
        
        {courses.map((course) => (
          <CourseRow
            key={course.id}
            course={course}
            onChange={handleCourseChange}
            onRemove={removeCourse}
            isRemovable={courses.length > 1}
          />
        ))}
        
        <div className="mt-6 md:mt-8 p-4 md:p-6 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-600/50 shadow-2xl">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-100 text-center md:text-left">
            {hasErrors ? (
              <span className="text-red-400/80 text-sm md:text-base">
                ⚠️ Please resolve all validation errors to calculate GPA
              </span>
            ) : (
              <>
                Cumulative GPA:{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {gpa.toFixed(2)}
                </span>
              </>
            )}
          </h2>
        </div>
        
        <Footer />
      </div>
    </div>
  );
};

export default GPACalculator;
