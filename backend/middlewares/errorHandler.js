const globalErrorHandler = (error) => {
    console.error("Global Error Handler:", error);
    const response = {
        status: "error",
        message: error.message || "An unexpected error occurred",
    };
    return JSON.stringify(response);
} 

export default globalErrorHandler;