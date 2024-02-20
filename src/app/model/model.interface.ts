export interface Sort {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
}

export interface Pageable {
    sort: Sort;
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
}

export interface IPage<T> {
    content: T[];
    pageable: Pageable;
    totalPages: number;
    totalElements: number;
    last: boolean;
    size: number;
    number: number;
    sort: Sort;
    first: boolean;
    numberOfElements: number;
    empty: boolean;

    strSortField: string;
    strSortDirection: string;
    strFilter: string;
    strFilteredTitle: string;
    strFilteredMessage: string;
    nRecords: number;
}
export interface IEntity {
    id: number,
}

export interface IUserPage extends IPage<IUser> {
}

export interface IParadaFavPage extends IPage<IParadaFav> {
}
export interface IProxLlegada extends IPage<IProxLlegada> {
}
export interface IResultApi extends IPage<IResultApi> {
}
export interface IRoot extends IPage<IRoot> {
}
//user 
export interface IUser extends IEntity {

    username: string,
    password: string,
    email: string,
    role: boolean,
    paradas_favs: number,

}


//parada fav bbdd
export interface IParadaFav extends IEntity {
alias: string,
id_parada: number,
user: IUser,

}

//resultados api 
 export interface IRoot {
  total_count: number
  results: IResultApi[]
}

//resultados api 
export interface IResultApi {
  id_parada: number
  codvia?: number
  numportal: string
  suprimida: number
  denominacion: string
  lineas: string
 // geo_shape: GeoShape
  //geo_point_2d: GeoPoint2d
}

// export interface GeoShape {
//   type: string
//   geometry: Geometry
//   properties: Properties
// }

// export interface Geometry {
//   coordinates: number[]
//   type: string
// }
// export interface GeoPoint2d {
//   lon: number
//   lat: number
// }

//parada respuesta prox llegadas
export interface IProxLlegada{
  numParada: string,
  nomParada: string,
  nomLinea: string,
  tiempo: string,
  numLinea: string
}


export type formOperation = 'EDIT' | 'NEW';

export interface SessionEvent {
    type: string;
}

export interface IToken {
    jti: string;
    iss: string;
    iat: number;
    exp: number;
    name: string;
}



  export interface Properties {}
  

  
