import { Controller, Get, Res, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Response } from 'express';
import { jsPDF } from 'jspdf';
import { NATS_SERVICE } from '../config';

@Controller('reporte')
export class PdfController {
    constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

    @Get('mascotas')
    async generarPDFMascotas(@Res() res: Response): Promise<void> {
        try {
            const mascotas = await firstValueFrom(
                this.client.send({ cmd: 'get-mascotas' }, {}),
            );

            if (!mascotas || mascotas.length === 0) {
                res.status(404).send('No hay datos para generar el reporte.');
                return;
            }

            const doc = new jsPDF({ orientation: 'landscape' });
            const pageWidth = 297;
            const marginX = 10;
            const marginY = 20;
            const lineHeight = 8;
            let currentY = marginY;

            const drawHeaders = () => {
                doc.setFillColor(200, 200, 200);
                doc.rect(marginX, currentY, pageWidth - 2 * marginX, lineHeight, 'F');
                doc.setFontSize(12);
                doc.text('ID', marginX + 10, currentY + 6);
                doc.text('Nombre', marginX + 40, currentY + 6);
                doc.text('Raza', marginX + 90, currentY + 6);
                doc.text('Edad', marginX + 140, currentY + 6);
                doc.text('Peso', marginX + 190, currentY + 6);
                currentY += lineHeight;
                doc.line(marginX, currentY, pageWidth - marginX, currentY);
            };

            drawHeaders();

            mascotas.forEach((mascota: any) => {
                if (currentY + lineHeight > 200) {
                    doc.addPage();
                    currentY = marginY;
                    drawHeaders();
                }

                doc.setFontSize(10);
                doc.text(String(mascota.id), marginX + 10, currentY + 6);
                doc.text(mascota.nombre, marginX + 40, currentY + 6);
                doc.text(mascota.raza || 'N/A', marginX + 90, currentY + 6);
                doc.text(mascota.edad ? String(mascota.edad) : 'N/A', marginX + 140, currentY + 6);
                doc.text(mascota.peso ? String(mascota.peso) : 'N/A', marginX + 190, currentY + 6);
                currentY += lineHeight;
                doc.line(marginX, currentY, pageWidth - marginX, currentY);
            });

            const pdfBuffer = doc.output('arraybuffer');

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="Mascotas_Report.pdf"');
            res.send(Buffer.from(pdfBuffer));
        } catch (error) {
            console.error('Error generando el PDF:', error.message);
            res.status(500).send(`Error al generar el PDF: ${error.message}`);
        }
    }

    @Get('servicios')
    async generarPDFServicios(@Res() res: Response): Promise<void> {
        try {
            const servicios = await firstValueFrom(
                this.client.send({ cmd: 'get-servicios' }, {}),
            );

            if (!servicios || servicios.length === 0) {
                res.status(404).send('No hay datos para generar el reporte.');
                return;
            }

            const doc = new jsPDF({ orientation: 'landscape' });
            const pageWidth = 297;
            const marginX = 10;
            const marginY = 20;
            const lineHeight = 8;
            let currentY = marginY;

            const drawHeaders = () => {
                doc.setFillColor(200, 200, 200);
                doc.rect(marginX, currentY, pageWidth - 2 * marginX, lineHeight, 'F');
                doc.setFontSize(12);
                doc.text('ID', marginX + 10, currentY + 6);
                doc.text('Nombre', marginX + 40, currentY + 6);
                doc.text('Precio', marginX + 90, currentY + 6);
                doc.text('Duración', marginX + 140, currentY + 6);
                doc.text('Categoría', marginX + 190, currentY + 6);
                currentY += lineHeight;
                doc.line(marginX, currentY, pageWidth - marginX, currentY);
            };

            drawHeaders();

            servicios.forEach((servicio: any) => {
                if (currentY + lineHeight > 200) {
                    doc.addPage();
                    currentY = marginY;
                    drawHeaders();
                }

                doc.setFontSize(10);
                doc.text(String(servicio.id), marginX + 10, currentY + 6);
                doc.text(servicio.nombre, marginX + 40, currentY + 6);
                doc.text(servicio.precio.toFixed(2), marginX + 90, currentY + 6);
                doc.text(String(servicio.duracion), marginX + 140, currentY + 6);
                doc.text(servicio.categoria?.nombre || 'N/A', marginX + 190, currentY + 6);
                currentY += lineHeight;
                doc.line(marginX, currentY, pageWidth - marginX, currentY);
            });

            const pdfBuffer = doc.output('arraybuffer');

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="Servicios_Report.pdf"');
            res.send(Buffer.from(pdfBuffer));
        } catch (error) {
            console.error('Error generando el PDF:', error.message);
            res.status(500).send(`Error al generar el PDF: ${error.message}`);
        }
    }

