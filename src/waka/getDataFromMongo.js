import {getCollection, closeClient} from '../mongoClient';
import {c_error} from "../util/log";


const find = async (date) => {
    const collection = await getCollection();
    if (collection == null) {
        return null;
    }
    return await collection.findOne({'date': date});
};

const parse = async (date) => {
    let docs = {};
    await find(date).then((d) => {
        docs = d;
        closeClient();
    }).catch(e => {
        c_error("Error: Get data from MongoDB failed");
        c_error("\tReason: " + e.message);
        docs = null;
    });
    if (docs === null) {
        return -1;
    } else {
        return docs['total'];
    }
};

export default parse;
