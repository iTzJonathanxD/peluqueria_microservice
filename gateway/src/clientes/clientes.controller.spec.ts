import { Test, TestingModule } from '@nestjs/testing';
import { ClientesController } from './clientes.controller';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { of } from 'rxjs';

describe('ClientesController', () => {
  let controller: ClientesController;
  let clientProxy: ClientProxy;

  const mockClientProxy = {
    send: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientesController],
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

    controller = module.get<ClientesController>(ClientesController);
    clientProxy = module.get<ClientProxy>('NATS_SERVICE');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call client.send with the correct arguments', async () => {
      const createClienteDto: CreateClienteDto = { nombre: 'Cliente 1', telefono: '123456789', email: 'cliente1@example.com', direccion: 'Direccion 1' };
      const mockResponse = { nombre: 'Cliente 1', telefono: '123456789', email: 'cliente1@example.com', direccion: 'Direccion 1' };
      jest.spyOn(clientProxy, 'send').mockReturnValue(of(mockResponse));

      const result = await controller.create(createClienteDto);

      expect(clientProxy.send).toHaveBeenCalledWith(
        { cmd: 'create-cliente' },
        createClienteDto,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('findAll', () => {
    it('should call client.send with the correct arguments', async () => {
      const mockResponse = [{ nombre: 'Cliente 1', telefono: '123456789', email: 'cliente1@example.com', direccion: 'Direccion 1' }];
      jest.spyOn(clientProxy, 'send').mockReturnValue(of(mockResponse));

      const result = await controller.findAll();

      expect(clientProxy.send).toHaveBeenCalledWith(
        { cmd: 'get-clientes' },
        {},
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('findOne', () => {
    it('should call client.send with the correct arguments', async () => {
      const mockResponse = { nombre: 'Cliente 1', telefono: '123456789', email: 'cliente1@example.com', direccion: 'Direccion 1' };
      jest.spyOn(clientProxy, 'send').mockReturnValue(of(mockResponse));

      const result = await controller.findOne(1);

      expect(clientProxy.send).toHaveBeenCalledWith(
        { cmd: 'get-cliente' },
        1,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('update', () => {
    it('should call client.send with the correct arguments', async () => {
      const updateClienteDto: UpdateClienteDto = { id: 1, nombre: 'Cliente Actualizado', telefono: '987654321', email: 'clienteactualizado@example.com', direccion: 'Direccion Actualizada' };
      const mockResponse = { id: 1, nombre: 'Cliente Actualizado', telefono: '987654321', email: 'clienteactualizado@example.com', direccion: 'Direccion Actualizada' };
      jest.spyOn(clientProxy, 'send').mockReturnValue(of(mockResponse));

      const result = await controller.update(1, updateClienteDto);

      expect(clientProxy.send).toHaveBeenCalledWith(
        { cmd: 'update-cliente' },
        { id: 1, ...updateClienteDto },
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
        { cmd: 'delete-cliente' },
        1,
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
