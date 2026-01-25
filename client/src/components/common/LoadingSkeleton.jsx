const LoadingSkeleton = ({ type = 'card', count = 1 }) => {
    const skeletons = {
        card: () => (
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 animate-pulse">
                <div className="bg-gray-200 rounded h-48 -mx-6 -mt-6 mb-4 rounded-t-xl"></div>
                <div className="bg-gray-200 rounded h-6 w-3/4 mb-3"></div>
                <div className="bg-gray-200 rounded h-4 w-full mb-2"></div>
                <div className="bg-gray-200 rounded h-4 w-2/3 mb-4"></div>
                <div className="flex justify-between items-center">
                    <div className="bg-gray-200 rounded h-8 w-24"></div>
                    <div className="bg-gray-200 rounded h-10 w-20 rounded-md"></div>
                </div>
            </div>
        ),
        list: () => (
            <div className="flex gap-4 p-4 border border-gray-200 rounded-xl animate-pulse">
                <div className="bg-gray-200 rounded h-20 w-20 rounded-lg flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                    <div className="bg-gray-200 rounded h-5 w-3/4"></div>
                    <div className="bg-gray-200 rounded h-4 w-1/2"></div>
                    <div className="bg-gray-200 rounded h-4 w-2/3"></div>
                </div>
            </div>
        ),
        text: () => (
            <div className="space-y-2 animate-pulse">
                <div className="bg-gray-200 rounded h-4 w-full"></div>
                <div className="bg-gray-200 rounded h-4 w-5/6"></div>
                <div className="bg-gray-200 rounded h-4 w-4/6"></div>
            </div>
        ),
        table: () => (
            <div className="border border-gray-200 rounded-xl overflow-hidden animate-pulse">
                <div className="bg-gray-200 rounded h-12 w-full"></div>
                <div className="p-4 space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex gap-4">
                            <div className="bg-gray-200 rounded h-8 flex-1"></div>
                            <div className="bg-gray-200 rounded h-8 flex-1"></div>
                            <div className="bg-gray-200 rounded h-8 flex-1"></div>
                        </div>
                    ))}
                </div>
            </div>
        )
    };

    const SkeletonComponent = skeletons[type] || skeletons.card;

    return (
        <>
            {[...Array(count)].map((_, index) => (
                <SkeletonComponent key={index} />
            ))}
        </>
    );
}

export default LoadingSkeleton;
