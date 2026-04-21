/* ---------------------------------------------------
   GLOBAL STATE
--------------------------------------------------- */

let habits = [];
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

let activeHabitIndex = null;
let activeDayKey = null;

/* ---------------------------------------------------
   INITIALIZATION
--------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
    loadData();
    renderMonth();

    document.getElementById("addHabitBtn").addEventListener("click", addHabit);

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

    document.getElementById("closeModalBtn").addEventListener("click", closeModal);
    document.getElementById("modalOverlay").addEventListener("click", (e) => {
        if (e.target.id === "modalOverlay") closeModal();
    });

    document.getElementById("modalTextarea").addEventListener("input", handleNoteInput);
});

/* ---------------------------------------------------
   ADD + DELETE HABITS
--------------------------------------------------- */

function addHabit() {
    const name = prompt("Enter habit name:");
    if (!name || name.trim() === "") return;

    habits.push({
        name: name.trim(),
        completed: {},
        notes: {}
    });

    saveData();
    renderMonth();
}

function deleteHabit(index) {
    if (!confirm(`Delete habit "${habits[index].name}"?`)) return;
    habits.splice(index, 1);
    saveData();
    renderMonth();
}

/* ---------------------------------------------------
   MODAL FUNCTIONS
--------------------------------------------------- */

function openModal(habitIndex, dayKey) {
    activeHabitIndex = habitIndex;
    activeDayKey = dayKey;

    const modal = document.getElementById("noteModal");
    const overlay = document.getElementById("modalOverlay");
    const textarea = document.getElementById("modalTextarea");

    const habit = habits[habitIndex];

    if (!habit.notes || typeof habit.notes !== "object") {
        habit.notes = {};
    }

    textarea.value = habit.notes[dayKey] || "";

    overlay.classList.add("show");
    modal.classList.add("show");
}

function closeModal() {
    const modal = document.getElementById("noteModal");
    const overlay = document.getElementById("modalOverlay");

    modal.classList.remove("show");
    overlay.classList.remove("show");

    activeHabitIndex = null;
    activeDayKey = null;
}

/* ---------------------------------------------------
   HANDLE NOTE INPUT
--------------------------------------------------- */

function handleNoteInput() {
    if (activeHabitIndex === null || !activeDayKey) return;

    const textarea = document.getElementById("modalTextarea");
    const habit = habits[activeHabitIndex];

    if (!habit.notes || typeof habit.notes !== "object") {
        habit.notes = {};
    }

    const value = textarea.value.trim();

    if (value === "") {
        delete habit.notes[activeDayKey];
    } else {
        habit.notes[activeDayKey] = value;
    }

    saveData();
    renderMonth();
}

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
       RENDER HEADER
    ------------------------------ */
    const headerRow = document.querySelector("thead tr");
    headerRow.innerHTML = `<th class="habit-col">Habit</th>`;

    for (let day = 1; day <= daysInMonth; day++) {
        const th = document.createElement("th");
        th.textContent = day;
        headerRow.appendChild(th);
    }

    /* ------------------------------
       SORT HABITS
    ------------------------------ */
    const sortedHabits = habits
        .map((habit, index) => {
            const completionCount = habit.completed ? Object.keys(habit.completed).length : 0;
            return { habit, index, completionCount };
        })
        .sort((a, b) => {
            if (b.completionCount !== a.completionCount) {
                return b.completionCount - a.completionCount;
            }
            return a.habit.name.localeCompare(b.habit.name);
        });

    /* ------------------------------
       RENDER HABIT ROWS
    ------------------------------ */
    sortedHabits.forEach(({ habit, index: originalIndex }) => {

        const row = document.createElement("tr");

        /* Habit name + delete button */
        const habitCell = document.createElement("td");
        habitCell.classList.add("habit-col");
        const habitContainer = document.createElement("div");
        habitContainer.style.display = "flex";
        habitContainer.style.justifyContent = "space-between";
        habitContainer.style.alignItems = "center";

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

        /* Day cells - all appended to the SAME row */
        for (let day = 1; day <= daysInMonth; day++) {
            const cell = document.createElement("td");

            const key = `${currentYear}-${currentMonth}-${day}`;

            if (!habit.completed) habit.completed = {};
            if (!habit.notes || typeof habit.notes !== "object") {
                habit.notes = {};
            }

            const habitBtn = document.createElement("button");
            habitBtn.className = "habit-btn";
            habitBtn.addEventListener("click", (event) => {
                toggleHabit(originalIndex, key, habitBtn, memoBtn, event);
            });

            const memoBtn = document.createElement("button");
            memoBtn.className = "memo-btn";
            memoBtn.textContent = "memo";
            memoBtn.addEventListener("click", () => {
                openModal(originalIndex, key);
            });

            updateDayButtons(habitBtn, memoBtn, habit, key);

            cell.appendChild(habitBtn);
            cell.appendChild(memoBtn);
            row.appendChild(cell);
        }

        habitBody.appendChild(row);
    });
}

