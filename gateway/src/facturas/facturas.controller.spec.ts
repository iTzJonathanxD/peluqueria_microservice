import { Test, TestingModule } from '@nestjs/testing';
import { FacturasController } from './facturas.controller';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';
import { of } from 'rxjs';

describe('FacturasController', () => {
  let controller: FacturasController;
  let clientProxy: ClientProxy;

  const mockClientProxy = {
    send: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FacturasController],
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

    controller = module.get<FacturasController>(FacturasController);
    clientProxy = module.get<ClientProxy>('NATS_SERVICE');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call client.send with the correct arguments', async () => {
      const createFacturaDto: CreateFacturaDto = {
        citaId: 1,
        montoTotal: 100.0,
        metodoPago: 'efectivo',
      };
      const mockResponse = { ...createFacturaDto, id: 1 };
      jest.spyOn(clientProxy, 'send').mockReturnValue(of(mockResponse));

      const result = await controller.create(createFacturaDto);

      expect(clientProxy.send).toHaveBeenCalledWith(
        { cmd: 'create-factura' },
        createFacturaDto,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('findAll', () => {
    it('should call client.send with the correct arguments', async () => {
      const mockResponse = [
        { id: 1, citaId: 1, montoTotal: 100.0, metodoPago: 'efectivo' },
      ];
      jest.spyOn(clientProxy, 'send').mockReturnValue(of(mockResponse));

      const result = await controller.findAll();

      expect(clientProxy.send).toHaveBeenCalledWith(
        { cmd: 'get-facturas' },
        {},
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('findOne', () => {
    it('should call client.send with the correct arguments', async () => {
      const mockResponse = { id: 1, citaId: 1, montoTotal: 100.0, metodoPago: 'efectivo' };
      jest.spyOn(clientProxy, 'send').mockReturnValue(of(mockResponse));

      const result = await controller.findOne(1);

      expect(clientProxy.send).toHaveBeenCalledWith(
        { cmd: 'get-factura' },
        1,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('update', () => {
    it('should call client.send with the correct arguments', async () => {
      const updateFacturaDto: UpdateFacturaDto = {
        id: 1,
        montoTotal: 120.0,
        metodoPago: 'tarjeta',
      };
      const mockResponse = { id: 1, ...updateFacturaDto };
      jest.spyOn(clientProxy, 'send').mockReturnValue(of(mockResponse));

      const result = await controller.update(1, updateFacturaDto);

      expect(clientProxy.send).toHaveBeenCalledWith(
        { cmd: 'update-factura' },
        { id: 1, ...updateFacturaDto },
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
        { cmd: 'delete-factura' },
        1,
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
