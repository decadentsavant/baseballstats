export default class ErrorHandler {
    static handleError(err) {
        console.error("Error Message:", err.message);
        console.error(err.stack);
        if (err.innerError) {
            console.error("Inner Error:", err.innerError);
        }
    }
}
