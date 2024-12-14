import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';
import { Repository } from 'typeorm';
import { Servicio } from './entities/servicio.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ServiciosService {
  constructor(
    @InjectRepository(Servicio)
    private readonly servicioRepository: Repository<Servicio>,
  ) {}

  async create(createServicioDto: CreateServicioDto): Promise<Servicio> {
    try {
      const servicio = this.servicioRepository.create(createServicioDto);
      return await this.servicioRepository.save(servicio);
    } catch (error) {
      throw new InternalServerErrorException('Error al crear el servicio.');
    }
  }

  async findAll(): Promise<Servicio[]> {
    return await this.servicioRepository.find();
  }

  async findOne(id: number): Promise<Servicio> {
    const servicio = await this.servicioRepository.findOneBy({ id });
    if (!servicio) {
      throw new NotFoundException(`El servicio con id ${id} no fue encontrado.`);
    }
    return servicio;
  }

  async update(id: number, updateServicioDto: UpdateServicioDto): Promise<Servicio> {
    const servicio = await this.findOne(id); 
    Object.assign(servicio, updateServicioDto);
    return await this.servicioRepository.save(servicio);
  }

  async remove(id: number): Promise<Servicio> {
    const servicio = await this.findOne(id);
    if (!servicio) {
      throw new Error(`Servicio con id ${id} no encontrado`);
    }
    await this.servicioRepository.remove(servicio);
    return { ...servicio, id };
  }
}
