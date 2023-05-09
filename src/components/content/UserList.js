import {Button, Col, Form, Input, Modal, Row, Table} from 'antd';
import {useEffect, useState} from 'react';
import {getUserList} from './ContentManager';
import styles from '../../styles/list.module.scss';
import {CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined} from '@ant-design/icons';
import UserManagementModal from '../../components/forms/UserManagementModal';

const UserList = () => {
  const [userModal, setUserModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [userDetails, setUserDetails] = useState({});

  const columns = [
    {
      title: 'İsim',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Soyisim',
      dataIndex: 'surname',
      key: 'surname',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Rol',
      dataIndex: 'roles',
      key: 'roles',
      render: (role) => role === 'staff' ? 'Staff' : 'Müşteri'
    },
    {
      title: 'Onaylı',
      dataIndex: 'verified',
      key: 'verified',
      render: (a) => a ? <CheckOutlined/> : <CloseOutlined/>
    },
    {
      title: 'Admin',
      dataIndex: 'is_admin',
      key: 'is_admin',
      render: (a) => a ? <CheckOutlined/> : <CloseOutlined/>
    },
    {
      title: 'Aksiyon',
      dataIndex: '',
      key: 'action',
      width: '65px',
      render: (item) => <div className={styles['tableActions']}>
        <DeleteOutlined className={styles['deleteButton']} onClick={() => actionClickHandler(item, 'delete')}/>
        <EditOutlined className={styles['editButton']} onClick={() => actionClickHandler(item, 'edit')}/>
      </div>
    },
  ];

  const deleteMethodHandler = () => {
    //console.log(userDetails)
  }

  const getUserHandler = () => {
    getUserList().then(response => {
      if (response.status === 200) {
        for (let user of response.data.attr) {
          user['key'] = user.uuid
        }
        setDataSource(response.data.attr);
      }
    })
  }

  useEffect(() => {
    getUserHandler();
  }, []);

  const actionClickHandler = (details, type) => {
    setUserDetails(details);
    if(type === 'delete') {
      setDeleteModal(true);
    }
    if(type === 'edit') {
      setUserModal(true);
    }
  }

  const revoke = () => {
    setUserModal(false);
    setUserDetails({});
    getUserHandler();
  }

  return <Row gutter={[16, 16]}>
    <Col span={24}>
      <Button type='primary' onClick={() => setUserModal(true)}>Kullanıcı Ekle</Button>
    </Col>
    <Col span={24}>
      <Table  dataSource={dataSource} columns={columns}/>
    </Col>
    <Modal
      destroyOnClose={true}
      width={600}
      title={Object.values(userDetails).length === 0 ? 'Kullanıcı Oluştur' : 'Kullanıcıyı Düzenle'}
      open={userModal}
      onCancel={() => {
        setUserModal(false);
        setUserDetails({});
      }}
      footer={false}>
      <UserManagementModal revokeHandler={revoke} userDetails={userDetails}/>
    </Modal>
    <Modal
      destroyOnClose={true}
      width={600}
      title='Kullanıcı Silme Uyarısı'
      open={deleteModal}
      onCancel={() => {
        setDeleteModal(false);
        setUserDetails({});
      }}
      onOk={deleteMethodHandler}>
      {userDetails.name + ' ' + userDetails.surname} kullanıcısı silinecek onaylıyor musunuz?
    </Modal>
  </Row>;
}

export default UserList;