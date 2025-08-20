'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch } from '@/shared/store';
import { createJugada } from '@/shared/store/slices/jugadasSlice';
import { CreateJugadaSchema, type CreateJugada } from '@/shared/api/schemas';
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
import { TextField } from '@/components/forms/FormField';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface CreateJugadaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateJugadaDialog({ open, onOpenChange }: CreateJugadaDialogProps) {
  const dispatch = useAppDispatch();
  const [numeroInput, setNumeroInput] = useState('');

  const form = useForm<CreateJugada>({
    resolver: zodResolver(CreateJugadaSchema),
    defaultValues: {
      banca_id: '',
      vendedor_id: '',
      sorteo_id: '',
      numeros: [],
      monto: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'numeros',
  });

  const addNumero = () => {
    const numero = parseInt(numeroInput, 10);
    if (numero >= 0 && numero <= 99 && !form.getValues('numeros').includes(numero)) {
      append(numero);
      setNumeroInput('');
    } else {
      toast.error('Número inválido o ya agregado');
    }
  };

  async function onSubmit(data: CreateJugada) {
    try {
      const result = await dispatch(createJugada(data));
      if (createJugada.fulfilled.match(result)) {
        toast.success('Jugada creada exitosamente');
        form.reset();
        onOpenChange(false);
      } else {
        toast.error('Error al crear la jugada');
      }
    } catch (error) {
      toast.error('Error al crear la jugada');
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nueva Jugada</DialogTitle>
          <DialogDescription>
            Registrar una nueva jugada. Todos los campos son obligatorios.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <TextField
                control={form.control}
                name="banca_id"
                label="ID de Banca"
                placeholder="UUID de la banca"
                description="En producción sería un selector"
              />

              <TextField
                control={form.control}
                name="vendedor_id"
                label="ID de Vendedor"
                placeholder="UUID del vendedor"
                description="En producción sería un selector"
              />
            </div>

            <TextField
              control={form.control}
              name="sorteo_id"
              label="ID de Sorteo"
              placeholder="UUID del sorteo"
              description="En producción sería un selector"
            />

            <div>
              <Label>Números (0-99)</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  type="number"
                  min="0"
                  max="99"
                  placeholder="Número"
                  value={numeroInput}
                  onChange={(e) => setNumeroInput(e.target.value)}
                />
                <Button type="button" onClick={addNumero} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {form.getValues('numeros').length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {form.getValues('numeros').map((numero, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {numero.toString().padStart(2, '0')}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <TextField
              control={form.control}
              name="monto"
              label="Monto"
              type="number"
              placeholder="100.00"
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
                Crear Jugada
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}