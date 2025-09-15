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
import { FormField } from "@workspace/ui/components/form-field";
import { AlertCircle, Plus, Save } from "lucide-react";
import { useState } from "react";

interface TodoFormProps {
	todo?: Todo | null;
	onSubmit: (data: TodoFormData) => Promise<void>;
	onCancel?: () => void;
	isLoading?: boolean;
}

export interface TodoFormData {
	title: string;
	description?: string;
	priority: "low" | "medium" | "high";
	dueDate?: string;
}

export function TodoForm({
	todo,
	onSubmit,
	onCancel,
	isLoading = false,
}: TodoFormProps) {
	const [formData, setFormData] = useState<TodoFormData>({
		title: todo?.title || "",
		description: todo?.description || "",
		priority: (todo?.priority as "low" | "medium" | "high") || "medium",
		dueDate: todo?.dueDate
			? new Date(todo.dueDate).toISOString().split("T")[0]
			: "",
	});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [error, setError] = useState<string | null>(null);

	const handleChange =
		(field: keyof TodoFormData) =>
		(
			e: React.ChangeEvent<
				HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
			>
		) => {
			setFormData((prev) => ({
				...prev,
				[field]: e.target.value,
			}));

			// Clear field error when user starts typing
			if (errors[field]) {
				setErrors((prev) => ({
					...prev,
					[field]: "",
				}));
			}
		};

	const validateForm = (): boolean => {
		const MAX_TITLE_LENGTH = 255;
		const MAX_DESCRIPTION_LENGTH = 1000;
		const newErrors: Record<string, string> = {};

		if (!formData.title.trim()) {
			newErrors.title = "Title is required";
		} else if (formData.title.length > MAX_TITLE_LENGTH) {
			newErrors.title = `Title must be less than ${MAX_TITLE_LENGTH} characters`;
		}

		if (
			formData.description &&
			formData.description.length > MAX_DESCRIPTION_LENGTH
		) {
			newErrors.description = `Description must be less than ${MAX_DESCRIPTION_LENGTH} characters`;
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setError(null);

		try {
			const submitData: TodoFormData = {
				title: formData.title.trim(),
				description: formData.description?.trim() || undefined,
				priority: formData.priority,
				dueDate: formData.dueDate || undefined,
			};

			await onSubmit(submitData);
		} catch (error) {
			setError(error instanceof Error ? error.message : "Failed to save todo");
		}
	};

	const isEditing = !!todo;

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					{isEditing ? (
						<>
							<Save className="h-5 w-5" />
							Edit Todo
						</>
					) : (
						<>
							<Plus className="h-5 w-5" />
							Add New Todo
						</>
					)}
				</CardTitle>
			</CardHeader>
			<CardContent>
				{error && (
					<Alert className="mb-4" variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				<form className="space-y-4" onSubmit={handleSubmit}>
					<FormField
						error={errors.title}
						inputProps={{
							value: formData.title,
							onChange: handleChange("title"),
							placeholder: "Enter todo title...",
							disabled: isLoading,
						}}
						label="Title"
						required
					/>

					<div>
						<label
							className="mb-1 block font-medium text-gray-700 text-sm"
							htmlFor="description"
						>
							Description
						</label>
						<textarea
							className={`w-full rounded-md border px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
								errors.description ? "border-red-500" : "border-gray-300"
							}`}
							disabled={isLoading}
							id="description"
							onChange={handleChange("description")}
							placeholder="Enter todo description (optional)..."
							rows={3}
							value={formData.description}
						/>
						{errors.description && (
							<p className="mt-1 text-red-600 text-sm">{errors.description}</p>
						)}
					</div>

					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<label
								className="mb-1 block font-medium text-gray-700 text-sm"
								htmlFor="priority"
							>
								Priority
							</label>
							<select
								className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
								disabled={isLoading}
								id="priority"
								onChange={handleChange("priority")}
								value={formData.priority}
							>
								<option value="low">Low</option>
								<option value="medium">Medium</option>
								<option value="high">High</option>
							</select>
						</div>

						<FormField
							inputProps={{
								type: "date",
								value: formData.dueDate,
								onChange: handleChange("dueDate"),
								disabled: isLoading,
							}}
							label="Due Date"
						/>
					</div>

					<div className="flex items-center gap-3 pt-2">
						<Button
							className="flex items-center gap-2"
							disabled={isLoading}
							type="submit"
						>
							{isLoading && (
								<div className="h-4 w-4 animate-spin rounded-full border border-white border-t-transparent" />
							)}
							{!isLoading && isEditing && <Save className="h-4 w-4" />}
							{!(isLoading || isEditing) && <Plus className="h-4 w-4" />}
							{isEditing ? "Update Todo" : "Add Todo"}
						</Button>

						{onCancel && (
							<Button
								disabled={isLoading}
								onClick={onCancel}
								type="button"
								variant="outline"
							>
								Cancel
							</Button>
						)}
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
