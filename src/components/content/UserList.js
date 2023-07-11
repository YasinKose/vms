import {Button, Col, Form, Input, message, Modal, Row, Table, Typography} from 'antd';
import {useEffect, useState} from 'react';
import {deleteUser, getUserList, restoreUser, searchUserList, updateUser} from './ContentManager';
import styles from '../../styles/list.module.scss';
import {CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined, RollbackOutlined} from '@ant-design/icons';
import UserManagementModal from '../../components/forms/UserManagementModal';
import {useClientError} from '../../hooks/useClientError';
const {Search} = Input;

const UserList = () => {
  const [userModal, setUserModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [restoreModal, setRestoreModal] = useState(false);
  const [approveModal, setApproveModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [userDetails, setUserDetails] = useState({});

  const clientError = useClientError();

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
      title: 'Kullanıcı TXT',
      dataIndex: 'txt',
      key: 'txt',
      render: (a) => a ?? '-'
    },
    {
      title: 'Twitter',
      dataIndex: 'twitter',
      key: 'twitter',
      render: (a) => a ?? '-'
    },
    {
      title: 'Discord',
      dataIndex: 'discord',
      key: 'discord',
      render: (a) => a ?? '-'
    },
    {
      title: 'Aksiyon',
      dataIndex: '',
      key: 'action',
      width: '100px',
      render: (item) => <div className={styles['tableActions']}>
        {item.deleted_at ? <RollbackOutlined className={styles['editButton']} onClick={() => actionClickHandler(item, 'restore')}/> : <DeleteOutlined className={styles['deleteButton']} onClick={() => actionClickHandler(item, 'delete')}/>}
        <EditOutlined className={styles['editButton']} onClick={() => actionClickHandler(item, 'edit')}/>
        {item.txt_verified ? <CheckOutlined className={styles['disabledButton']}/> : <CheckOutlined onClick={() => actionClickHandler(item, 'approve')} className={styles['approveButton']}/>}
      </div>
    },
  ];

  const approveMethodHandler = () => {
    setLoading(true);
    let formValues = {
      txt_verified: true
    };
    updateUser(userDetails.uuid, formValues).then(response => {
      if(response.status === 200) {
        message.success('Kullanıcı TXT başarıyla onaylandı.')
        revoke();
        setLoading(false);
      }
      else {
        message.error('Kullanıcı TXT onaylama işlemi başarısız.');
        setLoading(false);
      }
      setApproveModal(false);
      setUserDetails({});
    }).catch(error => {
      clientError(error);
      setLoading(false);
    })
  }

  const restoreMethodHandler = () => {
    setLoading(true);
    restoreUser(userDetails.uuid).then(response => {
      if(response.status === 200) {
        message.success('Kullanıcı başarıyla geri alındı.')
        revoke();
        setLoading(false);
        setDeleteModal(false);
        setUserDetails({});
      }
      else {
        message.error(response.data.message);
        setLoading(false);
      }
    }).catch(error => {
      clientError(error);
      setLoading(false);
    })
  }

  const deleteMethodHandler = () => {
    setLoading(true);
    deleteUser(userDetails.uuid).then(response => {
      if(response.status === 200) {
        message.success('Kullanıcı başarıyla kaldırıldı.')
        revoke();
        setLoading(false);
        setDeleteModal(false);
        setUserDetails({});
      }
      else {
        message.error(response.data.message);
        setLoading(false);
      }
    }).catch(error => {
      clientError(error);
      setLoading(false);
    })
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
    if(type === 'restore') {
      setRestoreModal(true);
    }
    if(type === 'edit') {
      setUserModal(true);
    }
    if(type === 'approve') {
      setApproveModal(true);
    }
  }

  const revoke = () => {
    setUserModal(false);
    setUserDetails({});
    getUserHandler();
  }

  const onSearch = (searchValue) => {
    setLoading(true);
    searchUserList(searchValue).then(response => {
      if (response.status === 200) {
        for (let user of response.data.attr) {
          user['key'] = user.uuid
        }
        setDataSource(response.data.attr);
      }
      setLoading(false);
    }).catch(err => {
      clientError(err);
      setLoading(false);
    })
  }

  return <Row gutter={[16, 16]}>
    <Col span={24}>
      <Button type='primary' onClick={() => setUserModal(true)}>Kullanıcı Ekle</Button>
    </Col>
    <Col span={8}>
      <Search placeholder="Kullanıcı Filtrele" onSearch={(searchValue) => onSearch(searchValue)} enterButton />
    </Col>
    <Col span={24}>
      <Table onRow={(record) => {
        return { style: {
        backgroundColor: record.txt_verified ? '#00000014' : '#fff'
        }};
      }} dataSource={dataSource} columns={columns} loading={loading}/>
    </Col>
    <Modal
      destroyOnClose={true}
      width={600}
      title={Object.values(userDetails).length === 0 ? 'Kullanıcı Oluştur' : 'Kullanıcıyı Düzenle'}
      open={userModal}
      okText='Tamam'
      cancelText='İptal'
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
      okText='Tamam'
      cancelText='İptal'
      onCancel={() => {
        setDeleteModal(false);
        setUserDetails({});
      }}
      onOk={deleteMethodHandler}>
      {userDetails.name + ' ' + userDetails.surname} kullanıcısı silinecek, onaylıyor musunuz?
    </Modal>
    <Modal
      destroyOnClose={true}
      width={600}
      title='Kullanıcı Geri Alma Uyarısı'
      open={restoreModal}
      okText='Tamam'
      cancelText='İptal'
      onCancel={() => {
        setRestoreModal(false);
        setUserDetails({});
      }}
      onOk={restoreMethodHandler}>
      {userDetails.name + ' ' + userDetails.surname} kullanıcısı geri alınacak, onaylıyor musunuz?
    </Modal>
    <Modal
      destroyOnClose={true}
      width={600}
      title='Kullanıcı Onaylama Uyarısı'
      open={approveModal}
      okText='Tamam'
      cancelText='İptal'
      onCancel={() => {
        setApproveModal(false);
        setUserDetails({});
      }}
      okButtonProps={{loading: loading}}
      onOk={approveMethodHandler}>
      {userDetails.name + ' ' + userDetails.surname} kullanıcısının TXT'si onaylanacak, onaylıyor musunuz?
    </Modal>
  </Row>;
}

export default UserList;