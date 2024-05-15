import { TransacaoImpl } from './transacao.model';

describe('Transacao', () => {
  it('should create an instance', () => {
    expect(new TransacaoImpl({})).toBeTruthy();
  });
});
