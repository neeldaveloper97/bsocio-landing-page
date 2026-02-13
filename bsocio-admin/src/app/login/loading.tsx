export default function LoginLoading() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
            <div className="w-full max-w-md animate-pulse space-y-6 rounded-2xl bg-white/10 p-8 backdrop-blur">
                {/* Logo placeholder */}
                <div className="mx-auto h-10 w-32 rounded bg-white/20" />
                {/* Title */}
                <div className="mx-auto h-6 w-48 rounded bg-white/15" />
                {/* Email field */}
                <div className="h-12 w-full rounded-lg bg-white/10" />
                {/* Password field */}
                <div className="h-12 w-full rounded-lg bg-white/10" />
                {/* Button */}
                <div className="h-12 w-full rounded-lg bg-white/20" />
            </div>
        </div>
    );
}
