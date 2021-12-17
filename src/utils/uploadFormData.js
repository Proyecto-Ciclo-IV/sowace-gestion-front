import axios from 'axios';

const uploadFormData = async (formData) => {
  const formDataCopy = { ...formData };
  await Promise.all(
    Object.keys(formDataCopy).map(async (field) => {
      if (
        Object.prototype.isPrototypeOf.call(File.prototype, formDataCopy[field])
      ) {
        const dt = new FormData();
        dt.append('file', formDataCopy[field]);
        dt.append('upload_preset', 'pdac1ku9');
        dt.append('cloud_name', 'dcrb6eg2y');
        const options = {
          method: 'POST',
          url: 'https://api.cloudinary.com/v1_1/dcrb6eg2y/image/upload',
          data: dt,
        };
        await axios.request(options).then((response) => {
          formDataCopy[field] = response.data.url;
        });
        // .catch(function (error) {
        //   console.error('err', error);
        // });
      }
    })
  );
  return formDataCopy;
};

export { uploadFormData };
