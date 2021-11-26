// adding new chat documents
class Chatroom {
    constructor(room, username) {
        this.room = room;
        this.username = username;
        this.chats = db.collection('chats');
        this.unsub;
    }
    async addChat(message) {
        //format a chat object
        const now = new Date();
        const chat = {
            message,
            username: this.username,
            room: this.room,
            created_at: firebase.firestore.Timestamp.fromDate(now)
        };
        // save the chat document to database
        const response = await this.chats.add(chat);
        return response;
    }
    // settings up real-time listener to get new chats
    getChats(callback) {
        this.unsub = this.chats
            .where('room', '==', this.room) // checking if room(database) is equal to the room in the chat
            .orderBy('created_at')
            .onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    if(change.type === 'added'){
                        // update the ui
                        callback(change.doc.data())
                    }
                });
            });
    }
    // updating the username
    updateName(username){
        this.username = username;
        // saving name to localstorage
        localStorage.setItem('username', username)
    }
    // updating the room
    updateRoom(room){
        this.room = room;
        console.log('room updated');
        if(this.unsub){
            this.unsub();
        }
        
    }
}



