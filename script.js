const rows = 20, cols = 10; // Default spreadsheet size
const spreadsheet = document.getElementById("spreadsheet");

document.addEventListener("DOMContentLoaded", function() {
    createSpreadsheet(rows, cols);
    loadData();
});

// Function to create spreadsheet grid
function createSpreadsheet(rows, cols) {
    spreadsheet.innerHTML = "";
    for (let i = 0; i < rows; i++) {
        let row = spreadsheet.insertRow();
        for (let j = 0; j < cols; j++) {
            let cell = row.insertCell();
            let input = document.createElement("input");
            input.setAttribute("data-row", i);
            input.setAttribute("data-col", j);
            input.addEventListener("input", evaluateFormula);
            input.addEventListener("blur", saveData);
            cell.appendChild(input);
        }
    }
}

// Function to evaluate cell formulas
function evaluateFormula(event) {
    let input = event.target;
    let value = input.value;

    if (value.startsWith("=")) {
        try {
            let formula = value.substring(1).toUpperCase(); // Remove "="
            formula = formula.replace(/([A-Z]+)(\d+)/g, function(match, col, row) {
                let colIndex = col.charCodeAt(0) - 65; // Convert A->0, B->1, etc.
                let rowIndex = parseInt(row) - 1;
                let cell = document.querySelector(`[data-row='${rowIndex}'][data-col='${colIndex}']`);
                return cell ? cell.value || "0" : "0";
            });

            input.value = eval(formula);
        } catch (e) {
            input.value = "ERROR";
        }
    }
}

// Add Row
function addRow() {
    let row = spreadsheet.insertRow();
    for (let i = 0; i < spreadsheet.rows[0].cells.length; i++) {
        let cell = row.insertCell();
        let input = document.createElement("input");
        input.addEventListener("input", evaluateFormula);
        input.addEventListener("blur", saveData);
        cell.appendChild(input);
    }
}

// Add Column
function addColumn() {
    for (let row of spreadsheet.rows) {
        let cell = row.insertCell();
        let input = document.createElement("input");
        input.addEventListener("input", evaluateFormula);
        input.addEventListener("blur", saveData);
        cell.appendChild(input);
    }
}

// Delete Row
function deleteRow() {
    if (spreadsheet.rows.length > 1) {
        spreadsheet.deleteRow(-1);
    }
}

// Delete Column
function deleteColumn() {
    let rowCount = spreadsheet.rows.length;
    let colCount = spreadsheet.rows[0].cells.length;
    if (colCount > 1) {
        for (let row of spreadsheet.rows) {
            row.deleteCell(-1);
        }
    }
}

// Save data to local storage
function saveData() {
    let data = [];
    for (let row of spreadsheet.rows) {
        let rowData = [];
        for (let cell of row.cells) {
            rowData.push(cell.firstChild.value);
        }
        data.push(rowData);
    }
    localStorage.setItem("spreadsheetData", JSON.stringify(data));
}

// Load data from local storage
function loadData() {
    let data = JSON.parse(localStorage.getItem("spreadsheetData"));
    if (data) {
        createSpreadsheet(data.length, data[0].length);
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
                spreadsheet.rows[i].cells[j].firstChild.value = data[i][j];
            }
        }
    }
}

// Export to CSV
function exportToCSV() {
    let csvContent = "";
    for (let row of spreadsheet.rows) {
        let rowData = [];
        for (let cell of row.cells) {
            rowData.push(cell.firstChild.value);
        }
        csvContent += rowData.join(",") + "\n";
    }
    let blob = new Blob([csvContent], { type: "text/csv" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "spreadsheet.csv";
    link.click();
}

// Import CSV
function importFromCSV() {
    let file = document.getElementById("importFile").files[0];
    if (!file) return;
    let reader = new FileReader();
    reader.onload = function(event) {
        let rows = event.target.result.split("\n").map(row => row.split(","));
        localStorage.setItem("spreadsheetData", JSON.stringify(rows));
        loadData();
    };
    reader.readAsText(file);
}
