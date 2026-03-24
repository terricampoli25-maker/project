/* ---------------------------------------------------
   GLOBAL STATE
--------------------------------------------------- */

let habits = [];
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

/* ---------------------------------------------------
   INITIALIZATION
--------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
    loadData();
    renderMonth();

    // Add habit
    document.getElementById("addHabitBtn").addEventListener("click", addHabit);

    // Month navigation
    document.getElementById("prevMonthBtn").addEventListener("click", () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderMonth();
    });

    document.getElementById("nextMonthBtn").addEventListener("click", () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderMonth();
    });
});

/* ---------------------------------------------------
   RENDER MONTH + TABLE
--------------------------------------------------- */

function renderMonth() {
    const monthLabel = document.getElementById("monthLabel");
    const habitBody = document.getElementById("habitBody");

    const monthName = new Date(currentYear, currentMonth).toLocaleString("default", { month: "long" });
    monthLabel.textContent = `${monthName} ${currentYear}`;

    habitBody.innerHTML = "";

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    /* ------------------------------
       BUILD DAY HEADERS
    ------------------------------ */
    const headerRow = document.querySelector("thead tr");
    headerRow.innerHTML = `
        <th class="habit-col">Habit</th>
        <th class="notes-col">Notes</th>
    `;

    for (let day = 1; day <= daysInMonth; day++) {
        const th = document.createElement("th");
        th.textContent = day;
        headerRow.appendChild(th);
    }

    /* ------------------------------
       BUILD HABIT ROWS
    ------------------------------ */
    
    // Sort habits by frequency (descending) then alphabetically (ascending)
    const sortedHabits = habits.map((habit, index) => {
        const completionCount = Object.keys(habit.completed).length;
        return { habit, index, completionCount };
    }).sort((a, b) => {
        if (b.completionCount !== a.completionCount) {
            return b.completionCount - a.completionCount; // Most completed first
        }
        return a.habit.name.localeCompare(b.habit.name); // Alphabetically
    });

    sortedHabits.forEach(({ habit, index: originalIndex }) => {
        const row = document.createElement("tr");
        row.classList.add(`habit-row-${originalIndex}`);

        // Habit name with delete button
        const habitCell = document.createElement("td");
        const habitContainer = document.createElement("div");
        habitContainer.style.display = "flex";
        habitContainer.style.justifyContent = "space-between";
        habitContainer.style.alignItems = "center";
        habitContainer.style.gap = "10px";

        const nameSpan = document.createElement("span");
        nameSpan.textContent = habit.name;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "✕";
        deleteBtn.className = "delete-btn";
        deleteBtn.addEventListener("click", () => deleteHabit(originalIndex));

        habitContainer.appendChild(nameSpan);
        habitContainer.appendChild(deleteBtn);
        habitCell.appendChild(habitContainer);
        row.appendChild(habitCell);

        // Notes
        const notesCell = document.createElement("td");
        const noteBtn = document.createElement("button");
        noteBtn.textContent = "Note";
        noteBtn.className = "note-btn";

        const noteArea = document.createElement("div");
        noteArea.className = "note-area";

        const textarea = document.createElement("textarea");
        textarea.value = habit.notes || "";

        textarea.addEventListener("input", () => {
            habit.notes = textarea.value;
            saveData();

            // Update all day buttons for this habit
            const btns = document.querySelectorAll(`.habit-row-${originalIndex} .check-btn`);
            btns.forEach((b, dayIndex) => {
                const dayKey = `${currentYear}-${currentMonth}-${dayIndex + 1}`;
                updateButtonState(b, habit, dayKey);
            });
        });

        noteArea.appendChild(textarea);

        noteBtn.addEventListener("click", () => {
            noteArea.style.display = noteArea.style.display === "block" ? "none" : "block";
        });

        notesCell.appendChild(noteBtn);
        notesCell.appendChild(noteArea);
        row.appendChild(notesCell);

        // Day squares
        for (let day = 1; day <= daysInMonth; day++) {
            const cell = document.createElement("td");

            const btn = document.createElement("button");
            btn.className = "check-btn";

            const key = `${currentYear}-${currentMonth}-${day}`;

            updateButtonState(btn, habit, key);

            btn.addEventListener("click", (event) => {
                toggleHabit(originalIndex, key, btn, event);
            });

            cell.appendChild(btn);
            row.appendChild(cell);
        }

        habitBody.appendChild(row);
    });
}

