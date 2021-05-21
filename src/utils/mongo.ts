import { connect as mongoConnect } from 'mongoose';
// import mongoose from 'mongoose';

async function database() {
    const url = process.env.MONGOURL;

    try {
        await mongoConnect(String(url), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: false,
            poolSize: 5,
            connectTimeoutMS: 10000,
            family: 4,
            useFindAndModify: false
        });
        console.log("[Mongoose]\tMongoose connection successfully opened")
    } catch (err) {
        console.error(`[Mongoose]\tMongoose connection error: \n ${err.stack}`)
    };
};

database();