import { Consolidado, TipoConsolidado } from "./patrimonio.model";

describe('Patrimonio', () => {
  it('should create an instance', () => {
    expect(new Consolidado({
      idRef: '123',
      tipo: TipoConsolidado.ACAO,
      valor: 123,
      anoMes: 201901,
    })).toBeTruthy();
  });
});
