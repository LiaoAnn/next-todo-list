import {
	BiEdit,
	BiTrash
} from "react-icons/bi"
import Image from 'next/image'
import React, {
	useState,
	useEffect,
	useContext,
	useMemo
} from 'react'
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
					height={64}
					width={96}
					style={{ margin: ".5em 0" }}
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
							pxTop={index * 54}
							item={todo}
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
	editing: boolean;
	pxTop: number;
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

		setTimeout(() => {
			todosDispatch({
				type: TODO_TOGGLE,
				payload: {
					id: prop.item.id,
					completed: checked
				}
			});
		}, 300)
	}

	const changeEditing = () => {
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

	const className = [prop.item.completed ? 'completed' : '', editing ? 'editing' : '']
		.filter(x => x)
		.join(' ');

	return (
		<li
			className={`${className}`}
			style={{ top: `${prop.pxTop}px` }}
		>
			<div className="view">
				{
					editing ?
						<input
							className='edit'
							ref={editInput}
							defaultValue={prop.item.title}
							onBlur={() => {
								changeEditing();
							}}
							onKeyDown={keyDown}
						/> :
						<>
							<label>
								<input
									type="checkbox"
									className="toggle"
									defaultChecked={prop.item.completed}
									onChange={changeCompleted}
								/>
								<span>
									{prop.item.title}
								</span>
							</label>
							<div className="actions">
								<BiEdit
									onClick={() => changeEditing()}
								/>
								<BiTrash
									onClick={() => todosDispatch({ type: TODO_REMOVE, payload: prop.item.id })}
								/>
							</div>
						</>
				}
			</div>
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