
export interface StarWars {
  message: string,
  result: {
    properties: {
      height: number,
      mass: number,
      hair_color: string,
      skin_color: string,
      eye_color: string,
      birth_year: string,
      gender: "male" | "female",
      created: Date,
      edited: Date,
      name: string,
      homeworld: string, //URL -->  type URL ➡️  new URL ("url") aquí no es necesario
      url: string // URL
    }
  },
  description: string,
  _id: string,
  uid: string,
  _v: number // versión del documento, allways a numner

  }
