import {collection, getDocs} from "@firebase/firestore";
import {db} from "../db/Firebase.ts";

const getMessages = async () => {
    try {
        const collectionReference = collection(db, "message");
        const docs = await getDocs(collectionReference);

        const newMessages: MessageType[] = [];
        docs.docs.forEach((value) => {
            const message: MessageType = {
                id: value.id,
                name: value.get("name"),
                email: value.get("email"),
                message: value.get("message"),
                createdAt: value.get("created_at").toDate(),
            }
            newMessages.push(message);
        });
        newMessages.sort((a, b) => b.createdAt.valueOf() - a.createdAt.valueOf());
        return newMessages;
    } catch (e) {
        throw e;
    }
}

export default getMessages;