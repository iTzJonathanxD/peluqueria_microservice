import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MascotasService } from './mascotas.service';
import { CreateMascotaDto } from './dto/create-mascota.dto';
import { UpdateMascotaDto } from './dto/update-mascota.dto';

@Controller()
export class MascotasController {
  constructor(private readonly mascotasService: MascotasService) {}

  @MessagePattern({ cmd: 'create-mascota' })
  create(@Payload() createMascotaDto: CreateMascotaDto) {
    return this.mascotasService.create(createMascotaDto);
  }

  @MessagePattern({ cmd: 'get-mascotas' })
  findAll() {
    return this.mascotasService.findAll();
  }

  @MessagePattern({ cmd: 'get-mascota' })
  findOne(@Payload() id: number) {
    return this.mascotasService.findOne(id);
  }

  @MessagePattern({ cmd: 'update-mascota' })
  update(@Payload() updateMascotaDto: UpdateMascotaDto) {
    return this.mascotasService.update(updateMascotaDto.id, updateMascotaDto);
  }

  @MessagePattern({ cmd: 'delete-mascota' })
  remove(@Payload() id: number) {
    return this.mascotasService.remove(id);
  }
}
