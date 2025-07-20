export interface Pedido {
    tipo: Tipo
    funcionalidad: Funcionalidad
    lugarRetiro: string
    lugarRetiroLatLng: {lat:number, lng:number}
    lugarTipo: LugarTipo
    lugarEntrega: string
    lugarEntregaLatLng: {lat:number, lng:number}
    personaEntrega: string
    personaRetiro: string
}

export type Tipo = '' | 'Auto' | 'SUV' | 'VAN' | 'Pick Up' | 'Utilitario' | 'Mini Bus' | 'Camion';

export type Funcionalidad = '' | 'Funciona por sus medios' | 'Chocado rueda y funciona por sus medios' | 'Chocado pero No rueda y gira bien la dirección' | 
                            'Chocado pero No rueda y No gira la dirección' | 'Casco sin ruedas';

export type LugarTipo = '' | 'Taller' | 'Casa con garage' | 'En la calle' | 'Cochera a nivel' | 'Subsuelo';