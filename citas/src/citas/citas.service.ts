import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';
import { Repository } from 'typeorm';
import { Cita } from './entities/cita.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CitasService {
  constructor(
    @InjectRepository(Cita)
    private readonly citaRepository: Repository<Cita>,
  ) {}

  async create(createCitaDto: CreateCitaDto): Promise<Cita> {
    try {
      const cita = this.citaRepository.create(createCitaDto);
      return await this.citaRepository.save(cita);
    } catch (error) {
      throw new InternalServerErrorException('Error al crear la cita.');
    }
  }

  async findAll(): Promise<Cita[]> {
    return await this.citaRepository.find({ relations: ['cliente', 'mascota', 'servicio'] });
  }

  async findOne(id: number): Promise<Cita> {
    const cita = await this.citaRepository.findOne({ where: { id }, relations: ['cliente', 'mascota', 'servicio'] });
    if (!cita) {
      throw new NotFoundException(`La cita con id ${id} no fue encontrada.`);
    }
    return cita;
  }

  async update(id: number, updateCitaDto: UpdateCitaDto): Promise<Cita> {
    const cita = await this.findOne(id);
    Object.assign(cita, updateCitaDto);
    return await this.citaRepository.save(cita);
  }

  async remove(id: number): Promise<Cita> {
    const cita = await this.findOne(id);
    if (!cita) {
      throw new Error(`Cita con id ${id} no encontrada`);
    }
    await this.citaRepository.remove(cita);
    return { ...cita, id };
  }
}
