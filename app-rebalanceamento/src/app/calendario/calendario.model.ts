export interface Evento {
    dataInicial: Date, // data do evento
    titulo: string, // titulo do evento
    descricao?: string // descrição do evento
    cor?: string, // cor do evento
    meta?: any, // meta do evento
}

export type DataClicked = {
    data: Date, // data clicada
    event: MouseEvent // evento do mouse
}

export type CalendarColorType = 'red' | 'green' | 'lightgreen' | 'blue' | 'orange' | 'purple' | 'cyan';

export const CalendarColors: Record<CalendarColorType, {primary: string, secondary: string}> = {
  red: {
    primary: '#E30B08',
    secondary: '#fb9e9d',
  },
  blue: {
    primary: '#0000ff',
    secondary: '#D1E8FF',
  },
  orange: {
    primary: '#ffa500',
    secondary: '#9999ff',
  },
  lightgreen: {
    primary: '#90ee90', 
    secondary: '#bcfdba'
  },
  green: {
    primary: '#008000',
    secondary: '#bcfdba',
  },
  cyan: {
    primary: '#08E1E3',
    secondary: '#DCBAFD'
  },
  purple: {
    primary: '#8e0b3d',
    secondary: '#f8a0c2',
  }
};
