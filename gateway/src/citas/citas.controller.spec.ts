import { Test, TestingModule } from '@nestjs/testing';
import { CitasController } from './citas.controller';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateCitaDto } from './dto/create-citas.dto';
import { UpdateCitaDto } from './dto/update-citas.dto';
import { of } from 'rxjs';

describe('CitasController', () => {
  let controller: CitasController;
  let clientProxy: ClientProxy;

  const mockClientProxy = {
    send: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CitasController],
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

    controller = module.get<CitasController>(CitasController);
    clientProxy = module.get<ClientProxy>('NATS_SERVICE');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call client.send with the correct arguments', async () => {
      const createCitaDto: CreateCitaDto = { clienteId: 1, mascotaId: 2, servicioId: 3, fechaCita: new Date(), estado: 'pendiente' };
      const mockResponse = { id: 1, ...createCitaDto };
      jest.spyOn(clientProxy, 'send').mockReturnValue(of(mockResponse));

      const result = await controller.create(createCitaDto);

      expect(clientProxy.send).toHaveBeenCalledWith(
        { cmd: 'create-cita' },
        createCitaDto,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('findAll', () => {
    it('should call client.send with the correct arguments', async () => {
      const mockResponse = [{ id: 1, clienteId: 1, mascotaId: 2, servicioId: 3, fechaCita: new Date(), estado: 'pendiente' }];
      jest.spyOn(clientProxy, 'send').mockReturnValue(of(mockResponse));

      const result = await controller.findAll();

      expect(clientProxy.send).toHaveBeenCalledWith(
        { cmd: 'get-citas' },
        {},
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('findOne', () => {
    it('should call client.send with the correct arguments', async () => {
      const mockResponse = { id: 1, clienteId: 1, mascotaId: 2, servicioId: 3, fechaCita: new Date(), estado: 'pendiente' };
      jest.spyOn(clientProxy, 'send').mockReturnValue(of(mockResponse));

      const result = await controller.findOne(1);

      expect(clientProxy.send).toHaveBeenCalledWith(
        { cmd: 'get-cita' },
        1,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('update', () => {
    it('should call client.send with the correct arguments', async () => {
      const updateCitaDto: UpdateCitaDto = { id: 1, clienteId: 1, mascotaId: 2, servicioId: 3, fechaCita: new Date(), estado: 'confirmada' };
      const mockResponse = { id: 1, ...updateCitaDto };
      jest.spyOn(clientProxy, 'send').mockReturnValue(of(mockResponse));

      const result = await controller.update(1, updateCitaDto);

      expect(clientProxy.send).toHaveBeenCalledWith(
        { cmd: 'update-cita' },
        { id: 1, ...updateCitaDto },
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
        { cmd: 'delete-cita' },
        1,
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
