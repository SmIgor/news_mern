const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="w-6 h-6 bg-gray-600 rounded animate-[spin_3s_ease-in-out_infinite]"></div>
    </div>
  )
}

export default LoadingSpinner
