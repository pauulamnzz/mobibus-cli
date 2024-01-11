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
export interface IUser extends IEntity {
    name: string,
    username: string,
    email: string,
    role: boolean,

}
export interface IUserPage extends IPage<IUser> {
}

export interface IParadaFav extends IEntity {
    linea: string,
    denominacion: string,
    id_parada_api: number

}
export interface IParadaFavPage extends IPage<IParadaFav> {
}
export interface IUserParadaFav extends IEntity {
    id_user: number,
    id_parada_fav: number

}
export interface IUserParadaFavPage extends IPage<IUserParadaFav> {
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