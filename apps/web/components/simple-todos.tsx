"use client";

import type { Todo } from "@workspace/db/schema";
import { Button } from "@workspace/ui/components/button";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Container } from "@workspace/ui/components/container";
import { Input } from "@workspace/ui/components/input";
import { Check, Edit3, Trash2, X } from "lucide-react";
import { useOptimistic, useState, useTransition } from "react";
import {
	createTodo,
	deleteTodo,
	toggleTodo,
	updateTodo,
} from "@/lib/todo-actions";

type TodoItemProps = {
	todo: Todo;
};

function TodoItem({ todo }: TodoItemProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [title, setTitle] = useState(todo.title);
	const [isPending, startTransition] = useTransition();

	const handleToggle = () => {
		startTransition(async () => {
			await toggleTodo(todo.id);
		});
	};

	const handleDelete = () => {
		startTransition(async () => {
			await deleteTodo(todo.id);
		});
	};

	const handleEdit = () => {
		setIsEditing(true);
		setTitle(todo.title);
	};

	const handleSave = () => {
		if (title.trim()) {
			startTransition(async () => {
				const formData = new FormData();
				formData.set("title", title.trim());
				await updateTodo(todo.id, formData);
				setIsEditing(false);
			});
		}
	};

	const handleCancel = () => {
		setTitle(todo.title);
		setIsEditing(false);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleSave();
		} else if (e.key === "Escape") {
			handleCancel();
		}
	};

	return (
		<div className="flex items-center gap-3 py-2">
			<Checkbox
				checked={todo.completed}
				className="shrink-0"
				disabled={isPending}
				onCheckedChange={handleToggle}
			/>

			{isEditing ? (
				<div className="flex flex-1 items-center gap-2">
					<Input
						autoFocus
						className="flex-1"
						disabled={isPending}
						onChange={(e) => setTitle(e.target.value)}
						onKeyDown={handleKeyDown}
						value={title}
					/>
					<Button
						disabled={!title.trim() || isPending}
						onClick={handleSave}
						size="sm"
						variant="ghost"
					>
						<Check className="h-4 w-4" />
					</Button>
					<Button
						disabled={isPending}
						onClick={handleCancel}
						size="sm"
						variant="ghost"
					>
						<X className="h-4 w-4" />
					</Button>
				</div>
			) : (
				<div className="flex flex-1 items-center gap-2">
					<span
						className={`flex-1 ${
							todo.completed
								? "text-muted-foreground line-through"
								: "text-foreground"
						}`}
					>
						{todo.title}
					</span>
					<Button
						disabled={isPending}
						onClick={handleEdit}
						size="sm"
						variant="ghost"
					>
						<Edit3 className="h-4 w-4" />
					</Button>
					<Button
						disabled={isPending}
						onClick={handleDelete}
						size="sm"
						variant="ghost"
					>
						<Trash2 className="h-4 w-4 text-destructive" />
					</Button>
				</div>
			)}
		</div>
	);
}

type AddTodoFormProps = {
	onSuccess?: () => void;
};

function AddTodoForm({ onSuccess }: AddTodoFormProps) {
	const [title, setTitle] = useState("");
	const [isPending, startTransition] = useTransition();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!title.trim()) return;

		startTransition(async () => {
			const formData = new FormData();
			formData.set("title", title.trim());
			await createTodo(formData);
			setTitle("");
			onSuccess?.();
		});
	};

	return (
		<form className="mb-6 flex gap-2" onSubmit={handleSubmit}>
			<Input
				className="flex-1"
				disabled={isPending}
				onChange={(e) => setTitle(e.target.value)}
				placeholder="Add a todo..."
				value={title}
			/>
			<Button disabled={!title.trim() || isPending} type="submit">
				Add
			</Button>
		</form>
	);
}

type SimpleTodosProps = {
	initialTodos: Todo[];
};

export function SimpleTodos({ initialTodos }: SimpleTodosProps) {
	const [optimisticTodos] = useOptimistic(
		initialTodos,
		(state, newTodo: Todo) => [...state, newTodo]
	);

	return (
		<Container>
			<h1 className="mb-6 font-bold text-2xl">Todos</h1>
			<AddTodoForm />
			<div className="space-y-1">
				{optimisticTodos.length === 0 ? (
					<p className="py-8 text-center text-muted-foreground">
						No todos yet. Add one above!
					</p>
				) : (
					optimisticTodos.map((todo) => <TodoItem key={todo.id} todo={todo} />)
				)}
			</div>

			{optimisticTodos.length > 0 && (
				<div className="mt-6 text-center text-muted-foreground text-sm">
					{optimisticTodos.filter((t) => t.completed).length} of{" "}
					{optimisticTodos.length} completed
				</div>
			)}
		</Container>
	);
}
