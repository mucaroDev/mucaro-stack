"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignInForm } from "@workspace/auth/components";
import { authClient } from "@/lib/auth";

export default function SignInPage() {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);

	return (
		<div className="min-h-svh flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full space-y-8 p-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
						Sign in to your account
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						Or{" "}
						<a
							href="/sign-up"
							className="font-medium text-blue-600 hover:text-blue-500"
						>
							create a new account
						</a>
					</p>
				</div>

				<div className="bg-white py-8 px-6 shadow rounded-lg">
					{error && (
						<div className="mb-4 rounded-md bg-red-50 p-4">
							<div className="text-sm text-red-700">{error}</div>
						</div>
					)}

					<SignInForm
						authClient={authClient}
						className="space-y-6"
						onSuccess={() => {
							setError(null);
							router.push("/");
						}}
						onError={(err) => setError(err.message)}
						renderSignUpLink={() => (
							<p className="text-center text-sm text-gray-600">
								Don't have an account?{" "}
								<a
									href="/sign-up"
									className="font-medium text-blue-600 hover:text-blue-500"
								>
									Sign up
								</a>
							</p>
						)}
					/>

					<style jsx>{`
						:global(.space-y-6 > * + *) {
							margin-top: 1.5rem;
						}
						
						:global(.space-y-6 div) {
							display: flex;
							flex-direction: column;
						}
						
						:global(.space-y-6 label) {
							display: block;
							text-sm: true;
							font-weight: 500;
							color: #374151;
							margin-bottom: 0.25rem;
						}
						
						:global(.space-y-6 input[type="email"], .space-y-6 input[type="password"]) {
							appearance: none;
							border-radius: 0.375rem;
							border: 1px solid #d1d5db;
							padding: 0.75rem;
							font-size: 0.875rem;
							line-height: 1.25rem;
							color: #111827;
							background-color: white;
							transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
						}
						
						:global(.space-y-6 input[type="email"]:focus, .space-y-6 input[type="password"]:focus) {
							outline: none;
							border-color: #3b82f6;
							box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
						}
						
						:global(.space-y-6 input[type="email"]:disabled, .space-y-6 input[type="password"]:disabled) {
							background-color: #f9fafb;
							color: #6b7280;
						}
						
						:global(.space-y-6 input[type="checkbox"]) {
							margin-right: 0.5rem;
						}
						
						:global(.space-y-6 button[type="submit"]) {
							width: 100%;
							display: flex;
							justify-content: center;
							padding: 0.75rem 1rem;
							border: none;
							border-radius: 0.375rem;
							font-size: 0.875rem;
							font-weight: 500;
							color: white;
							background-color: #3b82f6;
							cursor: pointer;
							transition: background-color 0.15s ease-in-out;
						}
						
						:global(.space-y-6 button[type="submit"]:hover:not(:disabled)) {
							background-color: #2563eb;
						}
						
						:global(.space-y-6 button[type="submit"]:disabled) {
							background-color: #9ca3af;
							cursor: not-allowed;
						}
						
						:global(.space-y-6 div:has(input[type="checkbox"])) {
							flex-direction: row;
							align-items: center;
						}
						
						:global(.space-y-6 div:has(input[type="checkbox"]) label) {
							margin-bottom: 0;
						}
					`}</style>
				</div>
			</div>
		</div>
	);
}
