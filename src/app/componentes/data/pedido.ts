export interface Pedido {
    tipo: ['Auto','SUV','VAN','Pick Up','Utilitario','Mini Bus','Camion']
    funcionalidad: ['Funciona por sus medios','Chocado rueda y funciona por sus medios','Chocado pero No rueda y gira bien la dirección','Chocado pero No rueda y No gira la dirección','Casco sin ruedas']
    lugarRetiro: string
    lugarTipo: ['Taller','Casa con garage','En la calle','Cochera a nivel','Subsuelo']
    lugarEntrega: string
    personaEntrega: string
    personaRetiro: string
}