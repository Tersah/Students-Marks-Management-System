/* Student Marks Manager — application logic */
"use strict";

const STORAGE_KEY = "student-marks-manager-v1";

const starterStudents = [
  { id: 1, name: "Ama Mensah", mark: 85, className: "Computer Engineering" },
  { id: 2, name: "Kofi Boateng", mark: 72, className: "Computer Engineering" },
  { id: 3, name: "Abena Owusu", mark: 90, className: "Mathematics" },
  { id: 4, name: "Yaw Asante", mark: 48, className: "Mathematics" }
];

// Main data structure: an array containing student objects.
let students = loadStudents();
let nextId = students.reduce((largest, student) => Math.max(largest, student.id), 0) + 1;

function loadStudents() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (error) {
    console.warn("Could not read saved student data:", error);
  }
  return starterStudents.map(student => ({ ...student }));
}

function saveStudents() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  } catch (error) {
    showNotice("The browser could not save changes. Check your browser storage settings.", true);
  }
}

function getGrade(mark) {
  if (mark >= 80) return "A";
  if (mark >= 70) return "B";
  if (mark >= 60) return "C";
  if (mark >= 50) return "D";
  return "F";
}

function showNotice(message, isError = false) {
  const notice = document.getElementById("notice");
  notice.textContent = message;
  notice.classList.toggle("error", isError);
  notice.style.display = "block";
  window.clearTimeout(showNotice.timer);
  showNotice.timer = window.setTimeout(() => {
    notice.style.display = "none";
  }, 3500);
}

function makeCell(text, className = "") {
  const cell = document.createElement("td");
  cell.textContent = text;
  if (className) cell.className = className;
  return cell;
}

function render() {
  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  const sortMode = document.getElementById("sortSelect").value;

  // filter() creates the list of records matching the search.
  const visibleStudents = students.filter(student =>
    student.name.toLowerCase().includes(query) ||
    (student.className || "").toLowerCase().includes(query)
  );

  // sort() orders the display list.
  visibleStudents.sort((a, b) => {
    if (sortMode === "mark-desc") return b.mark - a.mark || a.name.localeCompare(b.name);
    if (sortMode === "mark-asc") return a.mark - b.mark || a.name.localeCompare(b.name);
    return a.name.localeCompare(b.name);
  });

  const rows = document.getElementById("studentRows");
  rows.replaceChildren();

  visibleStudents.forEach((student, index) => {
    const row = document.createElement("tr");
    row.append(
      makeCell(String(index + 1)),
      makeCell(student.name),
      makeCell(student.className || "—"),
      makeCell(String(student.mark) + "%", "mark")
    );

    const gradeCell = document.createElement("td");
    const grade = document.createElement("span");
    grade.className = "grade";
    grade.textContent = getGrade(student.mark);
    gradeCell.appendChild(grade);
    row.appendChild(gradeCell);

    const actions = makeCell("");
    actions.className = "actions";

    const editButton = document.createElement("button");
    editButton.className = "btn soft";
    editButton.type = "button";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => openEdit(student.id));

    const deleteButton = document.createElement("button");
    deleteButton.className = "btn danger";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteStudent(student.id));

    actions.append(editButton, deleteButton);
    row.appendChild(actions);
    rows.appendChild(row);
  });

  document.getElementById("emptyState").style.display = visibleStudents.length ? "none" : "block";
  document.getElementById("resultCount").textContent =
    `Showing ${visibleStudents.length} of ${students.length} student${students.length === 1 ? "" : "s"}`;

  const count = students.length;
  const total = students.reduce((sum, student) => sum + student.mark, 0);
  const highest = count ? Math.max(...students.map(student => student.mark)) : null;
  const passCount = students.filter(student => student.mark >= 50).length;

  document.getElementById("countStat").textContent = count;
  document.getElementById("averageStat").textContent = count ? (total / count).toFixed(1) + "%" : "—";
  document.getElementById("highestStat").textContent = count ? highest + "%" : "—";
  document.getElementById("passStat").textContent = count ? Math.round(passCount / count * 100) + "%" : "—";
}

