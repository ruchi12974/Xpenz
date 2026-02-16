import connectDB from "./config/db.js" ;
import app from './app.js';
import dotenv from "dotenv";    

dotenv.config();    

const PORT = process.env.PORT || 5005 ;

const startServer = async () => {
    try {
        await connectDB(); 
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })
    }
    catch (error) {
        console.log("Failed to start server:", error.message); 
    }
}
startServer(); 

export default startServer;