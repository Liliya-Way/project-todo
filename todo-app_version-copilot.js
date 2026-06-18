(function () { 
    // ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ МОДУЛЯ
    let listArray = []; 
    let listName = ''; 

    // ФАБРИКИ DOM-ЭЛЕМЕНТОВ. VIEW
    function createAppTitle(title) { // Компонент заголовка 
        const appTitle = document.createElement('h2');
        appTitle.textContent = title; //СЕТТЕР
        return appTitle; 
    }

    function createTodoItemForm (){ // Компонент формы. VIEW. ВХОД (никаких параметров)
        const form = document.createElement('form');
        const input = document.createElement('input');
        const buttonWrapper = document.createElement('div');
        const button = document.createElement('button');

        // классы
        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');

        // атрибуты
        input.placeholder = 'Введите название нового дела';
        button.textContent = 'Добавить дело';
        button.disabled = true;

        input.addEventListener('input', function(){ 
            if(input.value !== ""){ 
                button.disabled = false; 
            }else{ 
                button.disabled = true; 
            }
        });

        buttonWrapper.append(button); 
        form.append(input); 
        form.append(buttonWrapper); 

        return { // Контракт формы: она возвращает { form, input, button } ВЫХОД (возвращает объект)
            form,
            input,
            button,
        }
    }

       function createTodoList () { // Компонент списка. VIEW
        const list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    } 

    function createTodoItem(obj, {onDone, onDelete}){ // Компонент элемента списка. VIEW ВХОД(объект задачи, объект обработчиков)
    // Контракт = интерфейс взаимодействия 
    // Компонент: “Я принимаю такие параметры, возвращаю такие данные, и больше ничего”.
    // Объект разбирается → в параметрах функции. Это деструктуризация параметров. 
    // Деструктурировать, т. е. "разобрать". Возьми второй аргумент (объект) и достань из него свойства onDone и onDelete
    // Деструктуризация происходит в момент приёма
        // Это объектный анонимный литерал. Он создаётся в этот момент, передаётся в функцию, и всё — он существует. Ты создаёшь объект без имени, прямо в аргументах.
        // createTodoItem(obj, {
        //onDone: handleDone,
        //onDelete: handleDelete});
        const item = document.createElement('li'); 
        const span = document.createElement('span');
        const buttonGroup = document.createElement('div');
        const doneButton = document.createElement('button');
        const deleteButton = document.createElement('button');

    // классы
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    deleteButton.classList.add('btn', 'btn-danger');

    // текст
    span.textContent = obj.name; 
    doneButton.textContent = 'Готово';
    deleteButton.textContent = 'Удалить';

    // data-атрибуты,dataset
    item.dataset.id = obj.id; // добавляем в элемент атрибут data-id, чтобы связать DOM-элемент с объектом по его id и упростить отладку
    doneButton.dataset.action = 'done'; // data‑атрибуты
    deleteButton.dataset.action = 'delete'; // data‑атрибуты

   // визуальное состояние
    if(obj.done == true){ 
        item.classList.add('list-group-item-success');
    }

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(span);
    item.append(buttonGroup);

    return { // ВЫХОД(DOM-элемент <li>)
        item, 
    };  
};

    // ЛОГИКА ДАННЫХ. Компонент данных. MODEL
function handleDone(obj){ // функция, которая обрабатывает нажатие кнопки "Готово" для конкретного дела. Обработать действие “сделано”. ВХОД(объект задачи)
        const item = listArray.find(function(i){ // ищем в массиве listArray объект i, у которого id совпадает с id переданного obj
            return i.id === obj.id; // условие поиска: возвращаем true, если id совпадают → find вернёт этот объект. ВЫХОД №1(найденный объект)
        });
        item.done = !item.done; // переключаем флаг done: если было true → станет false, если false → станет true. ВЫХОД №2(обновлённые данные)
        saveList(listArray, listName); // сохраняем обновлённый массив listArray в localStorage под именем listName. ВЫХОД №3(сохранённый список)
    }

function handleDelete(obj){ // функция-обработчик удаления задачи; получает объект задачи obj. ВХОД(объект задачи) 
        const index = listArray.findIndex(function(i){ // ищем индекс элемента массива listArray, у которого id совпадает с obj.id
            return i.id === obj.id; // условие поиска: вернуть true, если id объекта i равен id удаляемого obj. ВЫХОД №1(найденный индекс элемента массива)
        });
        if(index !== -1){ //если индекс найден 
        listArray.splice(index, 1); // удаляем из массива 1 элемент, начиная с позиции index (то есть саму задачу). ВЫХОД №2(обновлённые данные)
        saveList(listArray, listName);  // сохраняем обновлённый массив listArray в localStorage под именем listNameю. ВЫХОД №3(сохранённый список)
        }
        
    }

function getNewID(arr){ // MODEL ВХОД(массив данных)
    let max = 0;
    for(let item of arr){ 
        if(item.id > max){
            max = item.id;
        }
    }
    return max + 1; //ВЫХОД(новый ID)
}

function saveList(arr, keyName){ // MODEL ВХОД(массив данных, ключ localStorage)
localStorage.setItem(keyName, JSON.stringify(arr));
} //ВЫХОД(сохранённый список)

  // ГЛАВНАЯ ФУНКЦИЯ ПРИЛОЖЕНИЯ. Компонент приложения
function createTodoApp(container, title = 'Список дел', keyName, defArray = []) { // ВХОДЫ(контейнер, название списка, ключ localStorage, дефолтный массив) CONTROLLER, управляет потоком: 
// слушает события, определяет action, находит объект, вызывает Model, обновляет View, делегирование
// Controller — это «мозг», который связывает Model и View.

    const todoAppTitle = createAppTitle(title);
    const todoItemForm = createTodoItemForm();
    const todoList = createTodoList();
  
    // ВЫХОД №1 (созданный UI (выход View))
    container.append(todoAppTitle); // ВЫХОД(созданный UI)
    container.append(todoItemForm.form); // ВЫХОД(созданный UI)
    container.append(todoList); // ВЫХОД(созданный UI)

    // ВЫХОД №2 (инициализированная Model(выход Model))
    listName = keyName; 
    listArray = [...defArray]; // потому что это создаёт НОВЫЙ массив, а не копирует ссылку.
    // оператор spread. Это создание нового массива, в который раскладываются элементы старого. 

    // ВЫХОД №3 (установленное делегирование событий(выход Controller))
    // ⬇️ 1. Вешаем делегирование
    todoList.addEventListener('click', function(event){ // ВЫХОД(подключено делегирование)
     const action = event.target.dataset.action; 
     // Берёт объект события event
     // Из него достаёт элемент, по которому кликнули → event.target. event.target → где произошёл клик. event.target → <button>
     // Из этого элемента читает data-action → dataset.action
     // Сохраняет значение в переменную action, т. е. клик по кнопке «Готово» → action = "done", клик по кнопке «Удалить» → action = "delete"
     // «Посмотри, по какому элементу кликнули, и возьми из него значение data-action».
     if(!action) return;
     // если у элемента, по которому кликнули, НЕТ data-action — значит это не кнопка "Готово" и не "Удалить"
     // прекращаем выполнение обработчика, чтобы не тратить ресурсы
     const li = event.target.closest('li');
     // closest поднимается вверх по DOM от event.target (кнопки)
    // и ищет ближайший родительский <li>, которому принадлежит эта кнопка
    // таким образом мы находим DOM-элемент задачи, внутри которого была нажата кнопка
     const id = li.dataset.id;
     // читаем значение data-id из найденного <li>
    // dataset — объект, содержащий все data-* атрибуты элемента
    // таким образом получаем id задачи, к которой относится клик
     const obj = listArray.find(function(item){ // ищем в массиве listArray объект задачи, чей id совпадает с id из DOM
        return item.id == id; // сравниваем id объекта из массива и id, полученный из data-id
     }); // после этого obj — это JS-объект задачи, с которым нужно работать
     
     if(action === 'done'){ // если нажата кнопка с data-action="done"
        handleDone(obj); // вызываем обработчик, который переключает флаг done в данных!!!
        li.classList.toggle('list-group-item-success'); // визуально переключаем зелёный фон у <li>
     }
     if(action === 'delete'){ // если нажата кнопка с data-action="delete"
        if(confirm('Вы уверены?')) {  // спрашиваем подтверждение у пользователя
           handleDelete(obj); // удаляем задачу из массива данных и сохраняем изменения!!!
           li.remove(); // удаляем DOM-элемент <li> из списка
        }
     }
    })

     // ВЫХОД №4 (восстановленный список из localStorage)
     // ⬇️ 2. Загрузка из localStorage
    let localData = localStorage.getItem(listName);
    if(localData){ // Если значение truthy, выполнить код. Если в localStorage действительно есть строка с данными — распарси её
        listArray = JSON.parse(localData);  // ВЫХОД(восстановленные данные)
    }
    
    // ⬇️ 3. Восстановление списка/рендерим существующие элементы
    // Первый вызов — восстановление списка из Model (рендер существующих данных)
    for(const itemList of listArray){ // используем const, потому что itemList не переназначается.
        const todoItem = createTodoItem(itemList, { // объект создаётся → в вызове
        //  потому что объектный литерал — это идеальный способ передать КОНТРАКТ поведения компоненту.
        // Объектный литерал используется, чтобы передать компоненту TodoItem набор зависимостей (поведение), а не просто данные.
        // Это делает компонент независимым, расширяемым и архитектурно чистым.
        // передаём не просто функции, а именованные зависимости:
            onDone: handleDone, // Передача поведения по имени
            onDelete: handleDelete
        }); 

        // ВЫХОД №5 (отрендеренные элементы списка)
        todoList.append(todoItem.item); // ВЫХОД(отрендеренный, отрисованный элемент)
    }

    // ВЫХОД №6 (подключённый обработчик submit)
    // ⬇️ 4. Добавление новой задачи. Обработчик формы
    todoItemForm.form.addEventListener('submit', function(e) { // ВЫХОД(подключён обработчик формы)
       e.preventDefault();

       if (!todoItemForm.input.value) { 
           return; 
       }

        const newItem = { 
        id: getNewID(listArray), 
        name: todoItemForm.input.value, 
        done: false 
      }

       // Второй вызов — создание нового элемента (рендер нового объекта Model)
       // первый вызов — для восстановления существующих элементов списка, второй — для создания нового элемента.
       const todoItem = createTodoItem(newItem, { // объект создаётся → в вызове. Объектный анонимный литерал. Он анонимный, потому что: 
       // у него нет переменной, он создаётся прямо в аргументах, он сразу передаётся в функцию
       // это самый правильный способ передать набор параметров (настройки, обработчики, зависимости) в функцию. 
       // Объектный анонимный литерал - это как «одноразовый контейнер с настройками».
       // «Создай элемент задачи и вот тебе набор функций, которые он должен использовать».
       // То есть ты передаёшь поведение, а не просто данные.
        onDone: handleDone, 
        onDelete: handleDelete
    }); 

       listArray.push(newItem);
       saveList(listArray, listName);
       todoList.append(todoItem.item);

       todoItemForm.button.disabled = true;
       todoItemForm.input.value = '';

    });

};

window.createTodoApp = createTodoApp;
}) (); 