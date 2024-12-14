import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ServiciosService } from './servicios.service';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';

@Controller()
export class ServiciosController {
  constructor(private readonly serviciosService: ServiciosService) {}

  @MessagePattern({ cmd: 'create-servicio' })
  create(@Payload() createServicioDto: CreateServicioDto) {
    return this.serviciosService.create(createServicioDto);
  }

  @MessagePattern({ cmd: 'get-servicios' })
  findAll() {
    return this.serviciosService.findAll();
  }

  @MessagePattern({ cmd: 'get-servicio' })
  findOne(@Payload() id: number) {
    return this.serviciosService.findOne(id);
  }

  @MessagePattern({ cmd: 'update-servicio' })
  update(@Payload() updateServicioDto: UpdateServicioDto) {
    return this.serviciosService.update(updateServicioDto.id, updateServicioDto);
  }

  @MessagePattern({ cmd: 'delete-servicio' })
  remove(@Payload() id: number) {
    return this.serviciosService.remove(id);
  }
}
