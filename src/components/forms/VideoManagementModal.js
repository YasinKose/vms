import {Button, Form, Input, InputNumber, message} from 'antd';
import {createVideo, updateVideo} from '../content/ContentManager';
import {useClientError} from '../../hooks/useClientError';
import {useState} from 'react';

const VideoManagementModal = ({videoDetails, revokeHandler, isEdit}) => {
  const [file, setFile] = useState();
  const [videoForm] = Form.useForm();
  const clientError = useClientError();
  let initialValues;
  if(isEdit) {
    initialValues = videoDetails;
  }
  else {
    initialValues = {};
  }

  const reader = (parameterFile) => {
    setFile(parameterFile);
  }

  const submitVideoForm = (formValues) => {
    let formData = new FormData();
    formData.append('title', formValues.title);
    formData.append('description', formValues.description);
    formData.append('order', formValues.order);
    if(!isEdit) {
      formData.append('video', file);
      createVideo(formData).then(response => {
        if(response.status === 200) {
          message.success(response.data.message);
          revokeHandler();
        }
        else {
          message.error(response.data.message);
        }
      }).catch(error => {
        clientError(error);
      })
    }
    else {
      updateVideo(videoDetails.slug, formValues).then(response => {
        if(response.status === 200) {
          message.success(response.data.message);
          revokeHandler();
        }
        else {
          message.error(response.data.message);
        }
      }).catch(error => {
        clientError(error);
      })
    }
  }

  return <Form form={videoForm} initialValues={initialValues} onFinish={submitVideoForm}>
    <div>
      <span>
        <span className='required'>*</span> Başlık :
      </span>
      <Form.Item rules={[{required: true, message: 'Bu alan boş bırakılamaz.'}]} name='title'>
        <Input placeholder='Video için başlık giriniz'/>
      </Form.Item>
    </div>
    <div>
      <span>
        <span className='required'>*</span> Açıklama :
      </span>
      <Form.Item rules={[{required: true, message: 'Bu alan boş bırakılamaz.'}]} name='description'>
        <Input placeholder='Video için açıklama giriniz'/>
      </Form.Item>
    </div>
    <div>
      <span>
        <span className='required'>*</span> Hafta :
      </span>
      <Form.Item rules={[{required: true, message: 'Bu alan boş bırakılamaz.'}]} name='order'>
        <InputNumber style={{width: '100%'}} placeholder='Video için hafta giriniz' min={1}/>
      </Form.Item>
    </div>
    {!isEdit && <div>
      <span>
        <span className='required'>*</span> Video :
      </span>
      <Form.Item>
        <Input rules={[{required: true, message: 'Bu alan boş bırakılamaz.'}]} onChange={(e) => reader(e.target.files[0])} type="file"/>
      </Form.Item>
    </div>}
    <Button type='primary' htmlType='submit'>
      {isEdit ? 'Güncelle' : 'Oluştur'}
    </Button>
  </Form>
}

export default VideoManagementModal