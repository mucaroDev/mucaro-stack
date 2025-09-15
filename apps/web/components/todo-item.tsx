"use client";

import type { Todo } from "@workspace/db/schema";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { AlertCircle, Calendar, Clock, Edit, Trash2 } from "lucide-react";
import { useState } from "react";

interface TodoItemProps {
	todo: Todo;
	onToggle: (id: string) => Promise<void>;
	onDelete: (id: string) => Promise<void>;
	onEdit: (todo: Todo) => void;
	isLoading?: boolean;
}

export function TodoItem({
	todo,
	onToggle,
	onDelete,
	onEdit,
	isLoading = false,
}: TodoItemProps) {
	const [isToggling, setIsToggling] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleToggle = async () => {
		setIsToggling(true);
		setError(null);
		try {
			await onToggle(todo.id);
		} catch (error) {
			setError(
				error instanceof Error ? error.message : "Failed to update todo"
			);
		} finally {
			setIsToggling(false);
		}
	};

	const handleDelete = async () => {
		setIsDeleting(true);
		setError(null);
		try {
			await onDelete(todo.id);
		} catch (error) {
			setError(
				error instanceof Error ? error.message : "Failed to delete todo"
			);
			setIsDeleting(false);
		}
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case "high":
				return "text-red-600 bg-red-50 border-red-200";
			case "medium":
				return "text-yellow-600 bg-yellow-50 border-yellow-200";
			case "low":
				return "text-green-600 bg-green-50 border-green-200";
			default:
				return "text-gray-600 bg-gray-50 border-gray-200";
		}
	};

	const formatDate = (date: Date | string | null) => {
		if (!date) return null;
		const d = new Date(date);
		return d.toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	const isOverdue =
		todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed;

	return (
		<Card
			className={`transition-all duration-200 ${todo.completed ? "opacity-75" : ""} ${isOverdue ? "border-red-300" : ""}`}
		>
			<CardContent className="p-4">
				{error && (
					<Alert className="mb-3" variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				<div className="flex items-start gap-3">
					<div className="pt-1">
						<Checkbox
							checked={todo.completed}
							disabled={isToggling || isLoading}
							label=""
							onChange={handleToggle}
						/>
					</div>

					<div className="min-w-0 flex-1">
						<div className="flex items-start justify-between gap-2">
							<div className="flex-1">
								<h3
									className={`font-medium text-sm ${todo.completed ? "text-gray-500 line-through" : "text-gray-900"}`}
								>
									{todo.title}
								</h3>
								{todo.description && (
									<p
										className={`mt-1 text-sm ${todo.completed ? "text-gray-400 line-through" : "text-gray-600"}`}
									>
										{todo.description}
									</p>
								)}
							</div>

							<div className="flex items-center gap-1">
								<span
									className={`inline-flex items-center rounded-full border px-2 py-1 font-medium text-xs ${getPriorityColor(todo.priority)}`}
								>
									{todo.priority}
								</span>
							</div>
						</div>

						<div className="mt-3 flex items-center justify-between">
							<div className="flex items-center gap-4 text-gray-500 text-xs">
								{todo.dueDate && (
									<div
										className={`flex items-center gap-1 ${isOverdue ? "text-red-600" : ""}`}
									>
										<Calendar className="h-3 w-3" />
										<span>{formatDate(todo.dueDate)}</span>
										{isOverdue && <AlertCircle className="h-3 w-3" />}
									</div>
								)}
								<div className="flex items-center gap-1">
									<Clock className="h-3 w-3" />
									<span>{formatDate(todo.createdAt)}</span>
								</div>
							</div>

							<div className="flex items-center gap-1">
								<Button
									className="h-8 w-8 p-0"
									disabled={isLoading || isDeleting}
									onClick={() => onEdit(todo)}
									size="sm"
									variant="ghost"
								>
									<Edit className="h-3 w-3" />
								</Button>
								<Button
									className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
									disabled={isLoading || isDeleting}
									onClick={handleDelete}
									size="sm"
									variant="ghost"
								>
									{isDeleting ? (
										<div className="h-3 w-3 animate-spin rounded-full border border-red-600 border-t-transparent" />
									) : (
										<Trash2 className="h-3 w-3" />
									)}
								</Button>
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
