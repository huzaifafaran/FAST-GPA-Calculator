import React, { useState, useEffect } from 'react';

const GRADE_POINTS = {
  'A+': 4, 'A': 4, 'A-': 3.67,
  'B+': 3.33, 'B': 3, 'B-': 2.67,
  'C+': 2.33, 'C': 2, 'C-': 1.67,
  'D+': 1.33, 'D': 1, 'E+': 0.67, 'E': 0, 'E-': 0
};

const CourseRow = ({ course, onChange, onRemove, isRemovable }) => {
  const handleChange = (field, value) => {
    onChange(course.id, field, value);
  };

  return (
    <div className="mb-4 p-6 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-600/50 shadow-xl hover:shadow-2xl transition-all duration-300">
      <div className="grid grid-cols-12 gap-4 items-start">
        {/* Course Name */}
        <div className="col-span-12 md:col-span-4">
          <input
            type="text"
            value={course.name}
            onChange={(e) => handleChange('name', e.target.value)}
            onBlur={(e) => handleChange('name', e.target.value)}
            className={`w-full p-3 bg-slate-700/20 border-2 border-slate-600/30 rounded-lg 
              text-slate-100 placeholder-slate-400 focus:border-blue-400/50 focus:ring-2 
              focus:ring-blue-400/20 focus:outline-none transition-all ${
                course.errors?.name ? 'border-red-400/60' : ''
              }`}
            placeholder="Course Name"
          />
          {course.errors?.name && (
            <p className="text-red-400/80 text-sm mt-2 ml-1">{course.errors.name}</p>
          )}
        </div>

        {/* Credit Hours */}
        <div className="col-span-6 md:col-span-3">
          <input
            type="number"
            min="1"
            max="3"
            value={course.creditHours}
            onChange={(e) => handleChange('creditHours', e.target.value)}
            className={`w-full p-3 bg-slate-700/20 border-2 border-slate-600/30 rounded-lg 
              text-slate-100 placeholder-slate-400 focus:border-blue-400/50 focus:ring-2 
              focus:ring-blue-400/20 focus:outline-none transition-all ${
                course.errors?.creditHours ? 'border-red-400/60' : ''
              }`}
            placeholder="Credits"
          />
          {course.errors?.creditHours && (
            <p className="text-red-400/80 text-sm mt-2 ml-1">{course.errors.creditHours}</p>
          )}
        </div>

        {/* Grade Dropdown */}
        <div className="col-span-6 md:col-span-3">
          <select
            value={course.grade}
            onChange={(e) => handleChange('grade', e.target.value)}
            className={`w-full p-3 bg-slate-700/20 border-2 border-slate-600/30 rounded-lg 
              text-slate-100 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 
              focus:outline-none transition-all appearance-none ${
                course.errors?.grade ? 'border-red-400/60' : ''
              }`}
          >
            <option value="" className="bg-slate-800">Select Grade</option>
            {Object.keys(GRADE_POINTS).map((grade) => (
              <option key={grade} value={grade} className="bg-slate-800">{grade}</option>
            ))}
          </select>
          {course.errors?.grade && (
            <p className="text-red-400/80 text-sm mt-2 ml-1">{course.errors.grade}</p>
          )}
        </div>

        {/* Remove Button */}
        <div className="col-span-12 md:col-span-2">
          <button
            onClick={() => onRemove(course.id)}
            disabled={!isRemovable}
            className="w-full py-3 bg-gradient-to-br from-red-500/90 to-red-600/90 hover:from-red-600/90 
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-center p-6 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-600/50 shadow-2xl">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            GPA CALCULATOR
          </h1>
          <button
            onClick={addCourse}
            disabled={courses.length >= 10}
            className="px-6 py-3 bg-gradient-to-br from-blue-500/90 to-purple-600/90 hover:from-blue-600/90 
              hover:to-purple-700/90 text-white rounded-lg disabled:opacity-40 disabled:pointer-events-none 
              transition-all shadow-md hover:shadow-lg flex items-center gap-2 font-medium"
          >
            <span className="text-xl">+</span> Add Course
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
        
        <div className="mt-8 p-6 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-600/50 shadow-2xl">
          <h2 className="text-2xl font-semibold text-slate-100">
            {hasErrors ? (
              <span className="text-red-400/80">
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
      </div>
    </div>
  );
};

export default GPACalculator;