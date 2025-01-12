let tiles = [];                 // Массив для хранения костяшек
let freeCell = { y: 3, x: 3 };  // Координаты свободной ячейки
let shuffled = false;           // Флаг, указывающий, завершено ли перемешивание

// Создает пустую ячейку
function createCellNull() {
    let cell = document.createElement("div");
    cell.classList.add("field__cell", "field__cell--null");
    return cell;
}

// Устанавливает смещение ячейки на игровом поле
/* Добавление строки "px" необходимо для формирования
   корректных значений свойств CSS. */
function setCellOffset(cell) {
    cell.style.left = (15 + (15 + 81.25) * cell.x) + "px";
    cell.style.top = (15 + (15 + 81.25) * cell.y) + "px";
}

// Добавляет ячейку на игровое поле
function appendCell(cell) {
    let field = document.getElementById("field");
    field.appendChild(cell);
}

// Создает пустое игровое поле (4x4)
function createField() {
    for (let y = 0; y < 4; ++y) {
        for (let x = 0; x < 4; ++x) {
            let cell = createCellNull(); // Создаем пустую ячейку
            cell.y = y;                  // Устанавливаем координату y
            cell.x = x;                  // Устанавливаем координату x
            setCellOffset(cell);         // Задаем смещение
            appendCell(cell);            // Добавляем ячейку на поле
        }
    }
}

// Создает игровую костяшку
function createCellTile() {
    let cell = document.createElement("div");
    cell.classList.add("field__cell", "field__cell--tile");
    return cell;
}

// Создает все костяшки (числа от 1 до 15)
function createTiles() {
    for (let y = 0; y < 4; ++y) {
        for (let x = 0; x < 4; ++x) {
            let n = y * 4 + x + 1; // Вычисляем номер костяшки
            /* Всего костяшек должно быть 15. */
            if (n < 16) {
                let cell = createCellTile(); // Создаем костяшку
                cell.y = y;                  // Устанавливаем координату y
                cell.x = x;                  // Устанавливаем координату x
                cell.innerHTML = n;          // Присваиваем номер костяшке
                setCellOffset(cell);         // Задаем смещение
                appendCell(cell);            // Добавляем костяшку на поле
                tiles.push(cell);            // Добавляем костяшку в массив
            }
        }
    }
}

// Проверяет, находится ли значение t между a и b
function between(a, b, t) {
    return (a <= t && t <= b) || (b <= t && t <= a);
}

// Проверяет, собрана ли головоломка
function checkVictory() {
    for (let i = 0; i < tiles.length; ++i) {
        let n = tiles[i].y * 4 + tiles[i].x + 1; // Правильный номер позиции
        /* Нестрогое сравнение, так как innerHTML -- строка. */
        if (tiles[i].innerHTML != n) return;    // Если костяшка не на месте, выход
    }
    document.getElementById("modal").classList.add("modal--visible"); // Показываем модальное окно при победе
}

// Обработчик клика по костяшке
function tileClick(event) {
    let bar = event.target; // Нажатая костяшка
    /* Запоминаем старые координаты нажатой ячейки. */
    let oldX = bar.x, oldY = bar.y;
    if (bar.y === freeCell.y) { // Если костяшка находится в одной строке со свободной ячейкой
        for (let i = 0; i < tiles.length; ++i) {
            let tile = tiles[i];
            if (tile.y === bar.y && between(bar.x, freeCell.x, tile.x)) {
                if (bar.x < freeCell.x) tile.x += 1;
                else tile.x -= 1;
                setCellOffset(tile);
            }
        }
        freeCell = { y: oldY, x: oldX }; // Обновляем координаты свободной ячейки

    } else if (bar.x === freeCell.x) { // Если костяшка находится в одном столбце со свободной ячейкой
        for (let i = 0; i < tiles.length; ++i) {
            let tile = tiles[i];
            if (tile.x === bar.x && between(bar.y, freeCell.y, tile.y)) {
                if (bar.y < freeCell.y) tile.y += 1;
                else tile.y -= 1;
                setCellOffset(tile);
            }
        }
        freeCell = { y: oldY, x: oldX }; // Обновляем координаты свободной ячейки
    }
    /* Если мы не в стадии перемешивания,
    проверяем, собрана ли головоломка. */
    if (shuffled) {
        checkVictory(); // Проверяем победу
    }
}

// Привязывает обработчик клика к каждой костяшке
function animateTiles() {
    for (let i = 0; i < tiles.length; ++i) {
        tiles[i].addEventListener("click", tileClick);
    }
}

// Перемешивает костяшки случайным образом
function shuffleTiles() {
    for (let i = 0; i < 1000; ++i) {
        let index = Math.floor(Math.random() * tiles.length); // Случайный индекс
        tiles[index].click();                                 // Симулируем клик
    }
    shuffled = true; // Устанавливаем флаг перемешивания
}

// Инициализация игры
createField(); // Создаем игровое поле
createTiles(); // Создаем костяшки
animateTiles(); // Активируем взаимодействие
shuffleTiles(); // Перемешиваем костяшки