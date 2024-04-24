import { Test, TestingModule } from '@nestjs/testing';
import { JestTestsService } from './jest-tests.service';

function multiplyNumber(x: number, y: number) {

  x = Number(x);
  y = Number(y);

  if (isNaN(x)) {

    return {
      message: 'Invalid Number',
    }

  }

  if (isNaN(y)) {

    return {
      message: 'Invalid Number',
    }

  }

  return x * y;

}

function splitString(text: string) {

  if (!text.length) {
    return "Informe o texto";
  }

  return text.split('');

}

describe('JestTestsService', () => {
  let service: JestTestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JestTestsService],
    }).compile();

    service = module.get<JestTestsService>(JestTestsService);
  });

  afterEach(() => {

    service = null;

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('multiplyNumber function', () => {

    // Informar dois números válidos, funcione
    // POSITIVO - Quando tudo dá certo
    it('should multiply a number', () => {

      const result = multiplyNumber(10, 5);

      expect(result).toBe(50);

    });

    // Informar um número inválido, retorne um erro
    // NEGATIVO - Quando algo ruim é fornecido
    it('should return an error when provide invalid number', () => {

      const result = multiplyNumber(Number('abc'), 5);

      expect(result).toHaveProperty('message', 'Invalid Number');

    });

    // Informar uma string, quero que trate a informação
    it('should multiply a number even a string', () => {

      const result = multiplyNumber('2' as unknown as number, 9);

      expect(result).toBe(18);

    })

  });

  describe('splitString function', () => {

    it('should split a string', () => {

      const result = splitString('jest');

      expect(result).toEqual(['j', 'e', 's', 't']);

    });

    it('should return a message when text is not provided', () => {

      const response = splitString('');

      expect(response).toBe('Informe o texto');

    });

  });

  beforeAll(() => {

    console.log("Conexão com Banco de Dados");

  });

  afterAll(() => {

    console.log("Limpando conexão com Banco de Dados");

  });

});
