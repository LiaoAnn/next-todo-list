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

const items: ToDoItem[] = [
    {
        id: v4(),
        completed: true,
        title: "1. Learn Qwik",
        created_at: Date.now(),
        completed_at: Date.now()
    }, {
        id: v4(),
        completed: true,
        title: "2. Learn Next.js",
        created_at: Date.now()
    }, {
        id: v4(),
        completed: true,
        title: "3. Finish ToDo App with Qwik",
        created_at: Date.now(),
        completed_at: Date.now()
    }, {
        id: v4(),
        completed: true,
        title: "4. Finish ToDo App with Next.js",
        created_at: Date.now()
    }, {
        id: v4(),
        completed: false,
        title: "5. Compare ToDo App with Qwik and Next.js",
        created_at: Date.now()
    }, {
        id: v4(),
        completed: false,
        title: "6. Write a blog post about it",
        created_at: Date.now(),
        completed_at: Date.now()
    }, {
        id: v4(),
        completed: false,
        title: "7. Get A+ on the 資工導論🥲",
        created_at: Date.now()
    }
]

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