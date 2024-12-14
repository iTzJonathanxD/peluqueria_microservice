import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Controller()
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @MessagePattern({ cmd: 'create-categoria' })
  create(@Payload() createCategoriaDto: CreateCategoriaDto) {
    return this.categoriasService.create(createCategoriaDto);
  }

  @MessagePattern({ cmd: 'get-categorias' })
  findAll() {
    return this.categoriasService.findAll();
  }

  @MessagePattern({ cmd: 'get-categoria' })
  findOne(@Payload() id: number) {
    return this.categoriasService.findOne(id);
  }

  @MessagePattern({ cmd: 'update-categoria' })
  update(@Payload() updateCategoriaDto: UpdateCategoriaDto) {
    return this.categoriasService.update(updateCategoriaDto.id, updateCategoriaDto);
  }

  @MessagePattern({ cmd: 'delete-categoria' })
  remove(@Payload() id: number) {
    return this.categoriasService.remove(id);
  }
}