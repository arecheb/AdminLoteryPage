'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch } from '@/shared/store';
import { createBanca } from '@/shared/store/slices/bancasSlice';
import { CreateBancaSchema, type CreateBanca } from '@/shared/api/schemas';
import { EstadoBanca } from '@/shared/api/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { TextField, SelectField } from '@/components/forms/FormField';
import { toast } from 'sonner';

interface CreateBancaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const estadoOptions = [
  { value: EstadoBanca.ACTIVA, label: 'Activa' },
  { value: EstadoBanca.INACTIVA, label: 'Inactiva' },
];

export function CreateBancaDialog({ open, onOpenChange }: CreateBancaDialogProps) {
  const dispatch = useAppDispatch();

  const form = useForm<CreateBanca>({
    resolver: zodResolver(CreateBancaSchema),
    defaultValues: {
      nombre: '',
      ubicacion: '',
      estado: EstadoBanca.ACTIVA,
      ip_whitelist: [],
    },
  });

  async function onSubmit(data: CreateBanca) {
    try {
      const result = await dispatch(createBanca(data));
      if (createBanca.fulfilled.match(result)) {
        toast.success('Banca creada exitosamente');
        form.reset();
        onOpenChange(false);
      } else {
        toast.error('Error al crear la banca');
      }
    } catch (error) {
      toast.error('Error al crear la banca');
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nueva Banca</DialogTitle>
          <DialogDescription>
            Crear una nueva banca de lotería. Todos los campos son obligatorios.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <TextField
              control={form.control}
              name="nombre"
              label="Nombre"
              placeholder="Ej: Banca Central"
            />

            <TextField
              control={form.control}
              name="ubicacion"
              label="Ubicación"
              placeholder="Ej: Calle Principal #123, Santo Domingo"
            />

            <SelectField
              control={form.control}
              name="estado"
              label="Estado Inicial"
              options={estadoOptions}
              placeholder="Seleccionar estado"
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                Crear Banca
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}