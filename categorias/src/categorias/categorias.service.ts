import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { Repository } from 'typeorm';
import { Categoria } from './entities/categoria.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) {}

  async create(createCategoriaDto: CreateCategoriaDto): Promise<Categoria> {
    try {
      const categoria = this.categoriaRepository.create(createCategoriaDto);
      return await this.categoriaRepository.save(categoria);
    } catch (error) {
      throw new InternalServerErrorException('Error al crear la categoría.');
    }
  }

  
  async findAll(): Promise<Categoria[]> {
    return await this.categoriaRepository.find();
  }

  async findOne(id: number): Promise<Categoria> {
    const categoria = await this.categoriaRepository.findOneBy({ id });
    if (!categoria) {
      throw new NotFoundException(`La categoría con id ${id} no fue encontrada.`);
    }
    return categoria;
  }

  async update(id: number, updateCategoriaDto: UpdateCategoriaDto): Promise<Categoria> {
    const categoria = await this.findOne(id); 
    Object.assign(categoria, updateCategoriaDto);
    return await this.categoriaRepository.save(categoria);
  }

  async remove(id: number): Promise<Categoria> {
    const categoria = await this.findOne(id);
    if (!categoria) {
      throw new Error(`categoria con id ${id} no encontrada`);
    }
    await this.categoriaRepository.remove(categoria);
    return {...categoria, id};
  }
}
