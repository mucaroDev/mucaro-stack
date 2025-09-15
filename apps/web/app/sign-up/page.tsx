import { SignUp } from "@workspace/auth/components";

export default function SignUpPage() {
	return (
		<div className="flex min-h-svh items-center justify-center bg-gray-50">
			<div className="w-full max-w-md space-y-8 p-8">
				<div className="text-center">
					<h2 className="mt-6 font-bold text-3xl text-gray-900 tracking-tight">
						Create your account
					</h2>
					<p className="mt-2 text-gray-600 text-sm">
						Or{" "}
						<a
							className="font-medium text-blue-600 hover:text-blue-500"
							href="/sign-in"
						>
							sign in to your existing account
						</a>
					</p>
				</div>

				<div className="flex justify-center">
					<SignUp />
				</div>
			</div>
		</div>
	);
}