/* ---------------------------------------------------
   UPDATE BUTTON STATES
--------------------------------------------------- */

function updateDayButtons(habitBtn, memoBtn, habit, key) {
    const completed = habit.completed[key];
    const hasNote = habit.notes[key] && habit.notes[key].trim() !== "";

    habitBtn.style.background = completed ? "#003f7f" : "#000";
    memoBtn.style.background = hasNote ? "#003f7f" : "#000";
}

/* ---------------------------------------------------
   TOGGLE HABIT + CONFETTI
--------------------------------------------------- */

function toggleHabit(habitIndex, key, habitBtn, memoBtn, event) {
    const habit = habits[habitIndex];

    if (!habit.completed) habit.completed = {};

    if (habit.completed[key]) {
        delete habit.completed[key];
        playUncheck();
    } else {
        habit.completed[key] = true;
        playChime();
        burstConfetti(event);
    }

    updateDayButtons(habitBtn, memoBtn, habit, key);
    saveData();
}

/* ---------------------------------------------------
   MULTICOLOR CONFETTI
--------------------------------------------------- */

function burstConfetti(event) {
    const container = document.getElementById("confettiContainer");

    const rect = event.target.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;

    for (let i = 0; i < 80; i++) {
        const piece = document.createElement("div");
        piece.style.position = "fixed";
        piece.style.width = (4 + Math.random() * 4) + "px";
        piece.style.height = piece.style.width;
        piece.style.background = getRandomColor();
        piece.style.left = originX + "px";
        piece.style.top = originY + "px";
        piece.style.borderRadius = "2px";
        piece.style.pointerEvents = "none";
        piece.style.transform = `rotate(${Math.random() * 360}deg)`;

        container.appendChild(piece);

        const angle = Math.random() * 2 * Math.PI;
        const speed = 4 + Math.random() * 6;

        let vx = Math.cos(angle) * speed;
        let vy = Math.sin(angle) * speed;

        let opacity = 1;

        const interval = setInterval(() => {
            const x = parseFloat(piece.style.left);
            const y = parseFloat(piece.style.top);

            piece.style.left = x + vx + "px";
            piece.style.top = y + vy + "px";

            vy += 0.25;
            opacity -= 0.015;
            piece.style.opacity = opacity;

            if (opacity <= 0) {
                clearInterval(interval);
                piece.remove();
            }
        }, 16);
    }
}

function getRandomColor() {
    const colors = [
        "#ff0000", "#ff7f00", "#ffff00",
        "#00ff00", "#0000ff", "#4b0082",
        "#9400d3"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

/* ---------------------------------------------------
   SOUNDS
--------------------------------------------------- */

function playChime() {
    const sound = document.getElementById("chimeSound");
    sound.currentTime = 0;
    sound.play();
}

function playUncheck() {
    const sound = document.getElementById("uncheckSound");
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
    if (!saved) return;

    habits = JSON.parse(saved);

    habits.forEach((habit) => {
        if (!habit.completed || typeof habit.completed !== "object") {
            habit.completed = {};
        }
        if (!habit.notes || typeof habit.notes !== "object") {
            habit.notes = {};
        }
    });
}