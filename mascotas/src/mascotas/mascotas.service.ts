import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateMascotaDto } from './dto/create-mascota.dto';
import { UpdateMascotaDto } from './dto/update-mascota.dto';
import { Repository } from 'typeorm';
import { Mascota } from './entities/mascota.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MascotasService {
  constructor(
    @InjectRepository(Mascota)
    private readonly mascotaRepository: Repository<Mascota>,
  ) {}

  async create(createMascotaDto: CreateMascotaDto): Promise<Mascota> {
    try {
      const mascota = this.mascotaRepository.create(createMascotaDto);
      return await this.mascotaRepository.save(mascota);
    } catch (error) {
      throw new InternalServerErrorException('Error al crear la mascota.');
    }
  }

  async findAll(): Promise<Mascota[]> {
    return await this.mascotaRepository.find({ relations: ['cliente'] });
  }

  async findOne(id: number): Promise<Mascota> {
    const mascota = await this.mascotaRepository.findOne({ where: { id }, relations: ['cliente'] });
    if (!mascota) {
      throw new NotFoundException(`La mascota con id ${id} no fue encontrada.`);
    }
    return mascota;
  }

  async update(id: number, updateMascotaDto: UpdateMascotaDto): Promise<Mascota> {
    const mascota = await this.findOne(id); 
    Object.assign(mascota, updateMascotaDto);
    return await this.mascotaRepository.save(mascota);
  }

  async remove(id: number): Promise<Mascota> {
    const mascota = await this.findOne(id);
    if (!mascota) {
      throw new Error(`Mascota con id ${id} no encontrada`);
    }
    await this.mascotaRepository.remove(mascota);
    return { ...mascota, id };
  }
}