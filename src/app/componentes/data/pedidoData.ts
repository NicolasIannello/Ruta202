import { Pedido } from "./pedido";

export var pedidosData: Pedido = {
    tipo: '',
    funcionalidad: '',
    lugarRetiro: '',
    lugarTipo: '',
    lugarRetiroLatLng: {lat:0, lng:0},
    lugarEntrega: '',
    personaEntrega: '',
    personaRetiro: '',
    lugarEntregaLatLng: {lat:0, lng:0},
}

export var tipoData = ['','Auto','SUV','VAN','Pick Up','Utilitario','Mini Bus','Camion'];

export var funcionalidadData = ['','Funciona por sus medios','Chocado rueda y funciona por sus medios','Chocado pero No rueda y gira bien la dirección',
                            'Chocado pero No rueda y No gira la dirección','Casco sin ruedas'];

export var lugarTipoData = ['','Taller','Casa con garage','En la calle','Cochera a nivel','Subsuelo'];