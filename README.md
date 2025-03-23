# GPA Calculator

## Overview
This is a simple GPA Calculator built with React. It allows users to enter course details, including course name, credit hours, and grades, and calculates the cumulative GPA accordingly. The UI is designed using Tailwind CSS, ensuring a sleek and modern appearance.

## Features
- Add up to 10 courses.
- Input validation for course name, credit hours, and grade selection.
- Dynamic GPA calculation based on user input.
- Responsive and modern UI.
- Ability to remove courses dynamically.
- Dark mode support for better accessibility.

## Technologies Used
- React (useState, useEffect)
- Tailwind CSS
- Vite for faster development

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/huzaifafaran/FAST-GPA-Calculator.git
   cd gpa-calculator
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Run the application:
   ```sh
   npm run dev
   ```

## Usage

1. Open the application in a browser at ``.
2. Enter course details:
   - Course name
   - Credit hours (1-3)
   - Grade (A+, A, A-, B+, B, B-, etc.)
3. The GPA is calculated automatically.
4. Add or remove courses as needed.

## Grade Points System
The following grading scale is used:

| Grade | Grade Point |
|-------|------------|
| A+    | 4.00       |
| A     | 4.00       |
| A-    | 3.67       |
| B+    | 3.33       |
| B     | 3.00       |
| B-    | 2.67       |
| C+    | 2.33       |
| C     | 2.00       |
| C-    | 1.67       |
| D+    | 1.33       |
| D     | 1.00       |
| E+    | 0.67       |
| E     | 0.00       |
| E-    | 0.00       |

## Contributing
Feel free to fork this repository and contribute to improve the project.

## License
This project is licensed under the MIT License.
