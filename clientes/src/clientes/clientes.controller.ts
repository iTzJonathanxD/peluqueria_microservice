import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Controller()
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @MessagePattern({ cmd: 'create-cliente' })
  create(@Payload() createClienteDto: CreateClienteDto) {
    return this.clientesService.create(createClienteDto);
  }

  @MessagePattern({ cmd: 'get-clientes' })
  findAll() {
    return this.clientesService.findAll();
  }

  @MessagePattern({ cmd: 'get-cliente' })
  findOne(@Payload() id: number) {
    return this.clientesService.findOne(id);
  }

  @MessagePattern({ cmd: 'update-cliente' })
  update(@Payload() updateClienteDto: UpdateClienteDto) {
    return this.clientesService.update(updateClienteDto.id, updateClienteDto);
  }

  @MessagePattern({ cmd: 'delete-cliente' })
  remove(@Payload() id: number) {
    return this.clientesService.remove(id);
  }
}