    @Get('citas')
    async generarPDFCitas(@Res() res: Response): Promise<void> {
        try {
            const citas = await firstValueFrom(
                this.client.send({ cmd: 'get-citas' }, {}),
            );

            if (!citas || citas.length === 0) {
                res.status(404).send('No hay datos para generar el reporte.');
                return;
            }

            const doc = new jsPDF({ orientation: 'landscape' });
            const pageWidth = 297;
            const marginX = 10;
            const marginY = 20;
            const lineHeight = 8;
            let currentY = marginY;

            const drawHeaders = () => {
                doc.setFillColor(200, 200, 200);
                doc.rect(marginX, currentY, pageWidth - 2 * marginX, lineHeight, 'F');
                doc.setFontSize(12);
                doc.text('ID', marginX + 10, currentY + 6);
                doc.text('Cliente', marginX + 40, currentY + 6);
                doc.text('Mascota', marginX + 90, currentY + 6);
                doc.text('Servicio', marginX + 140, currentY + 6);
                doc.text('Fecha', marginX + 190, currentY + 6);
                doc.text('Estado', marginX + 240, currentY + 6);
                currentY += lineHeight;
                doc.line(marginX, currentY, pageWidth - marginX, currentY);
            };

            drawHeaders();

            citas.forEach((cita: any) => {
                if (currentY + lineHeight > 200) {
                    doc.addPage();
                    currentY = marginY;
                    drawHeaders();
                }

                doc.setFontSize(10);
                doc.text(String(cita.id), marginX + 10, currentY + 6);
                doc.text(cita.cliente?.nombre || 'N/A', marginX + 40, currentY + 6);
                doc.text(cita.mascota?.nombre || 'N/A', marginX + 90, currentY + 6);
                doc.text(cita.servicio?.nombre || 'N/A', marginX + 140, currentY + 6);
                doc.text(new Date(cita.fechaCita).toLocaleString(), marginX + 190, currentY + 6);
                doc.text(cita.estado, marginX + 240, currentY + 6);
                currentY += lineHeight;
                doc.line(marginX, currentY, pageWidth - marginX, currentY);
            });

            const pdfBuffer = doc.output('arraybuffer');

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="Citas_Report.pdf"');
            res.send(Buffer.from(pdfBuffer));
        } catch (error) {
            console.error('Error generando el PDF:', error.message);
            res.status(500).send(`Error al generar el PDF: ${error.message}`);
        }
    }

