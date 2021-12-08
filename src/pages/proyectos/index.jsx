import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { PROYECTOS } from 'graphql/proyectos/queries';
import DropDown from 'components/Dropdown';
import { Dialog } from '@mui/material';
import { Enum_EstadoProyecto } from 'utils/enums';
import ButtonLoading from 'components/ButtonLoading';
import { EDITAR_PROYECTO } from 'graphql/proyectos/mutations';
import useFormData from 'hooks/useFormData';
import PrivateComponent from 'components/PrivateComponent';
import { Link } from 'react-router-dom';
import { CREAR_INSCRIPCION } from 'graphql/inscripciones/mutaciones';
import { useUser } from 'context/userContext';
import { toast } from 'react-toastify';
import {
  AccordionStyled,
  AccordionSummaryStyled,
  AccordionDetailsStyled,
} from 'components/Accordion';

const IndexProyectos = () => {
  const { data: queryData, loading, error } = useQuery(PROYECTOS);

  useEffect(() => {
    console.log("datos proyecto", queryData);
  }, [queryData]);

  if (loading) return <p>Loading...</p>;

  if (queryData.Proyectos) {
    return (
      <div className="p-8 font-bold text-purple-900">
        <div className='flex w-full items-center justify-center'>
          <h1 className='text-2xl font-bold text-gray-900'>Lista de Proyectos</h1>
        </div>
        <PrivateComponent roleList={['ADMINISTRADOR', 'LIDER']}>
          <div className='my-2 self-end'>
            <button className='bg-purple-500 text-gray-50 p-2 rounded-lg shadow-lg hover:bg-purple-400'>
              <Link to='/proyectos/nuevo'>Crear nuevo proyecto</Link>
            </button>
          </div>
        </PrivateComponent>
        {queryData.Proyectos.map((proyecto) => {
          return <AccordionProyecto proyecto={proyecto} />;
        })}
      </div>
    );
  }
  return <></>;
};

  const AccordionProyecto = ({ proyecto }) => {
    const [showDialog, setShowDialog] = useState(false);
    return (
      <>
      <AccordionStyled>
          <AccordionSummaryStyled
            expandIcon={<i className="fas fa-chevron-down" />}>
              <div className='flex w-full justify-between'>
                <div className='font-bold text-pink-900'>
                  {proyecto.nombre} - {proyecto.estado}  
                </div>
              </div>   
          </AccordionSummaryStyled>
          <AccordionDetailsStyled>
            <PrivateComponent roleList={["ADMINISTRADOR"]}>
              <i className="mx-4 text-pink-900 hover:text-pink-700 fas fa-pen" onClick={()=>{
                  setShowDialog(true)
                }}/>
            </PrivateComponent>
            <PrivateComponent roleList={['ESTUDIANTE']}>
            <InscripcionProyecto
              idProyecto={proyecto._id}
              estado={proyecto.estado}
              inscripciones={proyecto.inscripciones}
            />
          </PrivateComponent>
          <div>Liderado Por: {proyecto.lider.correo}</div>
          <div className='flex'>
            {proyecto.objetivos.map((objetivo) => {
              return <Objetivo tipo={objetivo.tipo} descripcion={objetivo.descripcion} />;
            })}
          </div>
        </AccordionDetailsStyled>
      </AccordionStyled>
      <Dialog
        open={showDialog}
        onClose={() => {
          setShowDialog(false);
        }}
      >
        <FormEditProyecto _id={proyecto._id} />
      </Dialog>
    </>
  );
};

  const FormEditProyecto = ({ _id }) => {
    const { form, formData, updateFormData } = useFormData();
    const [editarProyecto, { data: dataMutation, loading, error }] = useMutation(EDITAR_PROYECTO);

    const submitForm = (e) => {
      e.preventDefault();
      editarProyecto({
        variables: {
          _id,
          campos: formData,
        }
      })
    };

    useEffect(() => {
      console.log('data mutation', dataMutation);
    } , [dataMutation]); 

    return (
      <div className="bg-purple-300 p-4">
        <h1 className="font-bold text-pink-900">Cambiar Estado del Proyecto</h1>
        <form 
          ref={form}
          onChange={updateFormData}
          onSubmit={submitForm}
          className="flex flex-col items-center">
          <DropDown label="Estado Proyecto" name="estado" options={ Enum_EstadoProyecto} />
          <ButtonLoading disabled={false} loading={loading} text="Confirmar"/>
        </form>
      </div>
    );
  };

  const Objetivo = ({ tipo, descripcion }) => {
    return (
      <div className='mx-6 my-3 bg-purple-200 p-8 rounded-lg flex flex-col items-center justify-center font-medium shadow-lg'>
        <div className='text-lg font-semibold text-purple-900'>{tipo}</div>
        <div className='font-normal italic'>
          {descripcion}
        </div>
        <PrivateComponent roleList={["ADMINISTRADOR"]}>
          <div>Editar</div>
        </PrivateComponent>
        
      </div>
    );
  };

  const InscripcionProyecto = ({ idProyecto, estado, inscripciones }) => {
    const [estadoInscripcion, setEstadoInscripcion] = useState('');
    const [crearInscripcion, { data, loading, error }] = useMutation(CREAR_INSCRIPCION);
    const { userData } = useUser();
  
    useEffect(() => {
      if (userData && inscripciones) {
        const flt = inscripciones.filter((el) => el.estudiante._id === userData._id);
        if (flt.length > 0) {
          setEstadoInscripcion(flt[0].estado);
        }
      }
    }, [userData, inscripciones]);
  
    useEffect(() => {
      if (data) {
        console.log(data);
        toast.success('Inscripción creada con éxito');
      }
    }, [data]);
  
    const confirmarInscripcion = () => {
      crearInscripcion({ variables: { proyecto: idProyecto, estudiante: userData._id } });
    };
  
    return (
      <>
        {estadoInscripcion !== '' ? (
          <span>Ya está inscrito en este proyecto. Estado: {estadoInscripcion}</span>
        ) : (
          <ButtonLoading
            onClick={() => confirmarInscripcion()}
            disabled={estado === 'INACTIVO'}
            loading={loading}
            text='Inscribirme en este proyecto'
          />
        )}
      </>
    );
  };

export default IndexProyectos;
