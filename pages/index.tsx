import Head from 'next/head'
import Image from 'next/image'
import Logo from "../public/logo.svg";
import styles from '../styles/Home.module.css'
import React, { useState, useEffect, useContext, useMemo } from 'react'
import ToDosContext, {
	ToDoItem,
	ToDosProvider,
	TODO_ADD,
	TODO_EDIT,
	TODO_REMOVE,
	TODO_TOGGLE
} from '../components/ToDosContext'

export default function Home() {
	return (
		<ToDosProvider>
			<div className="main">
				<Image
					alt='logo'
					src="/vercel.svg"
					height={24}
					width={96}
				/>
				<ToDosContainer />
				<Navigation />
			</div>
		</ToDosProvider>
	)
}

const ToDosContainer = () => {
	const { todos } = useContext(ToDosContext);
	const imcompleteItems = todos.items
		.filter(item => !item.completed)
		.sort((a, b) => b.created_at - a.created_at);
	const completeItems = todos.items
		.filter(item => item.completed)
		.sort((a, b) => b.completed_at! - a.completed_at!);

	return (
		<ul className="todo-list">
			{
				[...imcompleteItems, ...completeItems]
					.map((todo, index) => (
						<Item
							key={todo.id}
							item={todo}
							pxTop={index * 76}
							editing={todo.isNew || false}
						>
						</Item>
					))
			}
		</ul>
	)
}

type Prop = {
	item: ToDoItem;
	pxTop: number;
	editing: boolean;
	children?: React.ReactNode;
}

const Item = (prop: Prop) => {
	const [editing, setEditing] = useState(prop.editing || false);
	const editInput = React.createRef<HTMLInputElement>();
	const { todosDispatch } = useContext(ToDosContext);

	const getEditInput = useMemo(() => editInput, [editing]);

	useEffect(() => {
		if (getEditInput.current) {
			const { current } = getEditInput;
			current.focus();
			current.selectionStart = current.selectionEnd = current.value.length;
		}
	}, [getEditInput]);

	const changeCompleted = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { checked } = e.target as HTMLInputElement;
		todosDispatch({
			type: TODO_TOGGLE,
			payload: {
				id: prop.item.id,
				completed: checked
			}
		});
	}

	const changeEditing = (e: React.MouseEvent<HTMLLabelElement>) => {
		setEditing(() => !editing);
	}

	const keyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		switch (e.keyCode) {
			case 13: // Enter
				todosDispatch({
					type: TODO_EDIT,
					payload: {
						id: prop.item.id,
						title: e.currentTarget.value
					}
				});
				setEditing(false);
				break;
			case 27: // Esc
				setEditing(false);
				break;
		}
	}

	return (
		<li
			className={`${prop.item.completed ? "complete" : ""} ${editing ? "editing" : ""}`}
			style={{ top: `${prop.pxTop}px` }}
		>
			<div className="view">
				<input
					type="checkbox"
					className="toggle"
					defaultChecked={prop.item.completed}
					onChange={changeCompleted}
				/>
				<label onDoubleClick={changeEditing}>{prop.item.title}</label>
				<button
					className="destroy"
					onClick={() => {
						todosDispatch({ type: TODO_REMOVE, payload: prop.item.id });
					}}
				>
				</button>
			</div>

			{
				editing ? (
					<input
						className='edit'
						ref={editInput}
						defaultValue={prop.item.title}
						onBlur={() => { changeEditing }}
						onKeyDown={keyDown}
					/>
				) : <></>
			}
		</li >
	)
}

const Navigation = () => {
	const { todosDispatch } = useContext(ToDosContext);
	return (
		<div className="navigation">
			<button
				onClick={() => todosDispatch({ type: TODO_ADD })}
			>
				Add New Task
			</button>
		</div>
	)
}