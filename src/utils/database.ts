import { connect as mongoConnect } from 'mongoose';
import mongoose from 'mongoose';

async function database() {
    const url = process.env.MONGOURL;

    await mongoConnect(String(url), {
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

database();