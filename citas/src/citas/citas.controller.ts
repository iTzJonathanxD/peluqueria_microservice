import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CitasService } from './citas.service';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';

@Controller()
export class CitasController {
  constructor(private readonly citasService: CitasService) {}

  @MessagePattern({ cmd: 'create-cita' })
  create(@Payload() createCitaDto: CreateCitaDto) {
    return this.citasService.create(createCitaDto);
  }

  @MessagePattern({ cmd: 'get-citas' })
  findAll() {
    return this.citasService.findAll();
  }

  @MessagePattern({ cmd: 'get-cita' })
  findOne(@Payload() id: number) {
    return this.citasService.findOne(id);
  }

  @MessagePattern({ cmd: 'update-cita' })
  update(@Payload() updateCitaDto: UpdateCitaDto) {
    return this.citasService.update(updateCitaDto.id, updateCitaDto);
  }

  @MessagePattern({ cmd: 'delete-cita' })
  remove(@Payload() id: number) {
    return this.citasService.remove(id);
  }
}
