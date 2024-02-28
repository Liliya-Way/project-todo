(function () {
    //создаем и возвращаем заголовок приложения
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
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

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        // <form class= "input-group mb-3">
        //     <input class="form-control" placeholder="Введите название нового дела"></input>
        //     <div class="input-group-append">
        //         <button class="btn btn-primary">Добавить дело</button>
        //     </div>
        // </form>

        return {
            form,
            input,
            button,
        }
    }

       //создаем и возвращаем список элементов
       function createTodoList () {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }   

    function createTodoItem(name) {
        let item = document.createElement('li');
        //кнопки помещаем в элемент, который красиво покажет их в одной группе
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');
   

    //устанавливаем стили для элемента списка, а также для размещения кнопок
    //в его правой части с помощью flex
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = name;

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    dondeButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    //вкладываем кнопки в отдельный элемент, чтобы они объедились в один блок
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    //приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия
    return {
        item,
        doneButton,
        deleteButton,
    };
};

    document.addEventListener('DOMContentLoaded', function() {
     let container = document.getElementById('todo-app');
     
     let todoAppTitle = createAppTitle('Список дел');
     let todoItemForm = createTodoItemForm();
     let todoList = createTodoList();
   
     container.append(todoAppTitle);
     container.append(todoItemForm.form);
     container.append(todoList);

     //бразер создает событие submit на форме по нажатию на Enter или на кнопку создания дела
     todoItemForm.form.addEventListener('submit', function(e) {
        //эта строчка необходима, чтобы предотвратить стандартное действие браузера
        //в данном случае мы не хотим, чтобы страница перезагружалась при отправке формы 
        e.preventDefault();
     })
    });

}) ();