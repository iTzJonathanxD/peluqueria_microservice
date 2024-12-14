import { Test, TestingModule } from '@nestjs/testing';
import { MascotasController } from './mascotas.controller';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateMascotaDto } from './dto/create-cliente.dto';
import { UpdateMascotaDto } from './dto/update-cliente.dto';
import { of } from 'rxjs';

describe('MascotasController', () => {
  let controller: MascotasController;
  let clientProxy: ClientProxy;

  const mockClientProxy = {
    send: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MascotasController],
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

    controller = module.get<MascotasController>(MascotasController);
    clientProxy = module.get<ClientProxy>('NATS_SERVICE');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call client.send with the correct arguments', async () => {
      const createMascotaDto: CreateMascotaDto = { clienteId: 1, nombre: 'Mascota 1', raza: 'Raza 1', edad: 3, peso: 10.5 };
      const mockResponse = { clienteId: 1, nombre: 'Mascota 1', raza: 'Raza 1', edad: 3, peso: 10.5 };
      jest.spyOn(clientProxy, 'send').mockReturnValue(of(mockResponse));

      const result = await controller.create(createMascotaDto);

      expect(clientProxy.send).toHaveBeenCalledWith(
        { cmd: 'create-mascota' },
        createMascotaDto,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('findAll', () => {
    it('should call client.send with the correct arguments', async () => {
      const mockResponse = [{ clienteId: 1, nombre: 'Mascota 1', raza: 'Raza 1', edad: 3, peso: 10.5 }];
      jest.spyOn(clientProxy, 'send').mockReturnValue(of(mockResponse));

      const result = await controller.findAll();

      expect(clientProxy.send).toHaveBeenCalledWith(
        { cmd: 'get-mascotas' },
        {},
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('findOne', () => {
    it('should call client.send with the correct arguments', async () => {
      const mockResponse = { clienteId: 1, nombre: 'Mascota 1', raza: 'Raza 1', edad: 3, peso: 10.5 };
      jest.spyOn(clientProxy, 'send').mockReturnValue(of(mockResponse));

      const result = await controller.findOne(1);

      expect(clientProxy.send).toHaveBeenCalledWith(
        { cmd: 'get-mascota' },
        1,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('update', () => {
    it('should call client.send with the correct arguments', async () => {
      const updateMascotaDto: UpdateMascotaDto = { id: 1, clienteId: 1, nombre: 'Mascota Actualizada', raza: 'Raza Actualizada', edad: 4, peso: 12.0 };
      const mockResponse = { id: 1, clienteId: 1, nombre: 'Mascota Actualizada', raza: 'Raza Actualizada', edad: 4, peso: 12.0 };
      jest.spyOn(clientProxy, 'send').mockReturnValue(of(mockResponse));

      const result = await controller.update(1, updateMascotaDto);

      expect(clientProxy.send).toHaveBeenCalledWith(
        { cmd: 'update-mascota' },
        { id: 1, ...updateMascotaDto },
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
        { cmd: 'delete-mascota' },
        1,
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
