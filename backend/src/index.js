import mongoose from 'mongoose';
import app from './App.js';
import config from './config/index.js';

(async () => {
    try {
        await mongoose.connect(config.MONGO_DB_URL)
        console.log("DB connected!")
        app.on('error', (error) => {   //This code because if error occur except DB connected
            console.log('ERROR:', error)
            throw error;
        })

        const onListinig = () => {
            console.log(`Listinig Port ${config.PORT}`)
        }

        app.listen(config.PORT,onListinig)


    } catch (error) {
        console.log("Error While connecting to the Databases",error)
    }
})()