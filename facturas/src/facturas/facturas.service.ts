import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';
import { Repository } from 'typeorm';
import { Factura } from './entities/factura.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FacturasService {
  constructor(
    @InjectRepository(Factura)
    private readonly facturaRepository: Repository<Factura>,
  ) {}

  async create(createFacturaDto: CreateFacturaDto): Promise<Factura> {
    try {
      const factura = this.facturaRepository.create(createFacturaDto);
      return await this.facturaRepository.save(factura);
    } catch (error) {
      throw new InternalServerErrorException('Error al crear la factura.');
    }
  }

  async findAll(): Promise<Factura[]> {
    return await this.facturaRepository.find({ relations: ['cita'] });
  }

  async findOne(id: number): Promise<Factura> {
    const factura = await this.facturaRepository.findOne({ where: { id }, relations: ['cita'] });
    if (!factura) {
      throw new NotFoundException(`La factura con id ${id} no fue encontrada.`);
    }
    return factura;
  }

  async update(id: number, updateFacturaDto: UpdateFacturaDto): Promise<Factura> {
    const factura = await this.findOne(id);
    Object.assign(factura, updateFacturaDto);
    return await this.facturaRepository.save(factura);
  }

  async remove(id: number): Promise<Factura> {
    const factura = await this.findOne(id);
    if (!factura) {
      throw new Error(`Factura con id ${id} no encontrada`);
    }
    await this.facturaRepository.remove(factura);
    return { ...factura, id };
  }
}
