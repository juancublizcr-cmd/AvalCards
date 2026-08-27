# 🤝 MANUAL OPERATIVO: PROGRAMA DE REFERIDOS Y AFILIADOS
## Plataforma Oficial de Rifas Digitales — Aval Motors CR

Este manual describe el funcionamiento completo, las reglas de incentivos, la operativa técnica y las estrategias de difusión para el **Programa de Referidos y Afiliados** de Aval Motors CR.

---

## 1. ¿Cómo Funciona la Mecánica "Gancho Doble" (Win-Win)?

El éxito del programa radica en que **ambas partes obtienen un beneficio tangible de inmediato**:

```
                              ┌───────────────────────────────┐
                              │     CLIENTE O PROMOTOR        │
                              │   Comparte enlace único       │
                              │  (?ref=86344772 o su celular) │
                              └───────────────┬───────────────┘
                                              │
                                              ▼
                              ┌───────────────────────────────┐
                              │         AMIGO / INVITADO      │
                              │  Compra paquete de tokens     │
                              │  y recibe +1 Token GRATIS     │
                              └───────────────┬───────────────┘
                                              │
                                              ▼
                              ┌───────────────────────────────┐
                              │     RECOMPENSA AL REFERENTE   │
                              │  • Gana 1 Token de Regalo     │
                              │  • O Comisión SINPE (10%-15%) │
                              └───────────────────────────────┘
```

### Tabla de Incentivos:
| Participante | Acción | Beneficio / Recompensa | Costo para la Empresa |
| :--- | :--- | :--- | :--- |
| **Nuevo Comprador** *(Invitado)* | Compra tokens mediante un link `?ref=...` | **+1 Token Extra de Regalo** agregado automáticamente a su paquete. | **₡0 CRC** *(Emisión digital)* |
| **Cliente Referente** *(Nivel 1)* | Su amigo completa y paga su compra. | **1 Token de Bonificación** para el sorteo del vehículo 0KM. | **₡0 CRC** *(Emisión digital)* |
| **Promotor / Afiliado** *(Nivel 2)* | Trae ventas masivas por redes o grupos. | **10% al 15% de comisión en efectivo** liquidable por SINPE Móvil. | Margen deducible de la venta |

---

## 2. Enlaces Únicos y Captura Automática

1. **Estructura del Enlace:**
   * `https://avalmotorscr.com/?ref=NUMERO_TELEFONO`
   * Ejemplo: `https://avalmotorscr.com/?ref=86344772`
2. **Persistencia (Memoria del Navegador):**
   * Cuando una persona hace clic en un enlace de referido, el sistema guarda el código en el `localStorage` de su dispositivo.
   * Si la persona no compra inmediatamente y regresa 3 días después a pagar, **la compra sigue quedando atribuida al referente original**.
3. **Notificación en Pantalla:**
   * Al ingresar con el link, la web muestra una notificación verde:  
     *“🎁 ¡Enlace de amigo activado! Recibirás +1 Token adicional en tu compra.”*

---

## 3. Puntos de Contacto donde el Cliente Comparte su Enlace

### A. Pantalla de Éxito de Compra (`/checkout`)
Inmediatamente después de pagar o adjuntar el comprobante, se le muestra:
* Su enlace personal generado automáticamente con su número de teléfono.
* Botón **"Copiar Enlace"**.
* Botón destacado **"📲 ¡Compartir mi Enlace en WhatsApp!"** con el mensaje listo.

### B. Consulta de Tokens (`/validar`)
Cuando un cliente busca sus números con su cédula o teléfono, la pantalla le muestra un banner de regalo con botones rápidos para compartir en WhatsApp.

---

## 4. Plantillas de Mensajes Listas para WhatsApp y Redes

### Plantilla 1: Para Grupos de Amigos y Familiares
> *"¡Mae! Estoy participando por el Mercedes Benz 2026 en Aval Motors CR 🚗💨.*  
> *Si entras con mi enlace te regalan **+1 Token Extra GRATIS** en tu paquete:*  
> *👉 https://avalmotorscr.com/?ref=TU_NUMERO"*

### Plantilla 2: Para Estados de WhatsApp / Historias de Instagram
> *"¿Te imaginas estrenar un Mercedes Benz 2026 por ₡1,000? 🔥*  
> *Usa mi link y llévate números extra de regalo:*  
> *👉 https://avalmotorscr.com/?ref=TU_NUMERO"*

### Plantilla 3: Para Creadores de Contenido / Influencers
> *"¡Mi gente! Me uní con Aval Motors CR para regalarles números adicionales para el sorteo del Mercedes Benz 0KM con traspaso y marchamo pago.*  
> *Entren al link oficial para reclamar su Token de regalo:*  
> *👉 https://avalmotorscr.com/?ref=CODIGO_INFLUENCER"*

---

## 5. Control y Liquidación en el Panel Administrativo (`/admin`)

En el Panel de Administración tienes la pestaña **"🤝 Referidos y Afiliados"**:

1. **Métricas en Tiempo Real:**
   * **Total Recaudado por Referidos:** Monto total en ₡ de compras traídas por recomendación.
   * **Tokens Bonificados:** Total de números de regalo generados.
   * **Referentes Activos:** Cantidad de personas que han conseguido al menos 1 comprador.
   * **Comisiones Estimadas:** Saldo acumulado para promotores.
2. **Ranking de Top Referentes:**
   * Tabla ordenada por mayor volumen de ventas generadas.
   * Botón **"Ver Órdenes"** para auditar qué clientes compraron con ese código.
   * Botón **"WhatsApp"** para contactar directamente al referente, felicitarlo o pagarle su comisión por SINPE Móvil.
3. **Parámetros del Programa:**
   * Activar / Desactivar el programa con un interruptor.
   * Cambiar los tokens de bono por compra (1 a 5 tokens).
   * Modificar el % de comisión estimada (0% a 30%).

---

## 6. Políticas Antifraude y Buenas Prácticas

* **Auto-referido Bloqueado:** Un comprador no puede ponerse a sí mismo como referente para recibir bonos dobles.
* **Acreditación contra Pago Aprobado:** Los tokens de bonificación y las comisiones solo se hacen oficiales una vez que el administrador valida el comprobante SINPE o la pasarela de tarjeta confirma la transacción.
