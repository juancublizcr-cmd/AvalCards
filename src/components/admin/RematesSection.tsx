import { useState } from "react";
import {
  Gavel,
  Plus,
  ExternalLink,
  Clock,
  DollarSign,
  Users,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  MessageCircle,
  Car,
  AlertCircle,
  Eye,
  Trophy,
  Pencil,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  fetchRematesLocal,
  saveRematesLocal,
  actualizarEstadoRemateLocal,
  actualizarEstadoPujaLocal,
  type Remate,
  type Puja,
} from "@/lib/remates-store";
import { toast } from "sonner";

export function RematesSection() {
  const [remates, setRemates] = useState<Remate[]>(() => fetchRematesLocal());
  const [modalNuevo, setModalNuevo] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalPujaDetalle, setModalPujaDetalle] = useState<Puja | null>(null);

  // Remate activo seleccionado para editar
  const remateActivo = remates.find((r) => r.estado === "activo") ?? remates[0];

  // Estado del formulario de edición
  const [editTitulo, setEditTitulo] = useState("");
  const [editSubtitulo, setEditSubtitulo] = useState("");
  const [editDescripcion, setEditDescripcion] = useState("");
  const [editPrecioSalida, setEditPrecioSalida] = useState(35000000);
  const [editPrecioReserva, setEditPrecioReserva] = useState(42000000);
  const [editIncremento, setEditIncremento] = useState(250000);
  const [editFechaFin, setEditFechaFin] = useState("");
  const [editGanadorNombre, setEditGanadorNombre] = useState("");
  const [editGanadorToken, setEditGanadorToken] = useState("");
  const [editGanadorDeclaracion, setEditGanadorDeclaracion] = useState("");
  const [editImagenPrincipal, setEditImagenPrincipal] = useState("");
  const [editMotor, setEditMotor] = useState("");
  const [editTransmision, setEditTransmision] = useState("");

  const abrirModalEdicion = () => {
    if (!remateActivo) return;
    setEditTitulo(remateActivo.titulo);
    setEditSubtitulo(remateActivo.subtitulo);
    setEditDescripcion(remateActivo.descripcion);
    setEditPrecioSalida(remateActivo.precioSalida);
    setEditPrecioReserva(remateActivo.precioReserva);
    setEditIncremento(remateActivo.incrementoMinimo);
    setEditFechaFin(new Date(remateActivo.fechaFin).toISOString().slice(0, 16));
    setEditGanadorNombre(remateActivo.ganadorSorteo.nombre);
    setEditGanadorToken(remateActivo.ganadorSorteo.tokenGanador);
    setEditGanadorDeclaracion(remateActivo.ganadorSorteo.declaracion);
    setEditImagenPrincipal(remateActivo.imagenes[0] ?? "");
    setEditMotor(remateActivo.vehiculoInfo.motor);
    setEditTransmision(remateActivo.vehiculoInfo.transmision);
    setModalEditar(true);
  };

  const handleGuardarEdicion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remateActivo) return;

    const actualizados = remates.map((r) => {
      if (r.id !== remateActivo.id) return r;
      return {
        ...r,
        titulo: editTitulo,
        subtitulo: editSubtitulo,
        descripcion: editDescripcion,
        precioSalida: Number(editPrecioSalida),
        precioReserva: Number(editPrecioReserva),
        incrementoMinimo: Number(editIncremento),
        fechaFin: new Date(editFechaFin).toISOString(),
        imagenes: [editImagenPrincipal, ...(r.imagenes.slice(1))],
        ganadorSorteo: {
          ...r.ganadorSorteo,
          nombre: editGanadorNombre,
          tokenGanador: editGanadorToken,
          declaracion: editGanadorDeclaracion,
        },
        vehiculoInfo: {
          ...r.vehiculoInfo,
          motor: editMotor,
          transmision: editTransmision,
        },
      };
    });

    saveRematesLocal(actualizados);
    setRemates(actualizados);
    setModalEditar(false);
    toast.success("¡Datos del remate actualizados correctamente!");
  };

  // Formulario nuevo remate
  const [nuevoTitulo, setNuevoTitulo] = useState("Toyota Hilux GR-Sport 2026 0KM");
  const [nuevoSubtitulo, setNuevoSubtitulo] = useState("Adjudicado en Sorteo Oficial · Puesto a Remate VIP");
  const [nuevoPrecioSalida, setNuevoPrecioSalida] = useState(28000000);
  const [nuevoPrecioReserva, setNuevoPrecioReserva] = useState(33000000);
  const [nuevoIncremento, setNuevoIncremento] = useState(250000);
  const [nuevaFechaFin, setNuevaFechaFin] = useState(
    new Date(Date.now() + 3600 * 1000 * 72).toISOString().slice(0, 16)
  );
  const [nuevoGanador, setNuevoGanador] = useState("Carlos Solano M.");
  const [nuevoToken, setNuevoToken] = useState("#91204");
  const [nuevaImagen, setNuevaImagen] = useState("/premio-subaru.jpg");

  const recargar = () => {
    setRemates(fetchRematesLocal());
  };

  const cambiarEstadoRemate = (id: string, estado: Remate["estado"]) => {
    actualizarEstadoRemateLocal(id, estado);
    recargar();
    toast.success(`Estado de la subasta cambiado a: ${estado.toUpperCase()}`);
  };

  const cambiarEstadoPuja = (remateId: string, pujaId: string, estado: Puja["estado"]) => {
    actualizarEstadoPujaLocal(remateId, pujaId, estado);
    recargar();
    toast.success(`Puja ${estado === "aprobada" ? "Aprobada" : "Rechazada/Descalificada"}`);
  };

  const handleCrearRemate = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevo: Remate = {
      id: `remate-${Date.now()}`,
      titulo: nuevoTitulo,
      subtitulo: nuevoSubtitulo,
      descripcion:
        "Vehículo nuevo de agencia adjudicado en el Gran Evento Promocional Aval. Puesto a remate voluntario con custodia notarial de Aval Motors.",
      imagenes: [nuevaImagen],
      precioSalida: Number(nuevoPrecioSalida),
      precioReserva: Number(nuevoPrecioReserva),
      incrementoMinimo: Number(nuevoIncremento),
      fechaInicio: new Date().toISOString(),
      fechaFin: new Date(nuevaFechaFin).toISOString(),
      estado: "activo",
      ganadorSorteo: {
        nombre: nuevoGanador,
        tokenGanador: nuevoToken,
        ciudad: "San José, Costa Rica",
        declaracion:
          "Opté por rematar el vehículo a través de Aval Community para recibir el dinero en efectivo garantizado por notaría.",
      },
      vehiculoInfo: {
        marca: "Toyota",
        modelo: "Hilux GR-Sport",
        ano: 2026,
        kilometraje: "20 km (Entrega de Agencia)",
        motor: "2.8L Turbo Diesel 224 HP",
        potencia: "224 HP",
        transmision: "Automática 6 Vel.",
        traccion: "4x4 con Bloqueo Trasero",
        combustible: "Diésel",
        color: "Rojo / Negro Bitono",
        traspasoIncluido: true,
        marchamoAlDia: true,
        garantiaAgencia: "3 Años o 100,000 km",
        inspeccionDekra: true,
      },
      comisionPlataformaPct: 5,
      depositoRequerido: 50000,
      pujas: [],
    };

    const actualizados = [nuevo, ...remates];
    saveRematesLocal(actualizados);
    setRemates(actualizados);
    setModalNuevo(false);
    toast.success("¡Nuevo remate creado y publicado exitosamente!");
  };

  // Métricas
  const totalPujas = remates.reduce((acc, r) => acc + r.pujas.length, 0);
  const mejorPujaActiva =
    remateActivo?.pujas
      .filter((p) => p.estado === "aprobada")
      .reduce((max, p) => (p.monto > max ? p.monto : max), remateActivo?.precioSalida || 0) || 0;
  const comisionEstimada = Math.round(mejorPujaActiva * ((remateActivo?.comisionPlataformaPct || 5) / 100));

  return (
    <div className="space-y-6">
      {/* Header con Acciones */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
              <Gavel className="size-5" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Sala de Remates & Subastas VIP
            </h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Gestión de vehículos adjudicados en sorteo que los ganadores decidieron poner en subasta pública.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
          >
            <Link to="/remates">
              <Eye className="mr-1.5 size-4" />
              Ver Sala en Vivo
              <ExternalLink className="ml-1 size-3" />
            </Link>
          </Button>

          <Button
            size="sm"
            onClick={() => setModalNuevo(true)}
            className="bg-gradient-to-r from-amber-500 to-amber-600 font-bold text-white shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:brightness-110"
          >
            <Plus className="mr-1.5 size-4" />
            Publicar Nuevo Remate
          </Button>
        </div>
      </div>

      {/* Tarjetas de Métricas VIP */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Mejor Oferta Actual</span>
            <DollarSign className="size-4 text-emerald-500" />
          </div>
          <p className="mt-2 font-display text-xl font-bold text-foreground sm:text-2xl">
            ₡{mejorPujaActiva.toLocaleString("es-CR")}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold">
            {mejorPujaActiva > (remateActivo?.precioSalida || 0) ? "Por encima del precio base" : "Precio base de salida"}
          </span>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Total Pujas Recibidas</span>
            <Users className="size-4 text-amber-500" />
          </div>
          <p className="mt-2 font-display text-xl font-bold text-foreground sm:text-2xl">
            {totalPujas}
          </p>
          <span className="text-[11px] text-muted-foreground">Postores registrados</span>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Comisión Aval ({remateActivo?.comisionPlataformaPct || 5}%)</span>
            <Trophy className="size-4 text-primary" />
          </div>
          <p className="mt-2 font-display text-xl font-bold text-primary sm:text-2xl">
            ₡{comisionEstimada.toLocaleString("es-CR")}
          </p>
          <span className="text-[11px] text-muted-foreground">Ganancia neta plataforma</span>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Estado Subasta</span>
            <Clock className="size-4 text-blue-500" />
          </div>
          <div className="mt-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ${
                remateActivo?.estado === "activo"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : remateActivo?.estado === "pausado"
                  ? "bg-amber-500/10 text-amber-600"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <span className="size-1.5 rounded-full bg-current animate-pulse" />
              {remateActivo?.estado || "Sin remates"}
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground">
            Cierra: {remateActivo?.fechaFin ? new Date(remateActivo.fechaFin).toLocaleDateString("es-CR") : "-"}
          </span>
        </div>
      </div>

      {/* Remate Activo / Detalles de Control */}
      {remateActivo && (
        <div className="rounded-xl border border-amber-500/30 bg-card p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-border pb-4">
            <div className="flex items-start gap-3">
              <div className="size-16 shrink-0 overflow-hidden rounded-lg border border-border">
                <img
                  src={remateActivo.imagenes[0]}
                  alt={remateActivo.titulo}
                  className="size-full object-cover"
                />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[11px] font-bold text-amber-500">
                    REMATE DESTACADO
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Ganador Original: <strong className="text-foreground">{remateActivo.ganadorSorteo.nombre}</strong> (Token {remateActivo.ganadorSorteo.tokenGanador})
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground sm:text-xl">
                  {remateActivo.titulo}
                </h3>
                <p className="text-xs text-muted-foreground">{remateActivo.subtitulo}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                onClick={abrirModalEdicion}
                className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 font-bold border border-amber-500/40"
              >
                <Pencil className="mr-1.5 size-4" />
                Editar Datos del Remate
              </Button>
              {remateActivo.estado === "activo" ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => cambiarEstadoRemate(remateActivo.id, "pausado")}
                  className="border-amber-500/50 text-amber-500 hover:bg-amber-500/10"
                >
                  Pausar Subasta
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => cambiarEstadoRemate(remateActivo.id, "activo")}
                  className="border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/10"
                >
                  Activar Subasta
                </Button>
              )}

              <Button
                size="sm"
                variant="destructive"
                onClick={() => cambiarEstadoRemate(remateActivo.id, "finalizado")}
              >
                Cerrar Remate
              </Button>

              <Button
                size="sm"
                onClick={() => cambiarEstadoRemate(remateActivo.id, "adjudicado")}
                className="bg-emerald-600 font-bold text-white hover:bg-emerald-700"
              >
                <Trophy className="mr-1.5 size-4" />
                Adjudicar al Mejor Postor
              </Button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 text-xs sm:grid-cols-4">
            <div>
              <span className="text-muted-foreground">Precio de Salida:</span>
              <p className="font-semibold text-foreground">₡{remateActivo.precioSalida.toLocaleString("es-CR")}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Precio Reserva (Piso):</span>
              <p className="font-semibold text-foreground">₡{remateActivo.precioReserva.toLocaleString("es-CR")}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Incremento Mínimo:</span>
              <p className="font-semibold text-foreground">₡{remateActivo.incrementoMinimo.toLocaleString("es-CR")}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Depósito Requerido:</span>
              <p className="font-semibold text-foreground">₡{remateActivo.depositoRequerido.toLocaleString("es-CR")}</p>
            </div>
          </div>
        </div>
      )}

      {/* Muro de Control de Pujas en Vivo */}
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-2 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground">Registro de Ofertas y Postores en Vivo</h3>
            <p className="text-xs text-muted-foreground">
              Supervisa cada puja recibida, valida depósitos y contacta a los clientes por WhatsApp.
            </p>
          </div>
          <span className="text-xs font-semibold text-muted-foreground">
            {remateActivo?.pujas.length || 0} ofertas registradas
          </span>
        </div>

        {remateActivo?.pujas.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Aún no se han recibido ofertas para este remate. ¡Las nuevas pujas aparecerán aquí en tiempo real!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 font-semibold text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Monto Ofertado</th>
                  <th className="px-4 py-3">Postor</th>
                  <th className="px-4 py-3">Teléfono / WhatsApp</th>
                  <th className="px-4 py-3">Cédula</th>
                  <th className="px-4 py-3">Fecha y Hora</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {remateActivo?.pujas.map((p, idx) => {
                  const isTop = idx === 0 && p.estado === "aprobada";
                  const telLimpio = p.postorTelefono.replace(/\D/g, "");
                  const waUrl = `https://wa.me/506${telLimpio}?text=${encodeURIComponent(
                    `Hola ${p.postorNombre}, le saludamos de Aval Community CR sobre su puja de ₡${p.monto.toLocaleString(
                      "es-CR"
                    )} por el vehículo en remate VIP.`
                  )}`;

                  return (
                    <tr
                      key={p.id}
                      className={isTop ? "bg-amber-500/5 font-medium" : "hover:bg-muted/30"}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-display text-base font-bold text-foreground">
                            ₡{p.monto.toLocaleString("es-CR")}
                          </span>
                          {isTop && (
                            <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-500">
                              LÍDER
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-foreground font-medium">
                        {p.postorNombre}
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-600 hover:underline font-semibold"
                        >
                          <MessageCircle className="size-3.5" />
                          {p.postorTelefono}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{p.postorCedula || "No indicada"}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(p.fecha).toLocaleString("es-CR", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                            p.estado === "aprobada"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : p.estado === "pendiente"
                              ? "bg-amber-500/10 text-amber-600"
                              : "bg-destructive/10 text-destructive"
                          }`}
                        >
                          {p.estado}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {p.estado !== "aprobada" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => cambiarEstadoPuja(remateActivo.id, p.id, "aprobada")}
                              className="h-7 px-2 text-emerald-600 hover:bg-emerald-50"
                              title="Aprobar Puja"
                            >
                              <CheckCircle2 className="size-4" />
                            </Button>
                          )}
                          {p.estado !== "rechazada" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => cambiarEstadoPuja(remateActivo.id, p.id, "rechazada")}
                              className="h-7 px-2 text-destructive hover:bg-destructive/10"
                              title="Descalificar Puja"
                            >
                              <XCircle className="size-4" />
                            </Button>
                          )}
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex h-7 items-center justify-center rounded px-2 text-emerald-600 hover:bg-emerald-50"
                            title="Validar por WhatsApp"
                          >
                            <MessageCircle className="size-4" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Crear Nuevo Remate */}
      <Dialog open={modalNuevo} onOpenChange={setModalNuevo}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gavel className="size-5 text-amber-500" />
              Publicar Nuevo Vehículo en Remate VIP
            </DialogTitle>
            <DialogDescription>
              Configura los detalles del vehículo adjudicado por un ganador para abrir la subasta al público.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCrearRemate} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="titulo">Título del Remate / Vehículo</Label>
                <Input
                  id="titulo"
                  value={nuevoTitulo}
                  onChange={(e) => setNuevoTitulo(e.target.value)}
                  placeholder="ej: Subaru Impreza WRX STI 2024"
                  required
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="subtitulo">Subtítulo Descriptivo</Label>
                <Input
                  id="subtitulo"
                  value={nuevoSubtitulo}
                  onChange={(e) => setNuevoSubtitulo(e.target.value)}
                  placeholder="ej: Adjudicado en Gran Evento · Remate Voluntario"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="precioSalida">Precio de Salida Base (₡)</Label>
                <Input
                  id="precioSalida"
                  type="number"
                  value={nuevoPrecioSalida}
                  onChange={(e) => setNuevoPrecioSalida(Number(e.target.value))}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="precioReserva">Precio Reserva / Piso (₡)</Label>
                <Input
                  id="precioReserva"
                  type="number"
                  value={nuevoPrecioReserva}
                  onChange={(e) => setNuevoPrecioReserva(Number(e.target.value))}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="incremento">Incremento Mínimo por Puja (₡)</Label>
                <Input
                  id="incremento"
                  type="number"
                  value={nuevoIncremento}
                  onChange={(e) => setNuevoIncremento(Number(e.target.value))}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="fechaFin">Fecha y Hora de Cierre</Label>
                <Input
                  id="fechaFin"
                  type="datetime-local"
                  value={nuevaFechaFin}
                  onChange={(e) => setNuevaFechaFin(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ganador">Nombre del Ganador Original</Label>
                <Input
                  id="ganador"
                  value={nuevoGanador}
                  onChange={(e) => setNuevoGanador(e.target.value)}
                  placeholder="ej: Carlos Solano M."
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="token">Token / Sticker Ganador</Label>
                <Input
                  id="token"
                  value={nuevoToken}
                  onChange={(e) => setNuevoToken(e.target.value)}
                  placeholder="ej: #91204"
                  required
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="imagen">URL de la Foto Principal HD</Label>
                <Input
                  id="imagen"
                  value={nuevaImagen}
                  onChange={(e) => setNuevaImagen(e.target.value)}
                  placeholder="https://..."
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
              <Button type="button" variant="ghost" onClick={() => setModalNuevo(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold"
              >
                Publicar Remate Inmediato
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Editar Datos del Remate Actual */}
      <Dialog open={modalEditar} onOpenChange={setModalEditar}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="size-5 text-amber-500" />
              Editar Datos del Remate Actual
            </DialogTitle>
            <DialogDescription>
              Modifica los textos, fotos, precios, reloj y procedencia del vehículo que se muestra en la web pública.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleGuardarEdicion} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="editTitulo">Título del Remate / Vehículo</Label>
                <Input
                  id="editTitulo"
                  value={editTitulo}
                  onChange={(e) => setEditTitulo(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="editSubtitulo">Subtítulo Descriptivo</Label>
                <Input
                  id="editSubtitulo"
                  value={editSubtitulo}
                  onChange={(e) => setEditSubtitulo(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="editDescripcion">Descripción Detallada</Label>
                <Textarea
                  id="editDescripcion"
                  value={editDescripcion}
                  onChange={(e) => setEditDescripcion(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="editPrecioSalida">Precio de Salida Base (₡)</Label>
                <Input
                  id="editPrecioSalida"
                  type="number"
                  value={editPrecioSalida}
                  onChange={(e) => setEditPrecioSalida(Number(e.target.value))}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="editPrecioReserva">Precio Reserva / Piso (₡)</Label>
                <Input
                  id="editPrecioReserva"
                  type="number"
                  value={editPrecioReserva}
                  onChange={(e) => setEditPrecioReserva(Number(e.target.value))}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="editIncremento">Incremento Mínimo por Puja (₡)</Label>
                <Input
                  id="editIncremento"
                  type="number"
                  value={editIncremento}
                  onChange={(e) => setEditIncremento(Number(e.target.value))}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="editFechaFin">Fecha y Hora de Cierre (Reloj)</Label>
                <Input
                  id="editFechaFin"
                  type="datetime-local"
                  value={editFechaFin}
                  onChange={(e) => setEditFechaFin(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="editImagenPrincipal">URL de la Foto Principal (HD)</Label>
                <Input
                  id="editImagenPrincipal"
                  value={editImagenPrincipal}
                  onChange={(e) => setEditImagenPrincipal(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="editGanadorNombre">Nombre del Ganador que Remata</Label>
                <Input
                  id="editGanadorNombre"
                  value={editGanadorNombre}
                  onChange={(e) => setEditGanadorNombre(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="editGanadorToken">Token / Sticker Ganador</Label>
                <Input
                  id="editGanadorToken"
                  value={editGanadorToken}
                  onChange={(e) => setEditGanadorToken(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="editGanadorDeclaracion">Testimonio / Declaración del Ganador</Label>
                <Textarea
                  id="editGanadorDeclaracion"
                  value={editGanadorDeclaracion}
                  onChange={(e) => setEditGanadorDeclaracion(e.target.value)}
                  rows={2}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="editMotor">Motor / Cilindrada</Label>
                <Input
                  id="editMotor"
                  value={editMotor}
                  onChange={(e) => setEditMotor(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="editTransmision">Transmisión</Label>
                <Input
                  id="editTransmision"
                  value={editTransmision}
                  onChange={(e) => setEditTransmision(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
              <Button type="button" variant="ghost" onClick={() => setModalEditar(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold"
              >
                Guardar Cambios
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
