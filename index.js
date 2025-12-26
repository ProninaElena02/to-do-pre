

const items = [
	"Сделать проектную работу",
	"Полить цветы",
	"Пройти туториал по Реакту",
	"Сделать фронт для своего проекта",
	"Прогуляться по улице в солнечный день",
	"Помыть посуду",
];

//				ГЛОБЛЬНЫЕ ПЕРЕМЕННЫЕ

// это список дел под основной секцией
const listElement = document.querySelector(".to-do__list");
// это форма
const formElement = document.querySelector(".to-do__form");
// а это внутри формы поле ввода
const inputElement = document.querySelector(".to-do__input");


//let нету, значит будет всё const  и это будет объект
const itemsState = {
	itemsNolet: []
};


// 			ФУНКЦИИ

// ЗАГРУЗКА
// это функция для загрузки дел на страницу
function loadTasks() {

	//должна проверять, есть ли в локальном хранилище уже сохранённые задачи.
	const savedTasks = localStorage.getItem('tasks');

	
	if (savedTasks) {// Если они есть — возвращать их
        return JSON.parse(savedTasks);//в объект делаем с JSON.parse
    }
	// в противном случае — возвращать список задач из массива items.
	else {
        return items;
    }
	// return items;//возвращаем список
}



//СОЗДАТЬ КЛОН ПО ШАБЛОНУ 
function createItem(item) {
	
	//РАБОТАЕМ С ТЕКСТОМ

	//шаблон нам нужен чтобы мы неоднократно работали с этим элементом, и клонирование его просто копирует для новых дел, 
	// инче мы бы просто перетащили целое одно дело в список
	const template = document.getElementById("to-do__item-template");//нашли отдельный элемент шаблон
	const clone = template.content.querySelector(".to-do__item").cloneNode(true);// создали клон, причём со всеми вложенными, это две разные ссылки
  	const textElement = clone.querySelector(".to-do__item-text");// загрузили текст

	//а это кнопочки
  	const deleteButton = clone.querySelector(".to-do__item-button_type_delete");
  	const duplicateButton = clone.querySelector(".to-do__item-button_type_duplicate");
  	const editButton = clone.querySelector(".to-do__item-button_type_edit");

	//СЛУШАТЕЛИ кнопочек
	
	//удаление
	deleteButton.addEventListener('click', function() {
        
        clone.remove();//удалить текущий элемент задачи, хранящийся в переменной clone, с помощью метода remove; 
		const items = getTasksFromDOM();//создать переменную items и присвоить ей результат выполнения функции getTasksFromDOM - ТО ЕСТЬ АКТУАЛЬНЫЕ ДЕЛА
        saveTasks(items);//если чтото делаем со списков - всегда обновляем хранилище !!!
    });

	//копирование
	duplicateButton.addEventListener('click', function() {
        const itemName = textElement.textContent;//текст текущей задачи то есть это <span> а из него взяли текст

		//вообще по видео задача должна просто копироваться и оригинальная задача оставаться, но это если оригинальная удаляется

		//clone.remove();

        const newItem = createItem(itemName);//результат выполнения рекурсии - шаблон из ХТМЛ, который мы и добавим в начало

        listElement.prepend(newItem);//добавить в начало

		const items = getTasksFromDOM();//также как и выше мы должны обновить актуальное хранилище
        saveTasks(items);
    });

	editButton.addEventListener('click', function() {
       	textElement.setAttribute('contenteditable', 'true');//это сделает элемент редактируемым для текста
        textElement.focus();//немедленно переводить на него фокус с помощью метода focus
    });

	textElement.addEventListener('blur', function() {
        textElement.setAttribute('contenteditable', 'false');//обратно на запрет редак.
        
        // и как обычно - получили текщий список и сохранили в хранилище
		const items = getTasksFromDOM();
        saveTasks(items);
    });
    

  	textElement.textContent = item;//текст задачи уже есть

	return clone;
}

// ПРЕОБРАЗОВАТЬ ЗАДАЧИ ИЗ ДОМ ДЕРЕВА В СПИСОК ТЕКСТА
function getTasksFromDOM() {
	// Найдите все элементы .to-do__item-text 
    const itemsNamesElements = listElement.querySelectorAll('.to-do__item-text');
    const tasks = [];//тут хранятся задачи текущие
    
    // собираем текст из всех и собираем масив дел
    itemsNamesElements.forEach(function(itemElement) {
        const taskText = itemElement.textContent;//собиреам текст
        tasks.push(taskText);
    });
    
    // и вернули текстовый массив, там лежат задачи ввиде текста
    return tasks;

}

//СОХРАНЕНИЕ В ХРАНИЛИЩЕ
//должна сохранять в локальное хранилище переданный в параметре массив строк задач
function saveTasks(tasks) {
	//оно так в видео
	localStorage.setItem('tasks', JSON.stringify(tasks));//перед сохранением массив необходимо преобразовать в строку с помощью метода JSON.stringify.
}

//ОБРАБОТКА СОБЫТИЯ , СЛУШАТЕЛЬ
//функция для обработчика слушателя, и тут всё по порядку с пункта "Создание и сохранение задач"
function writeTask(event) {
    
    event.preventDefault();//это чтобы не перезагружалось, то есть отменяем стандартное поведение евента в браузере, а этот евент он записывает у себя и у каждого евента свои поля и атрибуты
    
    
    const item = inputElement.value; // возьём текст из формы за счёт  .value, то есть значения, там у формы много всякого внутри другого ещё

    //и поле не пустое
    if (!item) {
        return; 
    }
    
    // также создаём задачку как загружали список внизу, но! задачка падает на начало списка а не в конец
    const taskElement = createItem(item);
    listElement.prepend(taskElement); 
    
	//соберём новые задачи кторые были кроме списк а существующщих, то есть элемент синхронизации ДОМ и переменной для загрузки
	//но а вообще кажется это более удобная загрузка
	itemsState.itemsNolet = getTasksFromDOM();//получили, оно вернётт их тексты
    saveTasks(itemsState.itemsNolet);//сохранили в локал хранилище
    
   
	inputElement.value = '';//очищаем пол
}

// 				ТУТ ЗАГРУЗКА задач со списка и от сюда начинаются вызовы функций

// мы в итемс будем загружать то что есть в списке пока но посути для этого наша форма есть
itemsState.itemsNolet = loadTasks();

// и каждую отображаем за счёт функции создания по шаблону

itemsState.itemsNolet.forEach(function(item) {
	// мы создали задание и положили во внутрь списка на странице. который в самой секции маин
    const taskElement = createItem(item);
	//кладём текст в функцию создания дела
    listElement.append(taskElement);
});

//			СЛУШАТЕЛЬ  - он должен быть после того как мы загрузили что-то
//тыкнули по кнопке значит появилось событие отправки формы
formElement.addEventListener('submit', writeTask);
