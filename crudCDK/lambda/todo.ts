import createTodo from './createTodo';
import deleteTodo from './deleteTodo';
import updateTodo from './updateTodo';
import todoById from "./todoById";
import getTodos from "./getTodos";
import Todo from "./type";

type AppSyncEvent = {
    info: {
        fieldName: string
    }
    arguments : {
        id: string
        todo: Todo
    }
}

exports.handler = async (event: AppSyncEvent) => {
    switch(event.info.fieldName){
        case "todos":
            return await getTodos();
        case "todoByID":
            return await todoById(event.arguments.id);
        case "createTodo":
            return await createTodo(event.arguments.todo);
        case "updateTodo":
            return await updateTodo(event.arguments.todo);
        case "deleteTodo":
            return await deleteTodo(event.arguments.id);
        default:
            return null
    }
}
