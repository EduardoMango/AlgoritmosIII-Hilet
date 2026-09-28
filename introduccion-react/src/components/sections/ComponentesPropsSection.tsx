import React, { useState } from 'react';
import IndicadorEstado from '../common/IndicadorEstado';
import BotonAccion from '../common/BotonAccion';

export const ComponentesPropsSection: React.FC = () => {
  // Estado para el playground interactivo de BotonAccion
  const [textoBoton, setTextoBoton] = useState<string>('Guardar Cambios');
  const [varianteBoton, setVarianteBoton] = useState<'primario' | 'secundario' | 'exito' | 'peligro'>('exito');
  const [deshabilitadoBoton, setDeshabilitadoBoton] = useState<boolean>(false);
  const [clickCount, setClickCount] = useState<number>(0);

  // Estado para el indicador de servidor
  const [estadoServidor, setEstadoServidor] = useState<string>('Operativo (200 OK)');
  const [tipoServidor, setTipoServidor] = useState<'activo' | 'inactivo' | 'alerta'>('activo');

  return (
    <section className="seccion-bloque" id="componentes">
      <div className="seccion-header">
        <span className="seccion-numero">Tema 1.3</span>
        <h2>Componentes Funcionales y Props (Flujo Unidireccional)</h2>
      </div>

      {/* Componente como función pura */}
      <div className="card-conceptual">
        <h3>1. Componentes Funcionales como Funciones Puras</h3>
        <p>
          En React moderno, la unidad constructiva es el <strong>Componente Funcional</strong>: una función JavaScript
          que recibe un objeto de entrada (<code>props</code>) y retorna la descripción de la interfaz (TSX).
        </p>
        <p>
          Para garantizar predictibilidad, todo componente debe comportarse como una <strong>función pura</strong>:
        </p>
        <div className="pureza-grid">
          <div className="card-pureza">
            <span className="icono-pureza">🎯</span>
            <strong>Determinismo</strong>
            <p>Ante los mismos argumentos de entrada (props), siempre debe retornar exactamente la misma interfaz.</p>
          </div>
          <div className="card-pureza">
            <span className="icono-pureza">🛡️</span>
            <strong>Sin Efectos Secundarios en Render</strong>
            <p>No debe modificar variables externas, mutar objetos recibidos ni realizar peticiones directas durante el render.</p>
          </div>
        </div>

        {/* Demostración de IndicadorEstado */}
        <div className="demo-servidor-box">
          <div className="controles-servidor">
            <label>Estado del Servidor:</label>
            <select
              value={tipoServidor}
              onChange={(e) => {
                const val = e.target.value as 'activo' | 'inactivo' | 'alerta';
                setTipoServidor(val);
                if (val === 'activo') setEstadoServidor('Operativo (200 OK)');
                if (val === 'alerta') setEstadoServidor('Alta Latencia (504 Gateway)');
                if (val === 'inactivo') setEstadoServidor('Caído (500 Error)');
              }}
            >
              <option value="activo">Activo / Operativo</option>
              <option value="alerta">Alerta / Alta Latencia</option>
              <option value="inactivo">Inactivo / Caído</option>
            </select>
          </div>
          <div className="render-servidor">
            <span className="label-render">Componente Funcional Puro Renderizado:</span>
            <IndicadorEstado estado={estadoServidor} tipo={tipoServidor} />
          </div>
        </div>
      </div>

      {/* Flujo Unidireccional e Inmutabilidad de Props */}
      <div className="card-conceptual">
        <h3>2. Flujo de Datos Unidireccional e Inmutabilidad Estricta</h3>
        <p>
          Las <strong>props</strong> representan el contrato de comunicación desde un componente padre hacia un componente hijo.
          El flujo es estrictamente <strong>Top-Down (Unidireccional)</strong>.
        </p>

        <div className="diagrama-flujo-unidireccional">
          <div className="caja-nodo padre">
            <span>[ Componente Padre: PanelControl ]</span>
            <small>Posee el estado o los datos maestros</small>
          </div>
          <div className="flecha-unidireccional">
            &darr; Paso de Props (solo lectura: metrica={'{ total: 150 }'})
          </div>
          <div className="caja-nodo hijo">
            <span>[ Componente Hijo: TarjetaMetrica ]</span>
            <small>Recibe props inmutables y proyecta la vista</small>
          </div>
        </div>

        <div className="alerta-box callout-peligro">
          <h4>⚠️ Regla Crítica: Las Props son de Solo Lectura (Read-Only)</h4>
          <p>
            Un componente hijo <strong>jamás debe mutar sus propias props</strong>. Violar la inmutabilidad corrompe
            el algoritmo de reconciliación de React y genera inconsistencias impredecibles en pantalla.
          </p>
        </div>

        <div className="comparativa-codigo-grid">
          <div className="bloque-codigo">
            <div className="codigo-cabecera imperativo">
              <span>❌ Anti-patrón: Mutación de Props</span>
            </div>
            <pre>
              <code>{`function TarjetaInvalida(props: Props) {
  // ERROR CRÍTICO: mutación directa de entrada
  props.nombre = props.nombre.toUpperCase();

  return <div>{props.nombre}</div>;
}`}</code>
            </pre>
          </div>

          <div className="bloque-codigo">
            <div className="codigo-cabecera declarativo">
              <span>✅ Patrón Correcto: Cálculo Derivado</span>
            </div>
            <pre>
              <code>{`function TarjetaValida({ nombre }: Props) {
  // Correcto: variable local derivada sin mutar props
  const nombreFormateado = nombre.toUpperCase();

  return <div>{nombreFormateado}</div>;
}`}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Destructuring y Valores por Defecto con Playground */}
      <div className="card-conceptual">
        <h3>3. Patrones de Destructuración y Valores por Defecto (Default Parameters)</h3>
        <p>
          El estándar moderno en TypeScript / React consiste en desestructurar las propiedades directamente
          en los argumentos de la función, asignando valores por defecto a los atributos opcionales:
        </p>

        <div className="playground-props-grid">
          <div className="controles-props">
            <h4>Ajustar Props de BotonAccion</h4>
            <div className="campo-form">
              <label>Texto (prop 'texto'):</label>
              <input
                type="text"
                value={textoBoton}
                onChange={(e) => setTextoBoton(e.target.value)}
              />
            </div>

            <div className="campo-form">
              <label>Variante (prop 'variante'):</label>
              <select
                value={varianteBoton}
                onChange={(e) =>
                  setVarianteBoton(e.target.value as 'primario' | 'secundario' | 'exito' | 'peligro')
                }
              >
                <option value="primario">primario (azul)</option>
                <option value="secundario">secundario (gris)</option>
                <option value="exito">exito (verde)</option>
                <option value="peligro">peligro (rojo)</option>
              </select>
            </div>

            <div className="campo-form">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={deshabilitadoBoton}
                  onChange={(e) => setDeshabilitadoBoton(e.target.checked)}
                />
                deshabilitado (prop 'deshabilitado')
              </label>
            </div>
          </div>

          <div className="resultado-props">
            <h4>Componente Hijo Renderizado</h4>
            <div className="caja-render-boton">
              <BotonAccion
                texto={textoBoton || undefined}
                variante={varianteBoton}
                deshabilitado={deshabilitadoBoton}
                onClick={() => setClickCount((c) => c + 1)}
              />
              <span className="contador-clicks">Clicks ejecutados: {clickCount}</span>
            </div>

            <div className="codigo-invocacion">
              <span className="subtitulo-codigo">Invocación JSX generada:</span>
              <pre>
                <code>{`<BotonAccion
  texto="${textoBoton}"
  variante="${varianteBoton}"
  deshabilitado={${deshabilitadoBoton}}
/>`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComponentesPropsSection;

