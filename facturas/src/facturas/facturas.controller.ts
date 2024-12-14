import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FacturasService } from './facturas.service';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';

@Controller()
export class FacturasController {
  constructor(private readonly facturasService: FacturasService) {}

  @MessagePattern({ cmd: 'create-factura' })
  create(@Payload() createFacturaDto: CreateFacturaDto) {
    return this.facturasService.create(createFacturaDto);
  }

  @MessagePattern({ cmd: 'get-facturas' })
  findAll() {
    return this.facturasService.findAll();
  }

  @MessagePattern({ cmd: 'get-factura' })
  findOne(@Payload() id: number) {
    return this.facturasService.findOne(id);
  }

  @MessagePattern({ cmd: 'update-factura' })
  update(@Payload() updateFacturaDto: UpdateFacturaDto) {
    return this.facturasService.update(updateFacturaDto.id, updateFacturaDto);
  }

  @MessagePattern({ cmd: 'delete-factura' })
  remove(@Payload() id: number) {
    return this.facturasService.remove(id);
  }
}