import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_AVANCES } from 'graphql/avances/queries';
import { useParams } from 'react-router-dom';
import { Dialog } from '@mui/material';
import Input from 'components/Input';
import ButtonLoading from 'components/ButtonLoading';
import useFormData from 'hooks/useFormData';
import { CREAR_AVANCE, CREAR_OBSERVACION } from 'graphql/avances/mutations';
import { useUser } from 'context/userContext';
import { toast } from 'react-toastify';
import PrivateComponent from 'components/PrivateComponent';
import { nanoid } from 'nanoid';

const IndexAvance = () => {
  const { projectid } = useParams();
  const [openDialog, setOpenDialog] = useState(false);

  // falta captura de error del loading
  const { data, loading } = useQuery(GET_AVANCES, {
    variables: {
      project: projectid,
    },
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div className='flex flex-col p-10 items-center w-full'>
      <h1 className='text-2xl font-bold text-pink-900 my-2'>
        Avances para el proyecto {projectid}
      </h1>
      <button
        onClick={() => setOpenDialog(true)}
        className='flex-end p-2 rounded-xl text-white bg-purple-500'
        type='button'
      >
        Crear nuevo avance
      </button>
      {data.Avances.length === 0 ? (
        <span>No tienes avances para este proyecto</span>
      ) : (
        data.Avances.map((avance) => <Avance avance={avance} />)
      )}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <CrearAvance proyecto={projectid} setOpenDialog={setOpenDialog} />
      </Dialog>
    </div>
  );
};

const Avance = ({ avance }) => {
  const [openDialog, setOpenDialog] = useState(false);
  return (
    <div className='flex flex-col bg-purple-200 shadow-lg p-3 rounded-xl m-2'>
      <span>
        <strong>Avance:</strong> {avance.descripcion}
      </span>
      <span>
        <strong>Fecha: </strong>
        {avance.fecha}
      </span>
      {/* <span>{avance.observaciones.length === 0 && 'Sin comentarios'}</span> */}
      <div className='flex flex-col my-5'>
        {avance.observaciones.length === 0 ? (
          <span>Sin Observación</span>
        ) : (
          <>
            {avance.observaciones.map((obs, index) => (
              <span key={nanoid}>
                {index + 1}, {obs}
              </span>
            ))}
          </>
        )}
      </div>
      <PrivateComponent roleList={['ADMINISTRADOR', 'LIDER']}>
        <button
          onClick={() => setOpenDialog(true)}
          type='button'
          className='bg-purple-500 text-white p-3 my-2 rounded-lg w-48 shadow-lg hover:bg-purple-400'
        >
          Hacer Observación
        </button>
      </PrivateComponent>
      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
        }}
      >
        <AgregarObservacion _id={avance._id} setOpenDialog={setOpenDialog} />
      </Dialog>
    </div>
  );
};

const AgregarObservacion = ({ _id, setOpenDialog }) => {
  const { formData, form, updateFormData } = useFormData();
  const [crearObservacion, { loading }] = useMutation(CREAR_OBSERVACION, {
    refetchQueries: [GET_AVANCES],
  });

  const submitForm = (e) => {
    e.preventDefault();
    crearObservacion({
      variables: {
        _id,
        ...formData,
      },
    })
      .then(() => {
        toast.success('Comentario agregado');
        setOpenDialog(false);
      })
      .catch(() => {
        toast.error('Error al agregar comentario');
      });
  };

  return (
    <div className='p-3'>
      <h1 className='text-2xl font-bold text-pink-900'>Agregar Observación</h1>
      <form ref={form} onChange={updateFormData} onSubmit={submitForm}>
        <Input name='comentario' type='text' required />
        <ButtonLoading
          text='Comentar'
          loading={loading}
          disabled={Object.keys(formData).length === 0}
        />
      </form>
    </div>
  );
};

const CrearAvance = ({ proyecto, setOpenDialog }) => {
  const { userData } = useUser();
  const { form, formData, updateFormData } = useFormData();

  const [crearAvance, { loading }] = useMutation(CREAR_AVANCE, {
    refetchQueries: [GET_AVANCES],
  });

  const submitForm = (e) => {
    e.preventDefault();

    crearAvance({
      variables: { ...formData, proyecto, creadoPor: userData._id },
    })
      .then(() => {
        toast.success('Avance creado con éxito');
        setOpenDialog(false);
      })
      .catch(() => {
        toast.error('Error creando el avance');
      });
  };
  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold text-pink-900'>Crear Nuevo Avance</h1>
      <form ref={form} onChange={updateFormData} onSubmit={submitForm}>
        <Input name='descripcion' label='Descripción' type='text' />
        <Input name='fecha' label='Fecha' type='date' />
        <ButtonLoading
          text='Crear Avance'
          loading={loading}
          disabled={Object.keys(formData).length === 0}
        />
      </form>
    </div>
  );
};

export default IndexAvance;
