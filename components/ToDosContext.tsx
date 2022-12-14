import React, {
    createContext,
    Dispatch,
    useReducer
} from "react";
import { v4 } from "uuid";

export const TODO_ADD = "TODO_ADD";
export const TODO_REMOVE = "TODO_REMOVE";
export const TODO_EDIT = "TODO_EDIT";
export const TODO_TOGGLE = "TODO_TOGGLE";
import jsonTodos from "../todos.json";

export type ToDos = {
    items: ToDoItem[];
}

export type ToDoItem = {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    created_at: number;
    completed_at?: number;
    isNew?: boolean;
}

type action = ("TODO_ADD" | "TODO_REMOVE" | "TODO_EDIT" | "TODO_TOGGLE");

const reducer = (state: ToDos, action: { type: action, payload: any }) => {
    switch (action.type) {
        case TODO_ADD:
            const item: ToDoItem = {
                id: v4(),
                title: "New task",
                completed: false,
                created_at: Date.now(),
                isNew: true,
            }
            return { items: [...state.items, item] };
        case TODO_REMOVE:
            return { items: state.items.filter(item => item.id !== action.payload) };
        case TODO_EDIT:
            return {
                items: state.items
                    .map(item => {
                        if (item.id === action.payload.id) {
                            item.title = action.payload.title;
                        }
                        return item;
                    })
            };
        case TODO_TOGGLE:
            return {
                items: state.items
                    .map(item => {
                        if (item.id === action.payload.id) {
                            item.completed = action.payload.completed;
                            if (item.completed) {
                                item.completed_at = Date.now();
                            } else {
                                delete item.completed_at;
                            }
                        }
                        return item;
                    })
            };
        default:
            return state;
    }
}

type jsonTodo = {
    title: string,
    completed: boolean
}
const items: ToDoItem[] = jsonTodos
    .map((todo: jsonTodo) => (
        {
            ...todo,
            id: v4(),
            created_at: Date.now()
        })
    )

type Prop = {
    children: React.ReactNode;
}

const ToDosContext = createContext<{
    todos: ToDos,
    todosDispatch: Dispatch<any>,
}>({
    todos: { items },
    todosDispatch: () => { },
});

export const ToDosProvider = (prop: Prop) => {
    const [todos, todosDispatch] = useReducer(reducer, { items });

    return (
        <ToDosContext.Provider value={{ todos, todosDispatch }}>
            {prop.children}
        </ToDosContext.Provider>
    )
}

export default ToDosContext;