document.getElementById("addForm").addEventListener("submit", event => {
  event.preventDefault();

  const name = document.getElementById("nameInput").value.trim();
  const markText = document.getElementById("markInput").value;
  const className = document.getElementById("classInput").value.trim();
  const mark = Number(markText);

  if (!name || markText === "" || !Number.isInteger(mark) || mark < 0 || mark > 100) {
    showNotice("Enter a name and a whole-number mark from 0 to 100.", true);
    return;
  }

  const duplicate = students.some(student =>
    student.name.toLowerCase() === name.toLowerCase() &&
    (student.className || "").toLowerCase() === className.toLowerCase()
  );
  if (duplicate) {
    showNotice("A student with this name and class is already in the list.", true);
    return;
  }

  // push() adds the new student object to the array.
  students.push({ id: nextId++, name, mark, className });
  saveStudents();
  event.target.reset();
  document.getElementById("nameInput").focus();
  render();
  showNotice(`${name} was added successfully.`);
});

function deleteStudent(id) {
  const student = students.find(item => item.id === id);
  if (!student || !window.confirm(`Delete ${student.name}'s record?`)) return;

  // filter() returns every record except the selected student.
  students = students.filter(item => item.id !== id);
  saveStudents();
  render();
  showNotice("Student record deleted.");
}

function openEdit(id) {
  const student = students.find(item => item.id === id);
  if (!student) return;

  document.getElementById("editId").value = student.id;
  document.getElementById("editName").value = student.name;
  document.getElementById("editMark").value = student.mark;
  document.getElementById("editClass").value = student.className || "";
  document.getElementById("editBackdrop").style.display = "flex";
  document.getElementById("editName").focus();
}

function closeEdit() {
  document.getElementById("editBackdrop").style.display = "none";
}

document.getElementById("editForm").addEventListener("submit", event => {
  event.preventDefault();

  const id = Number(document.getElementById("editId").value);
  const name = document.getElementById("editName").value.trim();
  const markText = document.getElementById("editMark").value;
  const mark = Number(markText);
  const className = document.getElementById("editClass").value.trim();

  if (!name || markText === "" || !Number.isInteger(mark) || mark < 0 || mark > 100) {
    showNotice("Enter a name and a whole-number mark from 0 to 100.", true);
    return;
  }

  const duplicate = students.some(student =>
    student.id !== id &&
    student.name.toLowerCase() === name.toLowerCase() &&
    (student.className || "").toLowerCase() === className.toLowerCase()
  );
  if (duplicate) {
    showNotice("Another record already uses this name and class.", true);
    return;
  }

  // map() creates a new array with the selected record updated.
  students = students.map(student => student.id === id
    ? { ...student, name, mark, className }
    : student
  );

  saveStudents();
  closeEdit();
  render();
  showNotice("Student record updated.");
});

document.getElementById("cancelEdit").addEventListener("click", closeEdit);
document.getElementById("editBackdrop").addEventListener("click", event => {
  if (event.target.id === "editBackdrop") closeEdit();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeEdit();
});
document.getElementById("searchInput").addEventListener("input", render);
document.getElementById("sortSelect").addEventListener("change", render);

document.getElementById("exportButton").addEventListener("click", () => {
  const headers = ["Student name", "Class / course", "Mark", "Grade"];
  const dataRows = students.map(student => [
    student.name,
    student.className || "",
    student.mark,
    getGrade(student.mark)
  ]);

  // Escape quotes correctly so names/classes export safely to CSV.
  const escapeCsv = value => `"${String(value).replace(/"/g, '""')}"`;
  const csv = [headers, ...dataRows]
    .map(row => row.map(escapeCsv).join(","))
    .join("\r\n");

  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "student-marks.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showNotice("CSV file exported.");
});

render();