    @Get('clientes')
    async generarPDFClientes(@Res() res: Response): Promise<void> {
        try {
            const clientes = await firstValueFrom(
                this.client.send({ cmd: 'get-clientes' }, {}),
            );

            if (!clientes || clientes.length === 0) {
                res.status(404).send('No hay datos para generar el reporte.');
                return;
            }

            const doc = new jsPDF({ orientation: 'landscape' });
            const pageWidth = 297;
            const marginX = 10;
            const marginY = 20;
            const lineHeight = 8;
            const maxLinesPerPage = 22;
            let currentY = marginY;

            const drawHeaders = () => {
                doc.setFillColor(200, 200, 200);
                doc.rect(marginX, currentY, pageWidth - 2 * marginX, lineHeight, 'F');
                doc.setFontSize(12);
                doc.setTextColor(0, 0, 0);
                doc.text('ID', marginX + 10, currentY + 6);
                doc.text('Nombre', marginX + 40, currentY + 6);
                doc.text('Teléfono', marginX + 90, currentY + 6);
                doc.text('Email', marginX + 140, currentY + 6);
                doc.text('Dirección', marginX + 190, currentY + 6);
                currentY += lineHeight;
                doc.line(marginX, currentY, pageWidth - marginX, currentY);
            };

            drawHeaders();

            clientes.forEach((cliente: any) => {
                if (currentY + lineHeight > 200) {
                    doc.addPage();
                    currentY = marginY;
                    drawHeaders();
                }

                doc.setFontSize(10);
                doc.text(String(cliente.id), marginX + 10, currentY + 6);
                doc.text(cliente.nombre, marginX + 40, currentY + 6);
                doc.text(cliente.telefono, marginX + 90, currentY + 6);
                doc.text(cliente.email || 'N/A', marginX + 140, currentY + 6);
                doc.text(cliente.direccion || 'N/A', marginX + 190, currentY + 6);
                currentY += lineHeight;
                doc.line(marginX, currentY, pageWidth - marginX, currentY);
            });

            const pdfBuffer = doc.output('arraybuffer');

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="Clientes_Report.pdf"');
            res.send(Buffer.from(pdfBuffer));
        } catch (error) {
            console.error('Error generando el PDF:', error.message);
            res.status(500).send(`Error al generar el PDF: ${error.message}`);
        }
    }
    @Get('facturas')
    async generarPDFFacturas(@Res() res: Response): Promise<void> {
        try {
            const facturas = await firstValueFrom(
                this.client.send({ cmd: 'get-facturas' }, {}),
            );

            if (!facturas || facturas.length === 0) {
                res.status(404).send('No hay datos para generar el reporte.');
                return;
            }

            const doc = new jsPDF({ orientation: 'landscape' });
            const pageWidth = 297;
            const marginX = 10;
            const marginY = 20;
            const lineHeight = 8;
            const maxLinesPerPage = 22;
            let currentY = marginY;

            const drawHeaders = () => {
                doc.setFillColor(200, 200, 200);
                doc.rect(marginX, currentY, pageWidth - 2 * marginX, lineHeight, 'F');
                doc.setFontSize(12);
                doc.setTextColor(0, 0, 0);
                doc.text('ID', marginX + 10, currentY + 6);
                doc.text('Cita ID', marginX + 40, currentY + 6);
                doc.text('Monto Total', marginX + 90, currentY + 6);
                doc.text('Método Pago', marginX + 140, currentY + 6);
                doc.text('Fecha Pago', marginX + 190, currentY + 6);
                currentY += lineHeight;
                doc.line(marginX, currentY, pageWidth - marginX, currentY);
            };

            drawHeaders();

            facturas.forEach((factura: any) => {
                if (currentY + lineHeight > 200) {
                    doc.addPage();
                    currentY = marginY;
                    drawHeaders();
                }

                doc.setFontSize(10);
                doc.text(String(factura.id), marginX + 10, currentY + 6);
                doc.text(String(factura.citaId), marginX + 40, currentY + 6);
                doc.text(factura.montoTotal.toFixed(2), marginX + 90, currentY + 6);
                doc.text(factura.metodoPago, marginX + 140, currentY + 6);
                doc.text(new Date(factura.fechaPago).toLocaleString(), marginX + 190, currentY + 6);
                currentY += lineHeight;
                doc.line(marginX, currentY, pageWidth - marginX, currentY);
            });

            const pdfBuffer = doc.output('arraybuffer');

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="Facturas_Report.pdf"');
            res.send(Buffer.from(pdfBuffer));
        } catch (error) {
            console.error('Error generando el PDF:', error.message);
            res.status(500).send(`Error al generar el PDF: ${error.message}`);
        }
    }

    @Get('categorias')
    async generarPDFCategorias(@Res() res: Response): Promise<void> {
        try {
            const categorias = await firstValueFrom(
                this.client.send({ cmd: 'get-categorias' }, {}),
            );

            if (!categorias || categorias.length === 0) {
                res.status(404).send('No hay datos para generar el reporte.');
                return;
            }

            const doc = new jsPDF({ orientation: 'landscape' });
            const pageWidth = 297;
            const marginX = 10;
            const marginY = 20;
            const lineHeight = 8;
            const maxLinesPerPage = 22;
            let currentY = marginY;

            const drawHeaders = () => {
                doc.setFillColor(200, 200, 200);
                doc.rect(marginX, currentY, pageWidth - 2 * marginX, lineHeight, 'F');
                doc.setFontSize(12);
                doc.setTextColor(0, 0, 0);
                doc.text('ID', marginX + 10, currentY + 6);
                doc.text('Nombre', marginX + 40, currentY + 6);
                doc.text('Descripción', marginX + 90, currentY + 6);
                currentY += lineHeight;
                doc.line(marginX, currentY, pageWidth - marginX, currentY);
            };

            drawHeaders();

            categorias.forEach((categoria: any) => {
                if (currentY + lineHeight > 200) {
                    doc.addPage();
                    currentY = marginY;
                    drawHeaders();
                }

                doc.setFontSize(10);
                doc.text(String(categoria.id), marginX + 10, currentY + 6);
                doc.text(categoria.nombre, marginX + 40, currentY + 6);
                doc.text(categoria.descripcion || 'N/A', marginX + 90, currentY + 6);
                currentY += lineHeight;
                doc.line(marginX, currentY, pageWidth - marginX, currentY);
            });

            const pdfBuffer = doc.output('arraybuffer');

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="Categorias_Report.pdf"');
            res.send(Buffer.from(pdfBuffer));
        } catch (error) {
            console.error('Error generando el PDF:', error.message);
            res.status(500).send(`Error al generar el PDF: ${error.message}`);
        }
    }
}



