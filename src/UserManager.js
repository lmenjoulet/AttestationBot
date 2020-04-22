let fs = require('fs');

class UserManager{

    constructor(){
        this.users = JSON.parse(fs.readFileSync("./ressources/users.json"));
    }
    addUserInfo(id,type,info){
        if(this.users[id] === undefined) this.users[id] = {};
        this.users[id][type] = info;
    }
    saveUsers(){
        const toWrite = JSON.stringify(this.users);
        fs.writeFileSync("./ressources/users.json",toWrite);
    }

    loadUser(id){
        return this.users[id];
    }
};

module.exports = UserManager;