/* eslint-disable no-var */

// Archivo de declaración de tipos
// declaramos la variable global
import { StarWars } from "../api/interfaces/starwars.interface";

// global: es el objeto global en Nodejs
// var: para que se utilice de forma global
/*
  [key: string] las claves del objeto serán de tipo string
  {
      data: StarWars,
      expiration: Date
  }
  valor asociado a cada clave será un objeto
  con las properties data y expiration.
*/

declare global {
  var cache: {
    // la clave siempre será uid
    [uid: number]: { data: StarWars, expiration: number } // expiratoin: number para trabajar con milisegundos ➡️ 1000 ms = 1s
  }
}


// le dices a Typescript que este archivo es un módulo.
// no un archivo global, para que lo pueda reconocer
export {};

