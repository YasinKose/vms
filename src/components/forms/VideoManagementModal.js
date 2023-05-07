import {Button, Form, Input, InputNumber, message} from 'antd';
import {createVideo, updateVideo} from '@/components/content/ContentManager';
import {useClientError} from '@/hooks/useClientError';
import {useState} from 'react';

const VideoManagementModal = ({videoDetails, revokeHandler, isEdit}) => {
  const [file, setFile] = useState();
  const [videoForm] = Form.useForm();
  const clientError = useClientError();

  const reader = (parameterFile) => {
    setFile(parameterFile);
  }

  const submitVideoForm = (formValues) => {
    let formData = new FormData();
    formData.append('title', formValues.title)
    formData.append('description', formValues.description)
    formData.append('order', formValues.order)
    formData.append('video', file)
    if(!isEdit) {
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
      updateVideo(videoDetails.slug, formData).then(response => {
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

  return <Form form={videoForm} initialValues={videoDetails} onFinish={submitVideoForm}>
    <Form.Item label='Başlık' name='title'>
      <Input placeholder='Video için başlık giriniz'/>
    </Form.Item>
    <Form.Item label='Açıklama' name='description'>
      <Input placeholder='Video için açıklama giriniz'/>
    </Form.Item>
    <Form.Item label='Hafta' name='order'>
      <InputNumber style={{width: '100%'}} placeholder='Video için hafta giriniz' min={1}/>
    </Form.Item>
    <Form.Item label='Video'>
      <Input onChange={(e) => reader(e.target.files[0])} type="file"/>
    </Form.Item>
    <Button type='primary' htmlType='submit'>
      {isEdit ? 'Güncelle' : 'Oluştur'}
    </Button>
  </Form>
}

export default VideoManagementModal