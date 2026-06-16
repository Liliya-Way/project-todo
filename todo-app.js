(function () { // Самовызывающаяся функция (IIFE), чтобы изолировать переменные и не засорять глобальную область
    let listArray = []; // Массив для хранения списка дел 
    //создаем и возвращаем заголовок приложения
    let listName = ''; // имя keyName делаем глобальным, чтобы оно было доступно всей программе
    function createAppTitle(title) { // Функция принимает текст заголовка (Мои дела)
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title; // Записываем в него текст?????????????
        return appTitle; // Возвращаем готовый элемент
    }

    //создаем и возвращаем форму для создания дела
    function createTodoItemForm (){
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело';
        button.disabled = true;
        // Событие: при вводе текста включаем/выключаем кнопку
        input.addEventListener('input', function(){ // Слушаем событие ввода текста в поле
            if(input.value !== ""){ // Если поле НЕ пустое
                button.disabled = false; // Включаем кнопку
            }else{ // Иначе
                button.disabled = true; // Отключаем кнопку
            }
        });

        buttonWrapper.append(button); // Вставляем кнопку внутрь обёртки
        form.append(input); // Добавляем поле ввода в форму
        form.append(buttonWrapper); // Добавляем обёртку с кнопкой в форму
        // console.dir(createTodoItemForm);

        return { // Возвращаем объект с элементами формы
            form,     
            input,
            button,
        }
    }

    // console.dir(createTodoItemForm());

       //создаем и возвращаем список элементов
       function createTodoList () {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }   

    function createTodoItem(obj) { // Функция принимает объект obj — данные одного дела. Функция принимает объект {id, name, done}.
        let item = document.createElement('li'); // Создаём элемент <li> — это один пункт списка
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

    //устанавливаем стили для элемента списка, а также для размещения кнопок
    //в его правой части с помощью flex
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = obj.name; // Устанавливаем текст элемента списка = названию дела

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    if(obj.done == true){ // Если дело выполнено — подсвечиваем зелёным. 
    // При создании <li> нужно установить правильный начальный вид - это “инициализация состояния”. Нужен только при ЗАГРУЗКЕ списка.   
        item.classList.add('list-group-item-success');
    }

    //добавляем обработчики на кнопки
      doneButton.addEventListener('click', function() {  // Вешаем обработчик клика на кнопку "Готово"
           item.classList.toggle('list-group-item-success'); // Переключаем зелёный фон у <li>: если класс есть — убираем, если нет — добавляем. 
           // “переключение состояния”. toggle работает только при КЛИКЕ. Но toggle не знает, какое состояние было в localStorage.
        // let currentName = item.firstChild.textContent;
           console.log(obj.id);  // Выводим в консоль id текущего дела (для отладки)
           for(let listItem of listArray){  // Перебираем каждый объект в массиве listArray
            if(listItem.id == obj.id){ // Проверяем: id объекта в массиве совпадает с id текущего дела?
                listItem.done = !listItem.done; // Инвертируем флаг done: true → false, false → true
                // Это переключает состояние задачи в данных
            }
           }
             saveList(listArray, listName);
       });
       deleteButton.addEventListener('click', function () {
           if (confirm('Вы уверены?')) {
             item.remove(); //Это удаляет только визуальное представление (DOM), но не данные в массиве.
            // let currentName = item.firstChild.textContent;
           for(let i = 0; i < listArray.length; i++){ //Запускается обычный for по индексу i от 0 до listArray.length - 1.
           // Почему по индексу, а не for...of/ Потому что дальше используем splice, а ему нужен индекс.
            if(listArray[i].id == obj.id){ //На каждой итерации i — это индекс текущего элемента в массиве listArray. 
            // obj.id — id того дела, для которого сейчас создаётся DOM‑элемент и обработчики
            // «Это тот самый объект, который соответствует удаляемому элементу?» Если id совпадают — значит, мы нашли в массиве данные именно этого дела.
                listArray.splice(i, 1); //«Удалить из массива один элемент, начиная с позиции i».
                //Мы будем искать в массиве тот объект, который соответствует удаляемому делу. 
                //Это синхронизация: «Если дело исчезло с экрана, оно должно исчезнуть и из данных».
            }
           }
           saveList(listArray, listName);
           }
       });

    //вкладываем кнопки в отдельный элемент, чтобы они объединились в один блок
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    //приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия
    // Возвращаем объект с элементами дела
    return {
        item, // Сам элемент <li>
        doneButton, // Кнопка "Готово"
        deleteButton, // Кнопка "Удалить"
    };  
};

function getNewID(arr){ // Объявляем функцию, которая принимает массив объектов дел (arr)
    let max = 0;
    // Создаём переменную max и ставим её равной 0.
    // В max мы будем хранить самый большой id, который найдём в массиве.
    for(let item of arr){ // Перебираем каждый объект (item) внутри массива arr
        if(item.id > max){ // Проверяем: id текущего объекта больше, чем то, что сейчас лежит в max?
            max = item.id;
            // Если да — обновляем max, записывая туда этот id.
            // Так мы постепенно найдём самый большой id в массиве.
        }
    }
    return max + 1;
    // Возвращаем новый id: самый большой найденный + 1.
    // Это гарантирует, что новый id будет уникальным.
}

function saveList(arr, keyName){
    // Объявляем функцию saveList, которая принимает:
    // arr — массив дел, который нужно сохранить
    // keyName — строка‑ключ, под которым данные будут храниться в localStorage
localStorage.setItem(keyName, JSON.stringify(arr));
    // Сохраняем массив arr в localStorage.
    // JSON.stringify(arr) превращает массив объектов в строку,
    // потому что localStorage может хранить ТОЛЬКО строки.
}

function createTodoApp(container, title = 'Список дел', keyName, defArray = []) { // Главная функция приложения

    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    listName = keyName; // имя keyName делаем глобальным, чтобы оно было доступно всей программе
    listArray = defArray;
  
    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    let localData = localStorage.getItem(listName);
    // Пытаемся получить данные из localStorage по ключу listName
    // Если данных нет — вернётся null

    if(localData !== null && localData !== ''){  // Проверяем: если данные существуют и строка не пустая…
        listArray = JSON.parse(localData);  
        // Преобразуем JSON‑строку обратно в массив объектов
        // Теперь listArray содержит сохранённые дела
    }
    for(let itemList of listArray){ // ЦИКЛ: восстановление старых дел. Перебираем каждый объект дела, который загрузили из localStorage или defArray. 
    // Цикл нужен, чтобы восстановить ВСЕ дела, которые уже были сохранены в localStorage. Без цикла создадим только ОДНО дело — пустое и неправильное.
        let todoItem = createTodoItem(itemList); // Создаём DOM‑элемент <li> для каждого дела
        todoList.append(todoItem.item); // Добавляем <li> в список на страницу
    }
    
    //браузер создает событие submit на форме по нажатию на Enter или на кнопку создания дела
    // Обработчик события submit на форме
    todoItemForm.form.addEventListener('submit', function(e) {
       //эта строчка необходима, чтобы предотвратить стандартное действие браузера
       //в данном случае мы не хотим, чтобы страница перезагружалась при отправке формы 
       e.preventDefault();

       //игнорируем создание  элемента, если пользователь ничего не ввел в поле
       if (!todoItemForm.input.value) { // Проверяем: если поле ввода пустое (пустая строка)
           return; // Прерываем обработчик, не создаём новое дело
       }

       let newItem = { // Создаём объект нового дела — это "данные" задачи
        id: getNewID(listArray), // добавляем id, чтобы можно было удалять дела с одинаковым названием
        name: todoItemForm.input.value, // Свойство name: берём текст, который пользователь ввёл в поле input. НАзвание дел может совпадать
        done: false // Свойство done: флаг выполнения, по умолчанию false (дело ещё не выполнено)
      }

       let todoItem = createTodoItem (newItem); // SUBMIT: создание нового дела. Передаём объект newItem в функцию createTodoItem, создаём DOM-элемент дела (li + кнопки)


    //    listArray.push(newItem);
    //    console.log(listArray);

       listArray.push(newItem);
       saveList(listArray, listName);
    //    console.log(listArray);

       //создаем и добавляем в список новое дело с названием из поля для ввода
       todoList.append(todoItem.item);

       todoItemForm.button.disabled = true;

       //обнуляем значение в поле, чтобы не пришлось стирать его вручную
       todoItemForm.input.value = '';

    });


};

window.createTodoApp = createTodoApp;

}) (); // Закрываем самовызывающуюся функцию