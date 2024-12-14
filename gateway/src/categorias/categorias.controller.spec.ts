import { Test, TestingModule } from '@nestjs/testing';
import { CategoriasController } from './categorias.controller';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { of } from 'rxjs';

describe('CategoriasController', () => {
  let controller: CategoriasController;
  let clientProxy: ClientProxy;

  const mockClientProxy = {
    send: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriasController],
      providers: [
        {
          provide: 'NATS_SERVICE',
          useValue: mockClientProxy,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<CategoriasController>(CategoriasController);
    clientProxy = module.get<ClientProxy>('NATS_SERVICE');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call client.send with the correct arguments', async () => {
      const createCategoriaDto: CreateCategoriaDto = { nombre: 'Categoria 1', descripcion: 'Descripcion 1' };
      const mockResponse = { nombre: 'Categoria 1', descripcion: 'Descripcion 1' };
      jest.spyOn(clientProxy, 'send').mockReturnValue(of(mockResponse));

      const result = await controller.create(createCategoriaDto);

      expect(clientProxy.send).toHaveBeenCalledWith(
        { cmd: 'create-categoria' },
        createCategoriaDto,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('findAll', () => {
    it('should call client.send with the correct arguments', async () => {
      const mockResponse = [{ nombre: 'Categoria 1', descripcion: 'Descripcion 1' }];
      jest.spyOn(clientProxy, 'send').mockReturnValue(of(mockResponse));

      const result = await controller.findAll();

      expect(clientProxy.send).toHaveBeenCalledWith(
        { cmd: 'get-categorias' },
        {},
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('findOne', () => {
    it('should call client.send with the correct arguments', async () => {
      const mockResponse = { nombre: 'Categoria 1', descripcion: 'Descripcion 1' };
      jest.spyOn(clientProxy, 'send').mockReturnValue(of(mockResponse));

      const result = await controller.findOne(1);

      expect(clientProxy.send).toHaveBeenCalledWith(
        { cmd: 'get-categoria' },
        1,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('update', () => {
    it('should call client.send with the correct arguments', async () => {
      const updateCategoriaDto: UpdateCategoriaDto = { id: 1, nombre: 'Categoria Actualizada', descripcion: 'Descripcion Actualizada' }; // Agregar "id"
      const mockResponse = { id: 1, nombre: 'Categoria Actualizada', descripcion: 'Descripcion Actualizada' };
      jest.spyOn(clientProxy, 'send').mockReturnValue(of(mockResponse));
  
      const result = await controller.update(1, updateCategoriaDto);
  
      expect(clientProxy.send).toHaveBeenCalledWith(
        { cmd: 'update-categoria' },
        { id: 1, ...updateCategoriaDto },
      );
      expect(result).toEqual(mockResponse);
    });
  });
  

  describe('remove', () => {
    it('should call client.send with the correct arguments', async () => {
      const mockResponse = { success: true };
      jest.spyOn(clientProxy, 'send').mockReturnValue(of(mockResponse));

      const result = await controller.remove(1);

      expect(clientProxy.send).toHaveBeenCalledWith(
        { cmd: 'delete-categoria' },
        1,
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
