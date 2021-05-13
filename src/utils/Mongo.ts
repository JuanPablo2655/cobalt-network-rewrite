import { connect as mongoConnect } from 'mongoose';
import mongoose from 'mongoose';

class Mongo {
    constructor(url: string) {
        mongoConnect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: false,
            poolSize: 5,
            connectTimeoutMS: 10000,
            family: 4
        });

        const db = mongoose.connection;

        db.on('connected', () => {
            console.log("[Mongoose]\tMongoose connection successfully opened")
        });

        db.on('err', err => {
            console.error(`[Mongoose]\tMongoose connection error: \n ${err.stack}`);
        });
        
        db.on('disconnected', () => {
            console.log('[Mongoose]\tMongoose connection disconnected');
        });

    };
};

export default Mongo;