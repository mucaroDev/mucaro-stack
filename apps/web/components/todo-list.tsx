"use client";

import type { Todo } from "@workspace/db/schema";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { Button } from "@workspace/ui/components/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@workspace/ui/components/card";
import {
	AlertCircle,
	Calendar,
	CheckCircle,
	Circle,
	Plus,
	RefreshCw,
	Target,
	TrendingUp,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { TodoForm, type TodoFormData } from "./todo-form";
import { TodoItem } from "./todo-item";

interface TodoStats {
	total: number;
	completed: number;
	pending: number;
	highPriority: number;
	completionRate: number;
}

// Removed unused interface

export function TodoList() {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [stats, setStats] = useState<TodoStats | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [showForm, setShowForm] = useState(false);
	const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
	const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");

	const fetchTodos = useCallback(async (): Promise<void> => {
		try {
			setError(null);
			const response = await fetch("/api/todos");

			if (!response.ok) {
				throw new Error(`Failed to fetch todos: ${response.statusText}`);
			}

			const data = await response.json();

			if (!data.success) {
				throw new Error(data.error || "Failed to fetch todos");
			}

			setTodos(data.data.todos);
			setStats(data.data.stats);
		} catch (error) {
			setError(
				error instanceof Error ? error.message : "Failed to fetch todos"
			);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const createTodo = async (formData: TodoFormData) => {
		const response = await fetch("/api/todos", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formData),
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || "Failed to create todo");
		}

		const data = await response.json();
		if (!data.success) {
			throw new Error(data.error || "Failed to create todo");
		}

		// Refresh the list
		await fetchTodos();
		setShowForm(false);
	};

	const updateTodo = async (formData: TodoFormData) => {
		if (!editingTodo) return;

		const response = await fetch(`/api/todos/${editingTodo.id}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formData),
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || "Failed to update todo");
		}

		const data = await response.json();
		if (!data.success) {
			throw new Error(data.error || "Failed to update todo");
		}

		// Refresh the list
		await fetchTodos();
		setEditingTodo(null);
	};

	const toggleTodo = async (id: string) => {
		const response = await fetch(`/api/todos/${id}/toggle`, {
			method: "POST",
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || "Failed to toggle todo");
		}

		const data = await response.json();
		if (!data.success) {
			throw new Error(data.error || "Failed to toggle todo");
		}

		// Refresh the list
		await fetchTodos();
	};

	const deleteTodo = async (id: string) => {
		const response = await fetch(`/api/todos/${id}`, {
			method: "DELETE",
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || "Failed to delete todo");
		}

		const data = await response.json();
		if (!data.success) {
			throw new Error(data.error || "Failed to delete todo");
		}

		// Refresh the list
		await fetchTodos();
	};

	const handleEdit = (todo: Todo) => {
		setEditingTodo(todo);
		setShowForm(false);
	};

	const handleCancelEdit = () => {
		setEditingTodo(null);
	};

	const filteredTodos = todos.filter((todo) => {
		switch (filter) {
			case "pending":
				return !todo.completed;
			case "completed":
				return todo.completed;
			default:
				return true;
		}
	});

	// Load todos on component mount
	useEffect(() => {
		fetchTodos();
	}, [fetchTodos]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="flex items-center gap-3">
					<RefreshCw className="h-5 w-5 animate-spin" />
					<span>Loading todos...</span>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Stats Cards */}
			{stats && (
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
					<Card>
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<Target className="h-8 w-8 text-blue-600" />
								<div>
									<p className="font-medium text-gray-600 text-sm">Total</p>
									<p className="font-bold text-2xl text-gray-900">
										{stats.total}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<CheckCircle className="h-8 w-8 text-green-600" />
								<div>
									<p className="font-medium text-gray-600 text-sm">Completed</p>
									<p className="font-bold text-2xl text-gray-900">
										{stats.completed}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<Circle className="h-8 w-8 text-yellow-600" />
								<div>
									<p className="font-medium text-gray-600 text-sm">Pending</p>
									<p className="font-bold text-2xl text-gray-900">
										{stats.pending}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<TrendingUp className="h-8 w-8 text-purple-600" />
								<div>
									<p className="font-medium text-gray-600 text-sm">
										Completion
									</p>
									<p className="font-bold text-2xl text-gray-900">
										{stats.completionRate}%
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			)}

			{/* Error Display */}
			{error && (
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription className="flex items-center justify-between">
						<span>{error}</span>
						<Button
							className="ml-4"
							onClick={fetchTodos}
							size="sm"
							variant="outline"
						>
							<RefreshCw className="mr-2 h-4 w-4" />
							Retry
						</Button>
					</AlertDescription>
				</Alert>
			)}

			{/* Add/Edit Todo Form */}
			{(showForm || editingTodo) && (
				<TodoForm
					onCancel={editingTodo ? handleCancelEdit : () => setShowForm(false)}
					onSubmit={editingTodo ? updateTodo : createTodo}
					todo={editingTodo}
				/>
			)}

			{/* Todo List */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle className="flex items-center gap-2">
							<Calendar className="h-5 w-5" />
							Your Todos
						</CardTitle>
						<div className="flex items-center gap-3">
							{/* Filter Buttons */}
							<div className="flex items-center gap-1">
								<Button
									onClick={() => setFilter("all")}
									size="sm"
									variant={filter === "all" ? "default" : "outline"}
								>
									All ({stats?.total || 0})
								</Button>
								<Button
									onClick={() => setFilter("pending")}
									size="sm"
									variant={filter === "pending" ? "default" : "outline"}
								>
									Pending ({stats?.pending || 0})
								</Button>
								<Button
									onClick={() => setFilter("completed")}
									size="sm"
									variant={filter === "completed" ? "default" : "outline"}
								>
									Done ({stats?.completed || 0})
								</Button>
							</div>

							{!(showForm || editingTodo) && (
								<Button
									className="flex items-center gap-2"
									onClick={() => setShowForm(true)}
								>
									<Plus className="h-4 w-4" />
									Add Todo
								</Button>
							)}
						</div>
					</div>
				</CardHeader>
				<CardContent className="p-6">
					{filteredTodos.length === 0 ? (
						<div className="py-12 text-center">
							<Calendar className="mx-auto mb-4 h-12 w-12 text-gray-400" />
							<h3 className="mb-2 font-medium text-gray-900 text-lg">
								{filter === "all" && "No todos yet"}
								{filter === "pending" && "No pending todos"}
								{filter === "completed" && "No completed todos"}
							</h3>
							<p className="mb-6 text-gray-500">
								{filter === "all" && "Get started by creating your first todo!"}
								{filter === "pending" &&
									"Great job! All your todos are completed."}
								{filter === "completed" &&
									"Complete some todos to see them here."}
							</p>
							{filter === "all" && !showForm && !editingTodo && (
								<Button
									className="flex items-center gap-2"
									onClick={() => setShowForm(true)}
								>
									<Plus className="h-4 w-4" />
									Create Your First Todo
								</Button>
							)}
						</div>
					) : (
						<div className="space-y-3">
							{filteredTodos.map((todo) => (
								<TodoItem
									key={todo.id}
									onDelete={deleteTodo}
									onEdit={handleEdit}
									onToggle={toggleTodo}
									todo={todo}
								/>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
