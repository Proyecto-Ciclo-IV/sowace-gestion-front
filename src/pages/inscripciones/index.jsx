import React, { useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import PrivateRoute from 'components/PrivateRoute';
import { GET_INSCRIPCIONES } from 'graphql/inscripciones/queries';
import { APROBAR_INSCRIPCION } from 'graphql/inscripciones/mutaciones';
import ButtonLoading from 'components/ButtonLoading';
import { toast } from 'react-toastify';
import {
  AccordionStyled,
  AccordionSummaryStyled,
  AccordionDetailsStyled,
} from 'components/Accordion';

const IndexInscripciones = () => {
  const { data, loading } = useQuery(GET_INSCRIPCIONES);

  useEffect(() => {}, [data]);
  if (loading) return <div>Loading...</div>;
  return (
    <PrivateRoute roleList={['ADMINISTRADOR', 'LIDER']}>
      <div className='p-10'>
        <div className='font-extrabold text-xl text-pink-900'>
          Página de Inscripciones
        </div>
        <div className='my-4 font-bold '>
          <AccordionInscripcion
            titulo='Inscripciones Aprobadas'
            data={data.Inscripciones.filter((el) => el.estado === 'ACEPTADO')}
          />
          <AccordionInscripcion
            titulo='Inscripciones Pendientes'
            data={data.Inscripciones.filter((el) => el.estado === 'PENDIENTE')}
            // refetch={refetch}
          />
          <AccordionInscripcion
            titulo='Inscripciones Rechazadas'
            data={data.Inscripciones.filter((el) => el.estado === 'RECHAZADO')}
          />
        </div>
      </div>
    </PrivateRoute>
  );
};

const AccordionInscripcion = ({ data, titulo, refetch = () => {} }) => (
  <AccordionStyled>
    <AccordionSummaryStyled
      expandIcon={<i className='text-pink-900 fas fa-chevron-down' />}
    >
      {titulo} ({data.length})
    </AccordionSummaryStyled>
    <AccordionDetailsStyled>
      <div className='flex'>
        {data &&
          data.map((inscripcion) => (
            <Inscripcion inscripcion={inscripcion} refetch={refetch} />
          ))}
      </div>
    </AccordionDetailsStyled>
  </AccordionStyled>
);

const Inscripcion = ({ inscripcion }) => {
  const [aprobarInscripcion, { data, loading, error }] =
    useMutation(APROBAR_INSCRIPCION);

  useEffect(() => {
    if (data) {
      toast.success('Inscripción aprobada con éxito');
      // refetch();
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error('Error aprobando la inscripción');
    }
  }, [error]);

  const cambiarEstadoInscripcion = () => {
    aprobarInscripcion({
      variables: {
        aprobarInscripcionId: inscripcion._id,
      },
    });
  };

  return (
    <div className='bg-purple-500 text-gray-50 flex flex-col p-5 m-2 rounded-lg shadow-xl'>
      <span className='text-xl'>{inscripcion.proyecto.nombre}</span>
      <span className='font-semibold'>{inscripcion.estudiante.nombre}</span>
      <span className='font-mono italic text-yellow-400 text-lg'>
        {inscripcion.estado}
      </span>
      {inscripcion.estado === 'PENDIENTE' && (
        <ButtonLoading
          onClick={() => {
            cambiarEstadoInscripcion();
          }}
          text='Aprobar Inscripcion'
          loading={loading}
          disabled={false}
        />
      )}
    </div>
  );
};

export default IndexInscripciones;
