import React from 'react';
import ReactLoading from 'react-loading';

const ButtonLoading = ({ disabled, loading, text, onClick = () => {} }) => {
    return (
    <button
        onClick={onClick}
        disabled={disabled}
        type='submit'
        className='bg-purple-600 text-white font-bold text-lg py-1 px-3  rounded-md hover:bg-purple-400 shadow-md my-2 disabled:opacity-50 disabled:bg-gray-500'
    >
        {loading ? <ReactLoading type='spin' height={30} width={30} /> : text}
    </button>
    );
};

export default ButtonLoading;