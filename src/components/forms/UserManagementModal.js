import {Button, Checkbox, message, Form, Input, Select} from 'antd';
import {useState} from 'react';
import {createUser, updateUser} from '@/components/content/ContentManager';
import {useClientError} from '@/hooks/useClientError';

const UserManagementModal = ({userDetails, revokeHandler}) => {
  const [verifiedStatus, setVerifiedStatus] = useState(userDetails.verified);
  const [adminStatus, setAdminStatus] = useState(userDetails.is_admin);
  const [loading, setLoading] = useState(false);

  const [userForm] = Form.useForm();
  const clientError = useClientError();

  const submitFormHandler = (formValues) => {
    setLoading(true);
    formValues['verified'] = verifiedStatus;
    if(Object.values(userDetails).length > 0) {
      updateUser(userDetails.uuid, formValues).then(response => {
        if(response.status === 200) {
          message.success('Kullanıcı başarıyla güncellendi')
          revokeHandler();
          setLoading(false);
        }
        else {
          message.error('Kullanıcı güncellenemedi');
          setLoading(false);
        }
      }).catch(error => {
        clientError(error);
        setLoading(false);
      })
    }
    else {
      createUser(formValues).then(response => {
        if(response.status === 200) {
          message.success('Kullanıcı başarıyla eklendi')
          revokeHandler();
          setLoading(false);
        }
        else {
          message.error('Kullanıcı eklenemedi');
          setLoading(false);
        }
      }).catch(error => {
        clientError(error);
        setLoading(false);
      })
    }
  }

  return <Form initialValues={userDetails} form={userForm} onFinish={submitFormHandler}>
    <Form.Item label='İsim' name='name'>
      <Input placeholder='İsim giriniz'/>
    </Form.Item>
    <Form.Item label='Soyisim' name='surname'>
      <Input placeholder='Soyisim giriniz'/>
    </Form.Item>
    <Form.Item label='Email' name='email'>
      <Input placeholder='Email giriniz'/>
    </Form.Item>
    <Form.Item label='Şifre' name='password'>
      <Input placeholder='Şifre giriniz'/>
    </Form.Item>
    <Form.Item label='Rol' name='roles'>
      <Select
        allowClear
        style={{
          width: '100%',
        }}
        placeholder="Rol seçiniz"
        options={[
          {
            label: 'Staff',
            value: 'staff'
          },
          {
            label: 'Müşteri',
            value: 'customer'
          }
        ]}
      />
    </Form.Item>
    <Form.Item label='Onaylı'>
      <Checkbox onChange={(element) => {
        userForm.setFieldValue('verified', element.target.checked);
        setVerifiedStatus(element.target.checked);
      }} checked={verifiedStatus}/>
    </Form.Item>
    <Button loading={loading} type='primary' htmlType='submit'>
      {Object.values(userDetails).length === 0 ? 'Oluştur': 'Kaydet'}
    </Button>
  </Form>
}

export default UserManagementModal;