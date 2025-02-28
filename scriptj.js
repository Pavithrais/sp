document.addEventListener("input", function (event) {
    if (event.target.classList.contains("cell")) {
        calculateFormula(event.target);
    }
});

function calculateFormula(cell) {
    let value = cell.innerText.trim();
    if (value.startsWith("=")) {
        let formula = value.substring(1).toUpperCase();
        if (formula.startsWith("SUM(") && formula.endsWith(")")) {
            let range = formula.substring(4, formula.length - 1);
            let [start, end] = range.split(":");
            let sum = 0;
            let startCell = document.getElementById(start);
            let endCell = document.getElementById(end);
            if (startCell && endCell) {
                let startRow = parseInt(startCell.dataset.row);
                let endRow = parseInt(endCell.dataset.row);
                let col = startCell.dataset.col;
                for (let i = startRow; i <= endRow; i++) {
                    let cell = document.getElementById(col + i);
                    if (cell) sum += parseFloat(cell.innerText) || 0;
                }
            }
            cell.innerText = sum;
        }
    }
}
