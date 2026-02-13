export default function Loading() {
    return (
        <div className="min-h-screen bg-white animate-pulse">
            {/* Header skeleton */}
            <div className="fixed top-0 left-0 z-[1000] w-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
                <div className="mx-auto flex h-auto max-w-[1200px] items-center justify-between px-5 py-5">
                    <div className="h-8 w-32 rounded bg-gray-200" />
                </div>
            </div>

            {/* Hero skeleton */}
            <div className="flex min-h-[500px] items-center justify-center bg-gray-300 px-4 pt-[140px] pb-[100px] text-center">
                <div className="mx-auto max-w-[1200px] space-y-6">
                    <div className="mx-auto h-12 w-3/4 rounded bg-gray-400/30" />
                    <div className="mx-auto h-8 w-2/3 rounded bg-gray-400/30" />
                    <div className="mx-auto h-10 w-40 rounded-full bg-gray-400/30" />
                </div>
            </div>

            {/* Content skeleton */}
            <div className="mx-auto max-w-[1200px] px-5 py-12 space-y-8">
                <div className="mx-auto h-8 w-64 rounded bg-gray-200" />
                <div className="grid gap-8 md:grid-cols-2">
                    <div className="h-48 rounded-lg bg-gray-100" />
                    <div className="h-48 rounded-lg bg-gray-100" />
                </div>
            </div>
        </div>
    );
}
