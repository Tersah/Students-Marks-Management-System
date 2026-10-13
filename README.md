# Student Marks Manager

A responsive browser-based application demonstrating how arrays can be used in a real-world student marks management system.

## Project structure

```text
student-marks-manager/
├── index.html   # Page structure and links to CSS/JS
├── style.css    # Styling and responsive layout
├── script.js    # App logic, array operations, and event handlers
├── README.md    # Documentation and deployment guide
└── LICENSE      # MIT license
```

## Features

- Add, edit, and delete student records
- Record name, class/course, and mark (0–100)
- Automatically assign a grade
- Calculate student count, class average, highest mark, and pass rate
- Search by student name or class/course
- Sort by name or mark
- Export records to CSV
- Save records in the current browser using `localStorage`
- Responsive interface for desktop and mobile

## Run locally

1. Download and extract the ZIP file.
2. Open the extracted `student-marks-manager` folder.
3. Double-click `index.html` to open it in a modern browser.

Keep all files in the same folder. The CSS and JavaScript are loaded by `index.html` using relative paths. No installation or build step is needed.

## Deploy on GitHub Pages (browser method)

1. Sign in at [GitHub](https://github.com/).
2. Create a repository at [github.com/new](https://github.com/new), named `student-marks-manager`. For the simplest GitHub Free setup, choose **Public**.
3. Open the new repository and choose **Add file → Upload files**.
4. Upload the files `index.html`, `style.css`, `script.js`, `README.md`, and `LICENSE` directly into the repository root. Do not upload only the ZIP file, and do not put the files inside an extra nested folder.
5. Enter a commit message such as `Add student marks manager` and commit to the `main` branch.
6. Open **Settings → Pages** in the repository.
7. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
8. Choose branch **main** and folder **/(root)**, then click **Save**.
9. Wait for the deployment to finish. Return to **Settings → Pages** and open the published site. The URL will look like:

   `https://YOUR-GITHUB-USERNAME.github.io/student-marks-manager/`

Official instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

## Deploy using Git (optional)

Create an empty repository named `student-marks-manager` on GitHub, then run these commands from this folder. Replace `YOUR-GITHUB-USERNAME` with your GitHub username.

```bash
git init
git add index.html style.css script.js README.md LICENSE
git commit -m "Add student marks manager"
git branch -M main
git remote add origin https://github.com/YOUR-GITHUB-USERNAME/student-marks-manager.git
git push -u origin main
```

Then enable Pages using steps 6–9 above.

## How arrays are used

The main data structure is an array of objects:

```javascript
let students = [
  { id: 1, name: "Ama Mensah", mark: 85, className: "Computer Engineering" },
  { id: 2, name: "Kofi Boateng", mark: 72, className: "Mathematics" }
];
```

- `push()` adds a student.
- `filter()` searches and removes selected records.
- `map()` updates a student record and extracts transformed data.
- `reduce()` calculates the class total and average.
- `sort()` orders the visible list.

Each student is an object, and the array contains all student objects. This is easier to maintain than making separate variables for every student.

## Notes and limitations

- This is a front-end learning project, not a secure school database.
- Records are saved only in the current browser/device. They do not sync to another device or user. Clearing browser data can erase them.
- Avoid entering sensitive real student information into a public demonstration.
- The sample grade scale is A = 80–100, B = 70–79, C = 60–69, D = 50–59, F = below 50. Edit `getGrade()` in `script.js` to match your school's grading rules.
- GitHub Pages hosts static files. User accounts or a shared database would need a separate backend or managed service.

## AI assistance disclosure

AI assistance was used to help scaffold and document this learning project. Review and test the code, and make sure you can explain the array operations before submitting it for assessment.
