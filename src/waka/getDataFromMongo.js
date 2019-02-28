import {getCollection, closeClient} from '../mongoClient';
import {c_error} from "../util/log";


const find = async (user, limit) => {
    const collection = await getCollection(user);
    if (collection == null) {
        return null;
    }
    return await collection.find({}, {
        projection: {_id: 0},
        limit: limit,
        sort: {date: -1}
    });
};

const parse = async (user, limit) => {
    let docs = {};
    await find(user, limit).then((d) => {
        docs = d.toArray();
        closeClient();
    }).catch(e => {
        c_error("Error: Get data from MongoDB failed");
        c_error("\tReason: " + e.message);
    });
    return docs;
};

export default parse;
