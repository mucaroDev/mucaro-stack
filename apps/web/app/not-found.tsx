import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardFooter } from "@workspace/ui/components/card";
import { Container } from "@workspace/ui/components/container";
import { Separator } from "@workspace/ui/components/separator";
import Link from "next/link";

export default function NotFound() {
	return (
		<div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
			<Container className="max-w-2xl text-center">
				<div className="space-y-6">
					{/* 404 Number */}
					<div className="relative">
						<h1 className="select-none font-bold text-9xl text-primary/10">
							404
						</h1>
					</div>

					{/* Main Message */}
					<div className="space-y-3">
						<h2 className="font-bold text-3xl text-foreground tracking-tight">
							Page Not Found
						</h2>
						<p className="mx-auto max-w-md text-lg text-muted-foreground">
							Oops! The page you're looking for seems to have wandered off.
							Let's get you back on track.
						</p>
					</div>

					<Separator className="my-8" />

					{/* Helpful Links */}
					<div className="space-y-4">
						<p className="font-medium text-muted-foreground text-sm">
							Here are some helpful links instead:
						</p>
						<div className="flex flex-col justify-center gap-3 sm:flex-row">
							<Button asChild className="w-full sm:w-auto" size="lg">
								<Link href="/">Go Home</Link>
							</Button>
							<Button
								asChild
								className="w-full sm:w-auto"
								size="lg"
								variant="outline"
							>
								<Link href="/auth/sign-in">Sign In</Link>
							</Button>
						</div>
					</div>
				</div>

				{/* Additional Help Text */}
				<div className="mt-8 text-center">
					<p className="text-muted-foreground text-sm">
						If you believe this is a mistake, please{" "}
						<Link
							className="font-medium text-primary hover:underline"
							href="mailto:support@example.com"
						>
							contact support
						</Link>
						.
					</p>
				</div>
			</Container>
		</div>
	);
}
