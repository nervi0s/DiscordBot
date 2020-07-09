class Usuario {

    constructor(id, name, server, joinedAt) {
        this.id = id;
        this.name = name;
        this.server = server;
        this.joinedAt = joinedAt;
        this.welcomeStatus = false;
    }

    setWelcomeStatus(estado) {
        this.welcomeStatus = estado;
    }

}

module.exports = Usuario;