/* ---------------------------------------------------
   ADD HABIT
--------------------------------------------------- */

function addHabit() {
    const name = prompt("Enter habit name:");
    if (!name) return;

    habits.push({
        name,
        notes: "",
        completed: {}
    });

    saveData();
    renderMonth();
}

/* ---------------------------------------------------
   DELETE HABIT
--------------------------------------------------- */

function deleteHabit(habitIndex) {
    if (confirm(`Delete "${habits[habitIndex].name}"?`)) {
        habits.splice(habitIndex, 1);
        saveData();
        renderMonth();
    }
}

/* ---------------------------------------------------
   BUTTON STATE LOGIC
--------------------------------------------------- */

function updateButtonState(btn, habit, key) {
    const hasCompleted = habit.completed[key];
    const hasNote = habit.notes && habit.notes.trim() !== "";

    btn.classList.remove("completed", "note-only", "completed-note");

    if (hasCompleted && hasNote) {
        btn.classList.add("completed-note");
    } else if (hasCompleted) {
        btn.classList.add("completed");
    } else if (hasNote) {
        btn.classList.add("note-only");
    }
}

/* ---------------------------------------------------
   TOGGLE HABIT + CONFETTI
--------------------------------------------------- */

function toggleHabit(habitIndex, key, btn, event) {
    const habit = habits[habitIndex];

    if (habit.completed[key]) {
        delete habit.completed[key];
    } else {
        habit.completed[key] = true;
        playChime();
        burstConfetti(event);
    }

    updateButtonState(btn, habit, key);
    saveData();
}

/* ---------------------------------------------------
   CONFETTI
--------------------------------------------------- */

function burstConfetti(event) {
    const container = document.getElementById("confettiContainer");

    const rect = event.target.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;

    for (let i = 0; i < 25; i++) {
        const piece = document.createElement("div");
        piece.style.position = "fixed";
        piece.style.width = "6px";
        piece.style.height = "6px";
        piece.style.background = getRandomColor();
        piece.style.left = originX + "px";
        piece.style.top = originY + "px";
        piece.style.borderRadius = "2px";
        piece.style.pointerEvents = "none";

        container.appendChild(piece);

        const angle = Math.random() * 2 * Math.PI;
        const speed = 3 + Math.random() * 4;

        let vx = Math.cos(angle) * speed;
        let vy = Math.sin(angle) * speed;

        let opacity = 1;

        const interval = setInterval(() => {
            const x = parseFloat(piece.style.left);
            const y = parseFloat(piece.style.top);

            piece.style.left = x + vx + "px";
            piece.style.top = y + vy + "px";

            vy += 0.2;
            opacity -= 0.02;
            piece.style.opacity = opacity;

            if (opacity <= 0) {
                clearInterval(interval);
                piece.remove();
            }
        }, 16);
    }
}

function getRandomColor() {
    const colors = ["#ff00ff", "#ff1493", "#ff00cc", "#ff66ff"];
    return colors[Math.floor(Math.random() * colors.length)];
}

/* ---------------------------------------------------
   CHIME
--------------------------------------------------- */

function playChime() {
    const sound = document.getElementById("chimeSound");
    sound.currentTime = 0;
    sound.play();
}

/* ---------------------------------------------------
   SAVE + LOAD
--------------------------------------------------- */

function saveData() {
    localStorage.setItem("habitData", JSON.stringify(habits));
}

function loadData() {
    const saved = localStorage.getItem("habitData");
    if (saved) habits = JSON.parse(saved);
}
