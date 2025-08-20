'use client';

import { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { useAppDispatch, useAppSelector } from '@/shared/store';
import { fetchBancas, clearError } from '@/shared/store/slices/bancasSlice';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RoleOnly } from '@/components/auth/RoleOnly';
import { CreateBancaDialog } from './components/CreateBancaDialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Banca } from '@/shared/api/schemas';
import { EstadoBanca, Role } from '@/shared/api/types';
import { Plus, Search, Edit, Users, Trash2 } from 'lucide-react';

export default function BancasPage() {
  const dispatch = useAppDispatch();
  const { list: bancas, meta, status, error } = useAppSelector((state) => state.bancas);
  
  const [filters, setFilters] = useState({
    search: '',
    estado: '',
    page: 1,
    limit: 20,
  });
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchBancas({
      page: filters.page,
      limit: filters.limit,
      ...(filters.estado && { estado: filters.estado as 'activa' | 'inactiva' }),
    }));
  }, [dispatch, filters.page, filters.limit, filters.estado]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleSearch = () => {
    // En un caso real, implementarías búsqueda en el backend
    console.log('Búsqueda:', filters.search);
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const columns: ColumnDef<Banca>[] = [
    {
      accessorKey: 'nombre',
      header: 'Nombre',
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.getValue('nombre')}</p>
          <p className="text-sm text-muted-foreground">
            ID: {row.original.id.slice(0, 8)}...
          </p>
        </div>
      ),
    },
    {
      accessorKey: 'ubicacion',
      header: 'Ubicación',
      cell: ({ row }) => (
        <p className="max-w-xs truncate" title={row.getValue('ubicacion')}>
          {row.getValue('ubicacion')}
        </p>
      ),
    },
    {
      accessorKey: 'estado',
      header: 'Estado',
      cell: ({ row }) => {
        const estado = row.getValue('estado') as EstadoBanca;
        return (
          <Badge 
            variant={estado === EstadoBanca.ACTIVA ? 'default' : 'secondary'}
            className={estado === EstadoBanca.ACTIVA ? 'bg-green-100 text-green-800' : ''}
          >
            {estado}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Fecha de Creación',
      cell: ({ row }) => {
        const date = new Date(row.getValue('created_at'));
        return date.toLocaleDateString('es-DO');
      },
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <RoleOnly roles={[Role.ADMIN, Role.SUPERVISOR]}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" disabled>
                    <Edit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Pendiente en backend</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" disabled>
                    <Users className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Asignar vendedores - Pendiente en backend</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </RoleOnly>

          <RoleOnly roles={[Role.ADMIN]}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" disabled>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Pendiente en backend</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </RoleOnly>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bancas</h1>
          <p className="text-muted-foreground">
            Gestión de bancas de lotería
          </p>
        </div>
        <RoleOnly roles={[Role.ADMIN, Role.SUPERVISOR]}>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Banca
          </Button>
        </RoleOnly>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="flex gap-2">
                <Input
                  placeholder="Buscar por nombre o ubicación..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
                <Button onClick={handleSearch} variant="outline">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Select
              value={filters.estado}
              onValueChange={(value) => setFilters(prev => ({ ...prev, estado: value, page: 1 }))}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="activa">Activa</SelectItem>
                <SelectItem value="inactiva">Inactiva</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <DataTable
        columns={columns}
        data={bancas}
        loading={status === 'loading'}
        meta={meta}
        onPageChange={handlePageChange}
      />

      <CreateBancaDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
}