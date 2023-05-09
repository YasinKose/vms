import {Button, Checkbox, message, Form, Input, Select} from 'antd';
import {useState} from 'react';
import {createUser, updateUser} from '../content/ContentManager';
import {useClientError} from '../../hooks/useClientError';

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
    <div>
      <span>
        İsim :
      </span>
      <Form.Item name='name'>
        <Input placeholder='İsim giriniz'/>
      </Form.Item>
    </div>
    <div>
      <span>
        Soyisim :
      </span>
      <Form.Item name='surname'>
        <Input placeholder='Soyisim giriniz'/>
      </Form.Item>
    </div>
    <div>
      <span>
        Email :
      </span>
      <Form.Item name='email'>
        <Input placeholder='Email giriniz'/>
      </Form.Item>
    </div>
    <div>
      <span>
        Şifre :
      </span>
      <Form.Item name='password'>
        <Input placeholder='Şifre giriniz'/>
      </Form.Item>
    </div>
    <div>
      <span>
        Rol :
      </span>
      <Form.Item name='roles'>
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
    </div>
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